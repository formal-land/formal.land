---
title: ◼️ A formal verification tool for Noir – 2
tags: [Noir, smart contract, circuits]
authors: []
---

In this blog post, we continue our presentation about our formal verification tool for [◼️&nbsp;Noir](https://noir-lang.org/) programs [coq-of-noir](https://github.com/formal-land/coq-of-noir). Noir is a Rust-like language to write programs designed to run efficiently in zero-knowledge environments. It has a growing popularity and a focus on providing optimized libraries for common needs, such as a [base64](https://github.com/noir-lang/noir_base64) library using 🧠&nbsp;field arithmetic that we use in this series of blog posts.

Here we present the details of our semantic rules to show that a Noir program has an expected behavior for any possible parameters. We focus, in particular, on our memory-handling approach and the definition of loops.

<!-- truncate -->

:::success Require the strongest security!

To ensure your code is fully secure today, contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

Formal verification goes further than traditional audits to make 100% sure you cannot lose your funds, thanks to **mathematical reasoning on the code**. It can be integrated into your CI pipeline to check that every commit is fully correct **without doing a whole audit again**.

We make bugs such as the [DAO hack](https://www.gemini.com/fr-fr/cryptopedia/the-dao-hack-makerdao) ($60 million stolen) virtually **impossible to happen again**.

:::

<figure>
  ![Noir](2024-11-15/noir.webp)
</figure>

## ⚙️ Semantic rules

In the previous blog post [◼️ A formal verification tool for Noir – 1](/blog/2024/11/01/tool-for-noir-1) we presented our general translation from the Noir syntax to [🐓&nbsp;Coq](https://coq.inria.fr/), as well as the free monad we use to represent side-effects such as mutations. We now need to define semantic rules to be able to say that a particular translated Noir program evaluates to a certain value.

For expressions that do not have side effects we rely on the usual reduction rules of Coq. This is really convenient as we can then reuse the existing Coq tactics and automation to reason about pure expressions.

For side-effects like mutations or function calls, which we also consider as side-effects as there might be infinite recursion, we use a big-step semantics with the following predicate:

```coq
{{ p, state_in | e ⇓ output | state_out }}
```

It says that for a certain prime number&nbsp;$p$ which is the size of the arithmetic field, for an initial state&nbsp;`state_in`, the expression&nbsp;`e` evaluates to the output&nbsp;`output` and the final state&nbsp;`state_out`.

We define this rule with a Coq `Inductive` with one case per case in our free monad for effects. This is similar to the work we have done for Rust with [coq-of-rust](https://github.com/formal-land/coq-of-rust). Here are the relevant rules.

- `Pure`
  Expressions without side effects evaluate to their value and do not change the state. Note that in Coq, we do not distinguish between expressions and values, as all values are equal modulo evaluation rules, so we can directly use the expression as the output.
  ```coq
  | Pure :
      {{ p, state_out | LowM.Pure output ⇓ output | state_out }}
  ```
- `GetFieldPrime`
  To obtain the current size of the field&nbsp;$p$ we use the `GetFieldPrime` primitive. This is a side-effect as it depends on the current settings to compile the Noir program in circuits. We use this operation as an internal operation to define the arithmetic operations in the field by computing modulo&nbsp;$p$.
  ```coq
  | CallPrimitiveGetFieldPrime
      (k : Z -> M.t)
      (state_in : State) :
    {{ p, state_in | k p ⇓ output | state_out }} ->
    {{ p, state_in |
      LowM.CallPrimitive Primitive.GetFieldPrime k ⇓ output
    | state_out }}
  ```
  We use a semantics by continuation with a continuation&nbsp;`k` for most of the operations of the monad. Instead of directly returning some result, we pass it to the continuation and evaluate it. In our experience, this simplifies the reasoning on code instead of having to use another monadic operation to pass this value.
- `CallClosure`
  We define a closure as a function from a list of values to some monadic expression. In our translation, terms are totally untyped; in particular we do not enforce any arity for the functions. In case a wrong number of arguments is passed to a function, we will have a runtime error. This is a trade-off to keep the translation simple and to avoid having to define a type system for Noir.
  ```coq
  | CallClosure
      (f : list Value.t -> M.t) (args : list Value.t)
      (k : Result.t -> M.t)
      (output_inter : Result.t)
      (state_in state_inter : State) :
    let closure := Value.Closure (existS (_, _) f) in
    {{ p, state_in | f args ⇓ output_inter | state_inter }} ->
    {{ p, state_inter | k output_inter ⇓ output | state_out }} ->
    {{ p, state_in | LowM.CallClosure closure args k ⇓ output | state_out }}
  ```
  To call a function, we first evaluate its body on the arguments and then the continuation&nbsp;`k`. If the result is some `output` and `state_out`, we can say that the whole expression evaluates to `output` and `state_out`.
- `Let`
  The `Let` primitive is the monadic bind. It allows to sequentially compose the execution of two expressions. We first evaluate the first expression, then the second one with the result of the first one.
  ```coq
  | Let
      (e : M.t)
      (k : Result.t -> M.t)
      (output_inter : Result.t)
      (state_in state_inter : State) :
    {{ p, state_in | e ⇓ output_inter | state_inter }} ->
    {{ p, state_inter | k output_inter ⇓ output | state_out }} ->
    {{ p, state_in | LowM.Let e k ⇓ output | state_out }}
  ```

## 🐘 Memory handling

In Noir, you can make a new variable mutable with the keyword `let mut`:

```rust
let mut result: [u8; InputElements] = [0; InputElements];
```

Then you can assign a new value to this variable or its content with the `=` operator:

```rust
result[i] = Base64Decoder.get(input_byte as Field);
```

There is basic pointer manipulation with the `&` operator to get a reference to a variable and the `*` operator to dereference a pointer. You can even pass a mutable reference to a function to modify the value of a variable. There is no deallocation of memory, which entirely removes the need for a garbage collector or deallocation strategy. This is because Noir programs are supposed to be very short-lived.

To handle all expressions in a uniform way, we consider that each Noir expression is an address to its content. For most (intermediate) values, which are not mutable, the address is the value itself. For mutable values, we use a fresh address for each `let mut` assignment.

:::info Thanks

As [GitHub Copilot](https://github.com/features/copilot) correctly suggests me, this is similar to the approach we have taken for Rust in `coq-of-rust`. Thanks for following what we are doing!&nbsp;🙏

:::

To simplify the proofs, we let the user input a memory model of its choice. The only constraint is to provide memory operations for `read`, `write`, and `alloc`, and to make sure that these operations are consistent. Once it is done, here are the rules for the memory handling of mutable references:

- `StateAlloc`
  ```coq
  | CallPrimitiveStateAlloc
      (value : Value.t)
      (address : Address)
      (k : Value.t -> M.t)
      (state_in state_in' : State) :
    let pointer := Pointer.Mutable (Pointer.Mutable.Make address []) in
    State.read address state_in = None ->
    State.alloc_write address state_in value = Some state_in' ->
    {{ p, state_in' | k (Value.Pointer pointer) ⇓ output | state_out }} ->
    {{ p, state_in | LowM.CallPrimitive (Primitive.StateAlloc value) k ⇓ output | state_out }}
  ```
- `StateRead`
  ```coq
  | CallPrimitiveStateRead
      (address : Address)
      (value : Value.t)
      (k : Value.t -> M.t)
      (state_in : State) :
    State.read address state_in = Some value ->
    {{ p, state_in | k value ⇓ output | state_out }} ->
    {{ p, state_in | LowM.CallPrimitive (Primitive.StateRead address) k ⇓ output | state_out }}
  ```
- `StateWrite`
  ```coq
  | CallPrimitiveStateWrite
      (value : Value.t)
      (address : Address)
      (k : unit -> M.t)
      (state_in state_in' : State) :
    State.alloc_write address state_in value = Some state_in' ->
    {{ p, state_in' | k tt ⇓ output | state_out }} ->
    {{ p, state_in |
      LowM.CallPrimitive (Primitive.StateWrite address value) k ⇓ output
    | state_out }}
  ```

When using these rules to show that a certain Noir program evaluates to an expression, one has to make the right choice for the address used to allocate the value. This choice is arbitrary but can make the proof more or less complex later. The read and write operations are deterministic.

## ➰ Loops

There is only one kind of loop in Noir, bounded&nbsp;`for` loops:

```rust
for i in 0..InputElements {
    let input_byte = input[i];
    result[i] = Base64Decoder.get(input_byte as Field);
}
```

The index&nbsp;`i` evolves in between statically known bounds. As such, these bounds always terminate, which is a requirement for formal verification to proceed! As a result, we do not need to introduce a dedicated monadic primitive for the loops and can define them with a recursive function:

```coq
Fixpoint for_nat (end_ : Z) (fuel : nat) (body : Z -> M.t) {struct fuel} : M.t :=
  match fuel with
  | O => pure (Value.Tuple [])
  | S fuel' =>
    let* _ := body (end_ - Z.of_nat fuel) in
    for_nat end_ fuel' body
  end.

Definition for_Z (start end_ : Z) (body : Z -> M.t) : M.t :=
  for_nat end_ (Z.to_nat (end_ - start)) body.
```

Note that we do not handle `break` or `continue` yet but propagate assert failures with `let*`. We _prove_ the following reasoning rule for loops:

```coq
Lemma For {State Address : Set} `{State.Trait State Address}
    (p : Z) (state_in : State)
    (integer_kind : IntegerKind.t) (start : Z) (len : nat) (body : Value.t -> M.t)
    {Accumulator : Set}
    (inject : State -> Accumulator -> State)
    (accumulator_in : Accumulator)
    (body_expression : Z -> MS! Accumulator unit)
    (H_body : forall (accumulator_in : Accumulator) (i : Z),
      let output_accumulator_out := body_expression i accumulator_in in
      {{ p, inject state_in accumulator_in |
        body (M.alloc (Value.Integer integer_kind i)) ⇓
        Panic.to_result (fst output_accumulator_out)
      | inject state_in (snd output_accumulator_out) }}
    ) :
  let output_accumulator_out :=
    foldS!
      tt
      (List.map (fun offset => start + Z.of_nat offset) (List.seq 0 len))
      (fun (_ : unit) => body_expression)
      accumulator_in in
  {{ p, inject state_in accumulator_in |
    M.for_
      (Value.Integer integer_kind start)
      (Value.Integer integer_kind (start + Z.of_nat len))
      body ⇓
    Panic.to_result (fst output_accumulator_out)
  | inject state_in (snd output_accumulator_out) }}.
```

It is a little bit involved but basically says that if the body of the loop evaluates to an expression for each possible iteration, then the whole loop evaluates to the recursive function `foldS!` using the modified memory as an accumulator.

## ✒️ Conclusion

We have shown how we define the semantic rules for the Noir language in Coq, for the general monadic primitives, memory, and loops.

In the next blog post, we will apply these reasoning principles to give a semantics to the `base64` library of Noir.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::
