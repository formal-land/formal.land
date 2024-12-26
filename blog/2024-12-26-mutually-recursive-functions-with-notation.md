---
title: 🦄 Mutually recursive functions with notation
tags: [recursion, notation, mutual]
authors: []
---

In this blog post, we present a technique with the [<img src="https://raw.githubusercontent.com/coq/rocq-prover.org/refs/heads/main/rocq-id/logos/SVG/icon-rocq-orange.svg" height="18px" />&nbsp;Rocq/Coq](https://rocq-prover.org/) theorem prover to define mutually recursive functions using a notation. This is sometimes convenient for types defined using a container type, such as types depending on a list of itself.

<!-- truncate -->

:::success Ask for the highest security!

To ensure your code is fully secure today, contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

We exclusively focus on formal verification to offer you the highest degree of security for your application.

We currently work with some of the leading blockchain entities, such as:

- The [Ethereum Foundation](https://ethereum.foundation/)
- The [Sui Foundation](https://sui.io/about)
- Previously, the [Aleph Zero](https://alephzero.org/) and [Tezos](https://tezos.com/) foundations

:::

<figure>
  ![Forest](2024-12-26/two-trees.jpg)
</figure>

## 🔍 Example

Here is a typical example of a type defined using a container of itself, written in [🦀&nbsp;Rust](https://www.rust-lang.org/):

```rust
struct Trees<A>(Vec<Tree<A>>);

enum Tree<A> {
    Leaf,
    Node { data: A, children: Trees<A> },
}
```

These two definitions are mutually dependent. We choose to represent it in Rocq/Coq with the following definition:

```coq
Inductive Tree (A : Set) : Set :=
| Leaf : Tree A
| Node : A -> list (Tree A) -> Tree A.

Definition Trees (A : Set) : Set :=
  list (Tree A).
```

If we define a recursive function on this type, for example, to compute the sum of all the values in the tree, we would naturally write a function that iterates both on:

- The tree constructors,
- The list of the `Node` case.

## 📝 First solution

Here is a first attempt to define a `sum` function that adds all the elements of the tree:

```coq
Fixpoint sum_tree {A : Set} (f : A -> nat) (t : Tree A) : nat :=
  match t with
  | Leaf => 0
  | Node a ts => f a + sum_trees f ts
  end

with sum_trees {A : Set} (f : A -> nat) (ts : Trees A) : nat :=
  match ts with
  | nil => 0
  | t :: ts => sum_tree f t + sum_trees f ts
  end.
```

This definition does not work as the `Tree` type is not mutually recursive, but the function `sum_tree` is. The error message is:

```
Error: Cannot guess decreasing argument of fix.
```

A first solution is to define the function `sum_trees` as a local definition in `sum_tree`:

```coq
Fixpoint sum_tree {A : Set} (f : A -> nat) (t : Tree A) : nat :=
  let fix sum_trees (ts : Trees A) : nat :=
    match ts with
    | nil => 0
    | t :: ts => sum_tree f t + sum_trees ts
    end in
  match t with
  | Leaf => 0
  | Node a ts => f a + sum_trees ts
  end.
```

This definition gets accepted by the prover!

## 🚀 Second solution

An issue is that we cannot call `sum_trees` directly as its definition is hidden in the one of `sum_tree`. This is a problem if further top-level definitions depend on `sum_trees`, or if we want to verify intermediate properties about `sum_trees` itself.

A solution we use for this kind of problem is to add a notation to make `sum_trees` a top-level definition while keeping the mutual recursion with `sum_tree`:

```coq
Reserved Notation "'sum_trees".

Fixpoint sum_tree {A : Set} (f : A -> nat) (t : Tree A) : nat :=
  match t with
  | Leaf => 0
  | Node a ts => f a + 'sum_trees _ f ts
  end

where "'sum_trees" := (fix sum_trees (A : Set) (f : A -> nat) (ts : Trees A) : nat :=
  match ts with
  | nil => 0
  | t :: ts => sum_tree f t + sum_trees _ f ts
  end).

Definition sum_trees {A : Set} := 'sum_trees A.
```

Here, both `sum_tree` and `sum_trees` are defined as top-level, and the mutually recursive definition is accepted. Note that we have to make the type `A` explicit in the notation, as implicit parameters are not allowed there.

## ✒️ Conclusion

We have shown a technique that is sometimes useful for us to define complex, mutually dependent data structures. This was recently useful for defining the `ValueImpl` type in the type-checker of [Move](https://sui.io/move) for the blockchain [Sui](https://sui.io/).

You can tell us what you think or if you prefer another way to define mutually recursive functions!

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::
