---
title: 🥷 Formal verification of LLZK circuits in Rocq
tags: [LLZK, formal verification, zero-knowledge]
authors: []
---

In this blog post, we present a short example about how we define reasoning rules in [Rocq](https://rocq-prover.org/) to formally verify the safety of zero-knowledge circuits written in [LLZK](https://github.com/Veridise/llzk-lib).

<!-- truncate -->

:::info Follow-up

This blog post is a follow-up to:

- [🥷 Semantics for LLZK in Rocq](2025-07-30-llzk-to-rocq-semantics.md)

The code we are referring to in this post is available in [github.com/formal-land/garden/Garden/LLZK](https://github.com/formal-land/garden/tree/main/Garden/LLZK).
:::

:::success Discuss with us!

The cost of a bug is extremely high in some industries (loss of life, loss of money, etc.), while there exist technologies like formal verification to make sure programs are correct for all cases.

Many companies and institutions like [Ethereum](https://ethereum.org/) are already using formal verification to secure their operations.

**Contact us** at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to discuss!&nbsp;👋

:::

<figure>
  ![Green forest](2025-07-31/green_forest.png)
</figure>

## 🧮 Reasoning rules

As we use a free monad to represent the effectful operations of LLZK, we need to define reasoning rules to evaluate each operator.

In order to optimize the proofs for the verification of safety properties (no under-constraints), we will assume that the execution of LLZK terms is always complete. By complete, we mean that there are no out-of-bound accesses in arrays. We also mean that we initialize each value exactly once, for the pattern where we declare an array and then set its elements in a second step, for example.

For the circuits, this is a reasonable assumption, as they are executed only once, unrolling all the loops and function calls in a large set of polynomial equations. For the `compute` functions that generate the witnesses, since they are stored off-chain, we can always upgrade them if we realize they are not complete. A proof of completeness for the `compute` functions could be done independently using a dedicated semantics.

We define a predicate:

```coq
{{ e 🔽 result , P }}
```

saying that a monadic computation `e` can reduce to the value `output`, and that its successful execution implies that the predicate `P` holds. The predicate `P` typically applies to the input and output field variables of the circuit. A typical predicate is:

$$
\text{output} = \text{expected\_output(\text{input})}
$$

stating that the circuit is deterministic.

The main reasoning rules are, in Rocq code:

```coq
Inductive t : forall {A : Set}, M.t A -> A -> Prop -> Prop :=
| Pure {A : Set} (value : A) :
  {{ M.Pure value 🔽 value, True }}
| AssertEqual {A : Set} (x1 x2 : A) :
  {{ M.AssertEqual x1 x2 🔽 tt, x1 = x2 }}
| CreateStruct {A : Set} (value : A) :
  {{ M.CreateStruct 🔽 value, True }}
| FieldWrite {A : Set} (field : A) :
  {{ M.FieldWrite field field 🔽 tt, True }}
| Let {A B : Set} (e : M.t A) (k : A -> M.t B) (value : A) (output : B) (P1 P2 : Prop) :
  {{ e 🔽 value, P1 }} ->
  (P1 -> {{ k value 🔽 output, P2 }}) ->
  {{ M.Let e k 🔽 output, P1 /\ P2 }}
| Implies {A : Set} (e : M.t A) (value : A) (P1 P2 : Prop) :
  {{ e 🔽 value, P1 }} ->
  (P1 -> P2) ->
  {{ e 🔽 value, P2 }}

where "{{ e 🔽 output , P }}" := (t e output P).
```

### `Pure`

There is nothing special to say about the rule of the `M.Pure` operator of the monad. We return the `value` that we are supposed to return, whether it is in a fully evaluated form or still as an expression with some free variables. The predicate is `True` as we do not assert any constraints.

### `AssertEqual`

For the `M.AssertEqual` operator, we always return the unit value `tt`, and we assert that the two parameters are equal. The predicate is the equality between the two parameters, as this is the condition to successfully execute the operator.

### `CreateStruct`

With this operator, we can declare a new structure element, whose fields are to be set later. This is a non-deterministic operation, and we let the user choose the value of the structure when verifying the circuit. However, in practice, there is only one possible choice as the value of the structure must be compatible with the write operations that will follow.

### `FieldWrite`

This operator is used to write a value in a field of a structure. We can apply this rule only if we have chosen the right value for the structure. We assume that all LLZK functions are complete, which can be checked at runtime, so that each declared structure has exactly one write operation, and we cannot make a read before the write.

### `Let`

The `Let` rule is for the binding operator of the monad. It combines the conditions `P1` and `P2` to form a new predicate `P1 /\ P2` for the execution of `e` and `k`. We can also use the knowledge of `P1` to reason about the execution of `k`.

### `Implies`

Finally, the `Implies` rule is used to simplify the expression of the predicate `P`. We generally wrap our proofs in an `Implies` call to have a clean predicate at the end. Otherwise, the final expression would contain a lot of clutter, like `True /\ ...` operations.

## 📝 Example

We now look at the specification and verification of the LLZK example we took at the beginning of this blog post series:

```mlir
function.def @global_add(%a: !felt.type, %b: !felt.type) -> !felt.type {
  %c = felt.add %a, %b
  function.return %c : !felt.type
}

struct.def @Adder {
  struct.field @sum : !felt.type {llzk.pub}

  function.def @compute(%a: !felt.type, %b: !felt.type) -> !struct.type<@Adder> {
    %self = struct.new : !struct.type<@Adder>
    %sum = function.call @global_add(%a, %b) : (!felt.type, !felt.type) -> (!felt.type)
    struct.writef %self[@sum] = %sum : !struct.type<@Adder>, !felt.type
    function.return %self : !struct.type<@Adder>
  }

  function.def @constrain(%self: !struct.type<@Adder>, %a: !felt.type, %b: !felt.type) {
    %sum = struct.readf %self[@sum] : !struct.type<@Adder>, !felt.type
    %c = function.call @global_add(%a, %b) : (!felt.type, !felt.type) -> (!felt.type)
    constrain.eq %sum, %c : !felt.type
    function.return
  }
}
```

### `global_add`

For the `global_add` function, we write the following specification in the file [Garden/LLZK/verification.v](https://github.com/formal-land/garden/blob/main/Garden/LLZK/verification.v):

```coq
Lemma global_add_eq {p} `{Prime p} (x y : Felt.t) :
    {{ global_add x y 🔽 (x + y) mod p, True }}.
```

The generated Rocq translation of the `global_add` function is:

```coq
Definition global_add {p} `{Prime p} (arg_fun_0 : Felt.t) (arg_fun_1 : Felt.t) : M.t Felt.t :=
  let var_0 : Felt.t := BinOp.add arg_fun_0 arg_fun_1 in
  M.Pure var_0.
```

We can now prove the specification with the application of the single rule `Run.Pure`, as the code is purely functional:

```coq
Proof.
  apply Run.Pure.
Qed.
```

Most of the auxiliary functions or the `compute` functions will have a specification of a similar form, where the predicate is `True`.

### `compute`

The translation of the `compute` function is:

```coq
Definition compute {p} `{Prime p} (arg_fun_0 : Felt.t) (arg_fun_1 : Felt.t) : M.t Adder.t :=
  let* var_self : Adder.t := M.CreateStruct in
  let* var_0 : Felt.t := global_add arg_fun_0 arg_fun_1 in
  let* _ : unit := M.FieldWrite var_self.(Adder.sum) var_0 in
  M.Pure var_self.
```

Here, there are some side-effects composed with the `M.Let` operator, noted `let*`. We can apply the `Run.Let` rule to prove the specification:

```coq
Definition spec {p} `{Prime p} (x y : Felt.t) : Adder.t :=
  {|
    Adder.sum := (x + y) mod p;
  |}.

Lemma compute_eq {p} `{Prime p} (x y : Felt.t) :
  {{ Adder.compute x y 🔽
    spec x y, True
  }}.
Proof.
  unfold Adder.compute.
  eapply Run.Implies. {
    eapply Run.Let. {
      eapply Run.CreateStruct with (value := Adder.Build_t _).
    }
    intros _.
    eapply Run.Let. {
      apply global_add_eq.
    }
    intros _.
    eapply Run.Let. {
      eapply Run.FieldWrite.
    }
    intros _.
    apply Run.Pure.
  }
  easy.
Qed.
```

The specification states that we are creating a structure with the addition modulo `p` of the two input parameters. We make the proof with a succession of `Run.Let` rules. For the line:

```coq
let* var_self : Adder.t := M.CreateStruct in
```

we apply the `Run.CreateStruct` rule, with an existential variable `_` for the field of the structure. This existential variable is later unified with the right value when we evaluate the line:

```coq
let* _ : unit := M.FieldWrite var_self.(Adder.sum) var_0 in
```

which forces its value to be `var_0`.

The last tactic:

```coq
easy.
```

at the end of the proof is there to aggregate the predicate `True /\ ... /\ True` that we obtain from the `Run.Let` rules into a single `True`.

### `constrain`

The translation of the `constrain` function is:

```coq
Definition constrain {p} `{Prime p}
    (arg_fun_0 : Adder.t) (arg_fun_1 : Felt.t) (arg_fun_2 : Felt.t) :
    M.t unit :=
  let var_0 : Felt.t := arg_fun_0.(Adder.sum) in
  let* var_1 : Felt.t := global_add arg_fun_1 arg_fun_2 in
  let* _ : unit := M.AssertEqual var_0 var_1 in
  M.Pure tt.
```

We specify it as follows:

```coq
Lemma contrain_implies {p} `{Prime p}
    (self : Adder.t)
    (x y : Felt.t) :
  let self := map_mod self in
  {{ Adder.constrain self x y 🔽
    tt,
    self = spec x y
  }}.
```

Here, we always return the unit value `tt`, and we assert that the `self` parameter must be equal to the expected structure containing the sum of the two input parameters. Note that we use the `map_mod` function to make sure to apply the modulo operation to the fields of the structure, as otherwise they could be arbitrary `Z` values. This is a way to express that we consider equality to be modulo `p`.

:::note No under-constraints

This specification states that there are no under-constraints in the `constrain` function. Indeed, the `self` parameter is only allowed to be equal to a single value `spec x y`. However, we do not show that the circuit is not over-constrained: we show that all solutions must be equal to `spec x y`, but there might be no solutions, and this statement would hold.

The no over-constraints property is generally considered less critical than the no under-constraints property, and easier to formally verify: it amounts to verifying that the expected output validates all the assertions of the circuit.

:::

For the proof, we again apply the `Run.t` rules in a straightforward way:

```coq
Proof.
  unfold Adder.constrain.
  eapply Run.Implies. {
    eapply Run.Let. {
      apply global_add_eq.
    }
    intros _.
    eapply Run.Let. {
      apply Run.AssertEqual.
    }
    intros _.
    apply Run.Pure.
  }
  unfold spec.
  hauto lq: on.
Qed.
```

## ✒️ Conclusion

We have seen how to formally specify and verify the safety of an LLZK circuit in Rocq. There are a few things that need to be improved now:

- Adding more automation to the proofs: as you can see, they are rather verbose, even if LLM auto-complete catches repetitive patterns.
- Adding more support for the LLZK language, translating bigger examples (in the thousands of lines, the one above is 500 lines long). Indeed, other `.llzk` files use features that we do not support yet, like arrays whose size is dynamic with respect to a `for` loop counter. Our plan is to add dynamic typing rules capabilities in a refined version of our reasoning rules.

> You want to secure your code? Contact us! ⇨ [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
