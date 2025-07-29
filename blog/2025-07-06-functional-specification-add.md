---
title: 🦀 Functional specification of the ADD instruction of the EVM
tags: [Rust, EVM, coq-of-rust, functional specification]
authors: [guillaume_claret]
---

In this blog post, we present how we specify and verify the implementation of the ADD instruction of the [EVM](https://www.evm.codes/) virtual machine in Rust.

We give a functional specification, meaning that we show the implementation to be equivalent to an idealized version written in the Rocq language. As the Rust code for this instruction involves rather advanced features of Rust, the same techniques could apply to verify a large set of Rust programs.

<!-- truncate -->

:::success Work with us!

With **formal verification**, you can **guarantee** that your code is safe, given the specifications, and you do not need to re-audit **from scratch** after each upgrade.

**Contact us** at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to discuss how to make sure your code is safe to deploy and upgrade!&nbsp;🛡️

We cover **Rust**, **Solidity**, and **ZK systems**.

:::

<figure>
  ![Green forest](2025-07-06/forest.webp)
</figure>

## 🎯 Target

Here is the implementation of the ADD instruction in [Revm](https://github.com/bluealloy/revm), probably the most popular implementation of the EVM in Rust:

```rust
pub fn add<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    _host: &mut H,
) {
    gas!(interpreter, gas::VERYLOW);
    popn_top!([op1], op2, interpreter);
    *op2 = op1.wrapping_add(*op2);
}
```

It takes the two topmost values of the stack, adds them, and stores the result on the top of the stack. It also computes how much gas is consumed. Some code is hidden in the macros `gas!` and `popn_top!`, as well as in the traits `InterpreterTypes` and `Host`, which contain all the methods needed to define the EVM instructions (stack and memory access, gas consumption, etc.).

Here is our functional specification of the ADD instruction in Rocq:

```coq
(
  Output.Success tt,
  (
  let gas := ILoop.(Loop.gas).(RefStub.projection) interpreter.(Interpreter.control) in
  match Impl_Gas.record_cost gas constants.VERYLOW with
  | None =>
    let control :=
    ILoop.(Loop.set_instruction_result)
      interpreter.(Interpreter.control)
      instruction_result.InstructionResult.OutOfGas in
    interpreter
    <| Interpreter.control := control |>
  | Some gas =>
    let control := ILoop.(Loop.gas).(RefStub.injection) interpreter.(Interpreter.control) gas in
    let stack := interpreter.(Interpreter.stack) in
    let (result, stack) := IStack.(Stack.popn_top) {| Integer.value := 1 |} stack in
    match result with
    | Some (arr, top) =>
    let '{| ArrayPair.x := x1 |} := arr.(array.value) in
    let x2 := top.(RefStub.projection) stack in
    let stack := top.(RefStub.injection) stack (Impl_Uint.wrapping_add x1 x2) in
    interpreter
      <| Interpreter.control := control |>
      <| Interpreter.stack := stack |>
    | None =>
    let control :=
      ILoop.(Loop.set_instruction_result)
      control
      instruction_result.InstructionResult.StackUnderflow in
    interpreter
      <| Interpreter.control := control |>
      <| Interpreter.stack := stack |>
    end
  end,
  (_host, tt)
  )
)
```

This is a bit longer! But if you look precisely at the code, it is actually doing what the original Rust code was doing once you unroll the macros. It explicitly handles the error cases of:

- A gas level being too low, with the error `instruction_result.InstructionResult.OutOfGas`.
- A stack underflow, with the error `instruction_result.InstructionResult.StackUnderflow`.

:::info Note

At the first line, with `Output.Success tt`, we are saying that the function is always successful, that is to say, without possible panics, and so for any possible input. This safety property in itself is very important, and sometimes enough to consider a software safe to deploy.

:::

## 🤔 Challenges

One challenge in this code is that there are a lot of parameters through the use of traits. For example, the type of the stack is abstract, and it can only be manipulated through methods of the corresponding trait. You can look at the list of traits provided to the implementations of the instructions in the file [revm_interpreter/interpreter_types.rs](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/revm/revm_interpreter/interpreter_types.rs).

Here is an example for the stack:

```rust
pub trait StackTrait {
    fn len(&self) -> usize;
    fn is_empty(&self) -> bool;
    fn push(&mut self, value: U256) -> bool;
    fn push_b256(&mut self, value: B256) -> bool;
    fn popn<const N: usize>(&mut self) -> Option<[U256; N]>;
    fn popn_top<const POPN: usize>(&mut self) -> Option<([U256; POPN], &mut U256)>;
    fn top(&mut self) -> Option<&mut U256>;
    fn pop(&mut self) -> Option<U256>;
    fn pop_address(&mut self) -> Option<Address>;
    fn exchange(&mut self, n: usize, m: usize) -> bool;
    fn dup(&mut self, n: usize) -> bool;
}
```

We specify the functions of interest for us in [revm_interpreter/simulate/interpreter_types.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/revm/revm_interpreter/simulate/interpreter_types.v) (the code is too long to copy here).

## 🤖 Technique

We first use our tool [coq-of-rust](https://github.com/formal-land/coq-of-rust), to translate the Rust code to Rocq. We then refine the translated code in two steps to obtain the functional specification:

1. Adding type and trait information. This information is lost in our translation as they are hard to map in a very general way to equivalent Rocq code, but we retrieve it mostly automatically with the `run_symbolic` tactic that we designed. Only the handling of trait instances is somewhat manual, and we are working on automating it more.
2. Showing that the translated code is equivalent to the functional specification, using the predicate:
    ```coq
    {{ expression 🌲 functional_specification }}
    ```

With this predicate, we symbolically execute the typed version of the translated code, using a typed stack, and show the code to be equal in the mathematical sense to the functional specification. This statement holds for any possible input, and so we have shown that the implementation is correct according to our specification. All the semantic rules associated with our Rust monad are in the files:

- [M.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/M.v) for the definition of the monad.
- [links/M.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/links/M.v) for the typing and trait instances rules.
- [simulate/M.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/simulate/M.v) for the memory allocation rules and equality with the functional specification.

## ✒️ Conclusion

This shows that we can fully specify complex Rust code, using many dependencies and language features. There are still steps that we are continuing to automate more, like the functional specification on function calls.

If you have complex Rust code that you need to certify as bug-free (smart contracts, zkVMs, etc.), please contact us as it is now possible to do so at a reasonable cost.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
