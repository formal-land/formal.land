---
title: 🥷 Semantics for LLZK in Rocq
tags: [LLZK, semantics, zero-knowledge]
authors: []
---

[LLZK](https://github.com/Veridise/llzk-lib) is a language designed to implement [zero-knowledge](https://en.wikipedia.org/wiki/Zero-knowledge_proof) circuits. We wrote a translation tool from this language to a representation in the formal language [Rocq](https://rocq-prover.org/).

In this blog post, we present how we give a semantics to all the primitive operations of LLZK in Rocq. The end-goal is to provide a way to formally verify that a zero-knowledge circuit is safe, that is to say, without under-constraints.

<!-- truncate -->

:::info Follow-up

This blog post is a follow-up to:

- [🥷 Beginning of a formal verification tool for LLZK](2025-07-28-llzk-to-rocq-beginning.md)

The code we are referring to in this post is available in [github.com/formal-land/garden/Garden/LLZK](https://github.com/formal-land/garden/tree/main/Garden/LLZK).
:::

:::success Discuss with us!

The cost of a bug is extremely high in some industries (loss of life, loss of money, etc.), while there exist technologies like formal verification to make sure programs are correct for all cases.

Many companies and institutions like [Ethereum](https://ethereum.org/) are already using formal verification to secure their operations.

**Contact us** at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to discuss!&nbsp;👋

:::

<figure>
  ![Green forest](2025-07-30/green_forest.png)
</figure>

## 🪆 Data types

Here are the main data types that we see appearing in LLZK code examples:

- `Felt.t`, for integers modulo&nbsp;$p$ a large prime number. We represent them with the type of unbounded integers $\mathbb{Z}$, and explicitly compute the modulo on the result of each operation.
- `i1`, for boolean values. We represent them with the boolean type `bool` of Rocq.
- `Index.t` for length or indexes in arrays. We represent them with the type `nat` of Rocq (non-negative integers).
- `Array.t` for arrays, parametrized by a list of dimensions and a type of elements. We design a custom type for these.
- Structures, defined in an LLZK module with a list of fields. We represent them with a record type in Rocq.

### `Felt.t`

We define the primitive arithmetic operations on `Felt.t` as pure functions in Rocq, parametrized by an implicit prime number $p$. For example, for the binary operations we do:

```coq
Module BinOp.
  Definition add {p} `{Prime p} (x y : Z) : Z :=
    (x + y) mod p.

  Definition sub {p} `{Prime p} (x y : Z) : Z :=
    (x - y) mod p.

  Definition mul {p} `{Prime p} (x y : Z) : Z :=
    (x * y) mod p.

  Definition div {p} `{Prime p} (x y : Z) : Z :=
    (x / y) mod p.

  Definition mod_ {p} `{Prime p} (x y : Z) : Z :=
    (x mod y) mod p.
End BinOp.
```

We do not check if the parameters are in the bounds $0 \leq n < p$, but we apply the modulo operation on the result of each function. This is a convention that we will try to use for the rest of the formalizations.

### `Array.t`

We represent arrays as a record wrapping a `get` function:

```coq
Record t {A : Set} {Ns : list nat} := {
  get : MultiIndex.t Ns -> A;
}.
Arguments t : clear implicits.
```

We use a function rather than a list, as in our experience, for many zero-knowledge circuits, there exists an expression relating the values in an array to their indices. A limitation is that we need to find a default value for out-of-bounds indexes. This is generally easy to find, as most data structures are built around the `Felt.t` type with zero as a default value.

Because arrays can be multi-dimensional, define a type for multi-dimensional indices instead of using a plain `nat`:

```coq
Module MultiIndex.
  Fixpoint t (Ns : list nat) : Set :=
    match Ns with
    | nil => unit
    | _ :: Ns => Index.t * t Ns
    end.
End MultiIndex.
```

A multi-index is simply a tuple with as many integers as there are dimensions. We prefer to use an array with multi-indices instead of arrays of arrays, in order to have a representation following the choices of LLZK.

There is an `array.extract` operator in LLZK, to extract a sub-array from an array, which isgeneralized to the case of multidimensional arrays. We define it as:

```coq
Definition extract {A : Set} {Ns Ms : list nat}
    (array : t A (Ns ++ Ms))
    (indexes : MultiIndex.t Ns) :
    t A Ms :=
  {|
    get indexes' := array.(get) (MultiIndex.concat indexes indexes');
  |}.
```

It takes an array whose multi-dimension is a list of dimensions `Ns` followed by dimensions `Ms`. It returns a sub-array whose multi-dimension is `Ms`. It relies on an operator `MultiIndex.concat` to concatenate two multi-indexes of the right dimensions:

```coq
Fixpoint concat {Ns Ms : list nat}
    (indexes : MultiIndex.t Ns)
    (indexes' : MultiIndex.t Ms) :
    MultiIndex.t (Ns ++ Ms) :=
  match Ns, indexes with
  | nil, _ => indexes'
  | _ :: Ns, (index, indexes) => (index, concat indexes indexes')
  end.
```

### Structures

We found that directly using the `Record` construct of Rocq to represent structures was enough. Here is how a typical structure is defined in LLZK:

```mlir
struct.def @MatrixConstrain {
    struct.field @check0 : !struct.type<@ArrayConstrain<[7, 11]>>
    struct.field @check1 : !struct.type<@ArrayConstrain<[13, 17]>>
}
```

This is translated to a record type in Rocq:

```coq
Module MatrixConstrain.
  Record t : Set := {
    check0 : ArrayConstrain.t 7 11;
    check1 : ArrayConstrain.t 13 17;
  }.
End MatrixConstrain.
```

## 🔮 Monad

While we try to represent as many operations as possible in the purely functional fragment of Rocq, since it simplifies formal reasoning, for some operations we must use a monad. The main monadic operation is the check of equality between two integers modulo $p$. This is the main building block for circuits, to ensure that only valid witnesses are accepted.

We design our monad as a free-monad, in order to be able to define the reasoning rules independently:

```coq
Module M.
  Inductive t : Set -> Set :=
  | Pure {A : Set} (value : A) : t A
  | AssertEqual {A : Set} (x1 x2 : A) : t unit
  | AssertIn {A : Set} {Ns : list nat} (x : A) (array : Array.t A Ns) : t unit
  | AssertBool (value : bool) : t unit
  | CreateStruct {A : Set} : t A
  | ArrayWrite {A : Set} {Ns : list nat}
      (array : Array.t A Ns)
      (indexes : Array.MultiIndex.t Ns)
      (value : A) :
      t unit
  | FieldWrite {A : Set} (field : A) (value : A) : t unit
  | Let {A B : Set} (e : t A) (k : A -> t B) : t B
  .
End M.
```

The two standard monadic operators are:

- `Pure` that we note `M.Pure`, and
- `Let` that we note `let* x := ... in ...`.

We also define some primitives, in particular:

- `AssertEqual` typically used to enforce the equality between two integers modulo $p$.
- `AssertIn` to check that an element is in an array.
- `CreateStruct` to instantiate a value for a structure in a non-deterministic way. The structure is to be defined in subsequent write operations.
- `FieldWrite` to write a value in a field of a structure and force its definition.

## ✒️ Conclusion

We have seen how to define the main primitives for the LLZK language in Rocq. In the upcoming blog posts, we will show how to reason about LLZK circuits in Rocq, thanks to the introduction of reasoning rules for each monadic operation.

> You want to secure your code? Contact us! ⇨ [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
