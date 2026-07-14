---
title: 🦀 Updating the Rocq specification of Revm to v102
tags: [Rust, EVM, rocq-of-rust, formal specification, Revm]
authors: [arooj_fatima]
---

We have updated our translation and functional specification of [Revm](https://github.com/bluealloy/revm), a Rust implementation of the Ethereum Virtual Machine (EVM), to [Revm v102](https://github.com/bluealloy/revm/tree/v102). We use our tool [rocq-of-rust](https://github.com/formal-land/rocq-of-rust) to translate the Rust code to the [Rocq](https://rocq-prover.org/) theorem prover, where we write purely functional specifications and prove them equivalent to the translated code.

This upgrade introduced a large change in the generated Rocq code and in the interfaces used by the EVM instructions. The first translation did not compile in Rocq. We repaired the link and simulation layers one instruction family at a time and updated the tests and continuous integration pipeline to the new Revm architecture.

<!-- truncate -->

:::info

This work was funded by a grant from the [Ethereum Foundation](https://ethereum.foundation/), to whom we are thankful, related to the [zkEVM Formal Verification Project](https://verified-zkevm.org/), to bring more security to the Ethereum ecosystem in general.

:::

## Context

In our [previous report](/blog/2026/02/23/revm-formal-specification-report), we described our formal specification of the core EVM instructions implemented by Revm. The verification proceeds in three main phases:

1. **Translation:** `rocq-of-rust` translates the Rust code into a deep embedding in Rocq.
2. **Link:** we connect the untyped values of the translation to typed Rocq models of the Rust types and traits.
3. **Simulation:** we define purely functional versions of the instructions and prove them equivalent to the translated Rust definitions.

Keeping this work useful requires following upstream Revm. An upgrade can change much more than the body of an instruction: functions can move to another crate, types can gain or lose fields, traits can change, and state updates can be represented differently. The generated translation records all these changes, but the hand-written link and simulation layers must then be updated accordingly.

## Moving to Revm v102

The initial update was introduced in [rocq-of-rust#828](https://github.com/formal-land/rocq-of-rust/pull/828). It moved the Revm source from our previous fork to the upstream v102 release and regenerated the corresponding Rust and Rocq files. This first step deliberately did not attempt to make the Rocq project compile.

The change affected 338 files, with around 335,000 inserted lines and 169,000 deleted lines. Part of this size comes from generated code, where a small Rust change can produce a much larger Rocq diff. The translation workflow also changed from six Revm crates to ten, adding translations for the context, database interface, handler, top-level Revm, and state crates while following the new upstream organization.

The resulting failures were not all of the same kind. Some links referred to functions that had moved or no longer existed. Other proofs expected old fields or old method signatures. In these cases, we followed the generated Rust definitions rather than adding compatibility definitions merely to make Rocq accept the old specifications.

## A new interface for instructions

One of the most visible changes is the interface of the EVM instructions. Previously, an instruction such as `ADD` received separate references to the interpreter and the host, and charged its fixed gas cost inside the instruction body:

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

In v102, the two references are grouped in an `InstructionContext`:

```rust
pub struct InstructionContext<'a, H: ?Sized, ITy: InterpreterTypes> {
    pub interpreter: &'a mut Interpreter<ITy>,
    pub host: &'a mut H,
}

pub fn add<WIRE: InterpreterTypes, H: ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_add(*op2);
}
```

The fixed gas cost is now stored next to the instruction function in the instruction table:

```rust
pub struct Instruction<W: InterpreterTypes, H: ?Sized> {
    fn_: fn(InstructionContext<'_, H, W>),
    static_gas: u64,
}

table[ADD as usize] = Instruction::new(arithmetic::add, 3);
```

This distinction matters for the specification. The purely functional simulation of `ADD` should describe the body of the function and must no longer charge the same fixed gas cost a second time. Dynamic costs, such as those of `EXP`, memory expansion, or host operations, remain in the instruction flow and are still represented in their simulations.

We applied this new structure across arithmetic, bitwise, memory, stack, block information, control, system, host, and contract instructions. For example, the gas and memory paths were updated in [#834](https://github.com/formal-land/rocq-of-rust/pull/834) and [#835](https://github.com/formal-land/rocq-of-rust/pull/835), while [#839](https://github.com/formal-land/rocq-of-rust/pull/839) updated control instructions and their return actions. The contract calls required further changes to their inputs and host interactions, starting with their common dependencies and continuing through `STATICCALL`, `DELEGATECALL`, `CALLCODE`, `CALL`, and `CREATE`.

Another important change concerns instruction failures and returns. Tests previously observed an instruction result through the interpreter control state. With v102, these results can be carried by a bytecode action containing an `InterpreterAction::Return`. The Rocq tests were updated to inspect this new representation rather than continuing to test the previous state layout.

## Making the maintained pipeline green

The upgrade was divided into small changes so that each instruction family and proof boundary could be reviewed separately.

The final integration work in [#932](https://github.com/formal-land/rocq-of-rust/pull/932) updated the Rocq model of the instruction table, adjusted executable tests to the new bytecode result representation, removed stale links left by the previous Revm organization, and made the maintained CI pipeline green.

There are still explicit limits to this result. The link file `revm/revm_interpreter/links/instructions.v` remains excluded from compilation because its links are not working yet. Some equivalence and helper lemmas also remain admitted. A green pipeline therefore means that the committed translations are reproducible and that the maintained Rocq targets compile; it does not mean that the entire Revm codebase is already verified without assumptions.

## Conclusion

Updating a formal specification requires more than regenerating code. The link models, functional simulations, equivalence proofs, and tests must continue to describe the new source accurately. For Revm v102, the main changes concerned the instruction context, gas accounting, interpreter actions, host interfaces, and journaled-state types.

By repairing these layers, we restored the maintained Rocq specification on the new Revm source and brought its translation, links, simulations, and tests back into alignment.

:::success Socials

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more!_

:::
