---
title: 🦀 Verification of one instruction of the Move's type-checker
tags: [Rust, Move, Sui, type-checker]
authors: []
---

This is the last article of a series of blog post presenting our formal verification effort in [<img src="https://raw.githubusercontent.com/coq/rocq-prover.org/refs/heads/main/rocq-id/logos/SVG/icon-rocq-orange.svg" height="18px" />&nbsp;Rocq/Coq](https://rocq-prover.org/) to ensure the correctness of the type-checker of the [Move language](https://sui.io/move) for [Sui](https://sui.io/).

Here we show how the formal proof works to check that the type-checker is correct on a particular instruction, for any possible initial states. The general idea is to symbolically execute the code step by step on the type-checker side, accumulating properties about the stack assuming the type-checker succeeds, and then to show that the interpreter will produce a stack of the expected type as a result.

<!-- truncate -->

Previous post:

- [🦀 Example of verification for the Move's checker of Sui](/blog/2024/11/14/sui-move-checker-abstract-stack)

:::success Ask for the highest security!

When millions are at stake, bug bounties are not enough.

How do you ensure your security audits are exhaustive?

The best way to do this is to use **formal verification**.

This is what we provide as a service. **Contact us** at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to make sure your code is safe!&nbsp;🛡️

We cover **Rust**, **Solidity**, and **ZK systems**.

:::

<figure>
  ![Green forest with water](2025-01-13/green-forest-with-water.webp)
</figure>

## 🦀 The Rust code

We are verifying the type-checking for the Move bytecode instruction `CastU8`. This instruction takes the top-most element of the stack, checks that it is an integer, and pushes it back on the stack as a `U8` if it is in the right range or fails with an error `StatusCode::ARITHMETIC_ERROR` otherwise.

Here is the code of the interpreter:

```rust
Bytecode::CastU8 => {
    gas_meter.charge_simple_instr(S::CastU8)?;
    let integer_value =
        interpreter.operand_stack.pop_as::<IntegerValue>()?;
    interpreter
        .operand_stack
        .push(Value::u8(integer_value.cast_u8()?))?;
}
```

We ignore the gas metering for now. The `pop_as` method pops the top-most element of the stack and checks that it is an integer. The `cast_u8` method checks that the integer is in the right range (`0` to `255`) and returns the value as a `U8`. The `push` method pushes the value back on the stack. The question mark operator `?` is used to propagate errors.

Here is the corresponding code in the type-checker:

```rust
Bytecode::CastU8 => {
    let operand = safe_unwrap_err!(verifier.stack.pop());
    if !operand.is_integer() {
        return Err(verifier.error(
            StatusCode::INTEGER_OP_TYPE_MISMATCH_ERROR,
            offset,
        ));
    }
    verifier.push(meter, ST::U8)?;
}
```

It pops the top-most element of the stack of types (we do not have values here) and checks that it is an integer type. If it is not, it returns an error. Otherwise, it pushes the type `U8` on the stack. Note that there are no ways to know, in the type-checker, if the value is in the right range.

## 🐦‍⬛ The Rocq translation

In previous posts, we covered our manual translation of the Rust code in Rocq. We repeat it here. The interpreter code in Rocq:

```coq
| Bytecode.CastU8 =>
  letS!? integer_value := liftS! State.Lens.interpreter (
    liftS! Interpreter.Lens.operand_stack $
      Stack.Impl_Stack.pop_as IntegerValue.t
  ) in
  letS!? integer_value :=
    returnS! $ IntegerValue.cast_u8 integer_value in
  doS!? liftS! State.Lens.interpreter (
    liftS! Interpreter.Lens.operand_stack $
      Stack.Impl_Stack.push $
      ValueImpl.U8 integer_value
  ) in
  returnS!? InstrRet.Ok
```

The type-checker code in Rocq:

```coq
| Bytecode.CastU8 => 
  letS! operand :=
    liftS! TypeSafetyChecker.lens_self_stack AbstractStack.pop in
  letS! operand := return!toS! $ safe_unwrap_err operand in
  if negb $ SignatureToken.is_integer operand then
    returnS! $
      Result.Err $
      TypeSafetyChecker.Impl_TypeSafetyChecker.error
        verifier StatusCode.INTEGER_OP_TYPE_MISMATCH_ERROR offset
  else
    TypeSafetyChecker.Impl_TypeSafetyChecker.push SignatureToken.U8
```

## 📜 Formal statement

Here is the formal statement of the property we want to prove to ensure the correctness of the type-checker:

```coq
Lemma progress
  (* [...] parameters and hypothesis *)
  (* We assume that the initial state is well-typed *)
  IsInterpreterContextOfType.t locals interpreter type_safety_checker ->
  match
    verify_instr instruction pc type_safety_checker,
    execute_instruction ty_args function resolver instruction state
  with
  | Panic.Value (Result.Ok _, type_safety_checker'),
    Panic.Value (Result.Ok _, state') =>
    let '{|
      State.pc := _;
      State.locals := locals';
      State.interpreter := interpreter';
    |} := state' in
    IsInterpreterContextOfType.t locals' interpreter' type_safety_checker'
  (* If the type-checker succeeds, then the interpreter cannot return a panic *)
  | Panic.Value (Result.Ok _, _), Panic.Panic _ => False
  (* Other errors are allowed *)
  | Panic.Value (Result.Ok _, _), Panic.Value (Result.Err _, _)
  | Panic.Value (Result.Err _, _), _
  | Panic.Panic _, _ => True
  end.
```

This lemma is in the file [proofs/move_bytecode_verifier/type_safety.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/proofs/move_bytecode_verifier/type_safety.v). It compares the behavior of the type-checker and the interpreter when executing an instruction. If the type-checker succeeds, then the interpreter cannot return a panic. If the interpreter also succeeds, then the new state is well-typed according to the types returned by the type-checker.

## 🛡️ Proof time

We prove the statement above by reasoning about all possible instructions. For the `CastU8` instruction, the Rocq proof is as follows:

```coq
{ guard_instruction Bytecode.CastU8.
  destruct_abstract_pop.
  step; cbn; [exact I|].
  destruct_abstract_push.
  step; cbn; (try easy); (try now destruct operand_ty);
    repeat (step; cbn; try easy);
    constructor; cbn; try assumption;
    sauto lq: on.
}
```

Here is what this script does:

- `guard_instruction Bytecode.CastU8` checks that the current instruction is `CastU8`. This helps debugging if we are not at the right place.
- `destruct_abstract_pop` pops the top-most element of the stack of types and gives it the name `operand_ty`. It handles the cases where the stack is empty.
- `step; cbn; [exact I|]` is a command to handle the next `if` in the code of the type-checker. We are only interested in the success branch (`else` branch in this case).
- `destruct_abstract_push` pushes the type `U8` on the stack of types.

Then, there is a set of automated tactics iterating over all the possible types of values that can be on the stack. Just before the end of the proof, we have the following proof state:

```coq
---------------------------------------
(1/6)
List.Forall2 IsValueImplOfType.t (ValueImpl.U8 z :: x0)
  (SignatureToken.U8 :: AbstractStack.flatten stack_ty0)
```

This proof state is repeated identically six times, once for each possible integer type (`U8`, `U16`, `U32`, `U64`, `U128`, `U256`). It says that the stack of values:

```coq
ValueImpl.U8 z :: x0
```

must have the stack of types:

```coq
SignatureToken.U8 :: AbstractStack.flatten stack_ty0
```

The value `z` is the result of the `cast_u8` function in the interpreter. The `flatten` function is used to flatten the stack of types that may contain duplicates.

For the head of the stack the property is trivially true. For the tail of the stack, we use one of the hypotheses from the context, coming from the fact that the stack was initially well-typed and with did not modify the tail.

## ✒️ Conclusion

We have show how to formally verify that the type-checker for the Move's bytecode virtual machine is correct on a simple instruction `CastU8`. This is part of a larger effort to ensure the correctness of the whole type-checker.

Other instructions operating on atomic types (integers, booleans, addresses) are similar to this one. The most complex instructions are the ones operating on references and data structures like vectors and structs. These require more work, and we have not yet tackled them.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::
