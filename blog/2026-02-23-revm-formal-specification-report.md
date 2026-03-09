---
title: 🦀 Report on the formal specification of Revm
tags: [Rust, EVM, rocq-of-rust, formal specification, Revm]
authors: []
---

We have completed a formal specification of [Revm](https://github.com/bluealloy/revm), the main Rust implementation of the Ethereum Virtual Machine (EVM), covering 94% of the EVM instructions, considering the function of their definitions. Using our tool [rocq-of-rust](https://github.com/formal-land/rocq-of-rust), we translated the Rust code into the [Rocq](https://rocq-prover.org/) theorem prover and wrote purely functional specifications proven equivalent to the original code. In total, we produced about 50,000 lines of Rocq, and also proved the absence of panics for all covered instructions. We publish our full report: [Formal Specification of Revm](/reports/2026-02-15_revm-formal-specification.pdf).

<!-- truncate -->

The important part of the verification is at [RocqOfRust/revm/revm_interpreter/instructions/simulate](https://github.com/formal-land/rocq-of-rust/tree/main/RocqOfRust/revm/revm_interpreter/instructions/simulate).

A strength of our approach is that we do not need to modify the Rust code we verify. This means that:

- We can keep all the optimizations, so that there is no downside to the verification.
- We can, given enough time, verify the entire codebase of Revm including all the dependencies, so that we do not miss bugs outside of the scope.

:::info

This work was funded by a grant from the [Ethereum Foundation](https://ethereum.foundation/), to whom we are thankful, related to the [zkEVM Formal Verification Project](https://verified-zkevm.org/), to bring more security to the Ethereum ecosystem in general.

:::

:::note

We assume correct our translation tool `rocq-of-rust` from the Rust syntax tree to Rocq, our semantics, and our axiomatization of some of the dependencies of the code. Making a full verified formal specification would require extending this verification to all the dependencies and continuing the equivalence proof down to the assembly level. This is a significant effort, but it is doable.

:::

<figure>
  ![White forest](2026-02-23/white-forest.png)
</figure>

## Context

Revm is a widely used Rust implementation of the EVM, the execution engine of Ethereum. Ensuring its correctness is essential: bugs in an EVM implementation can lead to consensus failures, network splits, or exploitable vulnerabilities in smart contracts.

Our approach is to formally verify the Revm code by translating it to the Rocq theorem prover and writing purely functional specifications that are proven equivalent to the original Rust code. This gives a high level of assurance, as the proofs are mechanically checked and cover all possible inputs.

## What we get from it

Having a verified functional specification for the Rust code of Revm is important to:

- **Build a formally verified RISC-V bytecode** to run Revm on top of a RISC-V zkVM.
- **Show the absence of runtime errors** in the Revm implementation.
- **Show the equivalence of Revm with other EVM implementations**, such as Geth or the Python Specs.
- **Get a precise semantics of the EVM** in a formal language, and verify further the Rocq and Lean EVM specifications.

## Methodology

At a high level, we formally verify a translation from the imperative Rust implementation of Revm to an idiomatic and purely functional representation in Rocq. We use `rocq-of-rust` proceeding in the following steps:

1. **From Rust to a deep-embedding in Rocq**, running `rocq-of-rust`. (fully automated and trusted)
2. **Adding back the type information and resolving traits**, what we name the "link" phase. (semi-automated and greatly helped by AI for the manual part)
3. **Defining an idiomatic and purely functional version** of the Rust code (manual and partially helped by AI)
4. **Proving the equivalence** of the two versions (semi-automated and partially helped by AI)

## Coverage

The codebase of Revm contains one function per instruction. We specify and verify the instructions grouped by category. Here is the status (`✓` = fully proven with `Qed`, `✗` = admitted):

| Category | Instructions | Status |
|---|---|---|
| **arithmetic/** | `add`, `addmod`, `div`, `exp`, `mul`, `mulmod`, `rem`, `sdiv`, `signextend`, `smod`, `sub` | all ✓ |
| **bitwise/** | `bitand`, `bitor`, `bitxor`, `byte`, `eq`, `gt`, `iszero`, `lt`, `not`, `sar`, `sgt`, `shl`, `shr`, `slt` | all ✓ |
| **block_info/** | `basefee`, `blob_basefee`, `block_number`, `chainid`, `coinbase`, `difficulty`, `gaslimit`, `timestamp` | all ✓ |
| **contract/** | `call`, `call_code`, `delegate_call`, `extcall_input`, `static_call` | all ✓ |
| **control/** | `invalid`, `jump`, `jump_inner`, `jumpdest_or_nop`, `jumpi`, `pc`, `ret`, `return_inner`, `revert`, `stop`, `unknown` | all ✓ |
| **host/** | `balance`, `blockhash`, `extcodecopy`, `extcodehash`, `extcodesize`, `selfbalance`, `sload`, `sstore`, `tload`, `tstore` | all ✓ |
| **host/** | `log`, `selfdestruct` | ✗ |
| **memory/** | `mcopy`, `mload`, `msize`, `mstore`, `mstore8` | all ✓ |
| **stack/** | `dup`, `pop`, `push`, `push0`, `swap` | all ✓ |
| **system/** | `address`, `calldatacopy`, `calldatasize`, `caller`, `callvalue`, `codecopy`, `codesize`, `gas`, `keccak256`, `memory_resize`, `returndatacopy`, `returndatasize` | all ✓ |
| **system/** | `calldataload` | ✗ |
| **tx_info/** | `gasprice` | all ✓ |
| **tx_info/** | `origin`, `block_hash` | ✗ |

We do not look at the EOF opcodes, as they are not part of the current EVM specification.

## Walkthrough: the CALLDATASIZE instruction

To illustrate our approach, consider the `CALLDATASIZE` opcode. Its Rust implementation is:

```rust
pub fn calldatasize<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    _host: &mut H,
) {
    gas!(interpreter, gas::BASE);
    push!(interpreter, U256::from(interpreter.input.input().len()));
}
```

It takes as parameters two trait implementations for `InterpreterTypes` and `Host` with their corresponding state values `interpreter` and `_host`. It runs the two macros `gas!` and `push!` to update the interpreter state with the expected values.

When translating this code to Rocq through `rocq-of-rust` we obtain a code of 300 lines, which is much longer because we unfold the macros, add type annotations from the Rust compiler, and make explicit all the conversions and reference manipulations done by the Rust compiler.

We then define the specification in idiomatic Rocq code:

```coq
Definition calldatasize
    {WIRE : Set} `{Link WIRE}
    {WIRE_types : InterpreterTypes.Types.t}
    `{InterpreterTypes.Types.AreLinks WIRE_types}
    {IInterpreterTypes :
      InterpreterTypes.C WIRE_types}
    (interpreter :
      Interpreter.t WIRE WIRE_types) :
    Interpreter.t WIRE WIRE_types :=
  gas_macro interpreter constants.BASE id
    (fun interpreter =>
  let input :=
    IInterpreterTypes
      .(InterpreterTypes.InputsTrait_for_Input)
      .(InputTraits.input)
      .(RefStub.projection)
        interpreter.(Interpreter.input) in
  let length : usize :=
    Impl_Slice.len input in
  push_macro interpreter
    (Impl_Uint.from length)
    id id
  ).
```

Finally, the statement of equivalence between the functional specification and the Rust code is:

```coq
Lemma calldatasize_eq ... :
  let ref_interpreter := make_ref 0 in
  let ref_host := make_ref (A := H) 1 in
  {{
    SimulateM.eval_f
      (run_calldatasize
        run_InterpreterTypes_for_WIRE
        ref_interpreter ref_host)
      [interpreter; host]%stack
    ≃
    (
      Output.Success tt,
      [calldatasize interpreter; host]%stack
    )
  }}.
```

Note that for short instructions like this one, all the verification steps can be written by AI, once enough other instructions are verified as examples.

## Handling Rust traits

Traits are an important feature of Rust and are extensively used in Revm. For example, the `InterpreterTypes` trait:

```rust
pub trait InterpreterTypes {
    type Stack: StackTrait;
    type Memory: MemoryTrait;
    type Bytecode: Jumps + Immediates
        + LegacyBytecode + EofData
        + EofContainer + EofCodeInfo;
    type ReturnData: ReturnData;
    type Input: InputsTrait;
    type SubRoutineStack: SubRoutineStack;
    type Control: LoopControl;
    type RuntimeFlag: RuntimeFlag;
    type Extend;
}
```

We type these in Rocq using records and typeclasses in the "link" phase. This code is quite verbose but mostly generated by AI and verified as being correct later in the proofs. We also give a functional specification for these traits. This is one of the main areas where we think we can make more automation in the future.

## Future directions

There are several directions that we think we can work on in the future, with the aim to bring more security to the (zk)EVM platforms:

1. **Extending the scope** of this verification work to recursively cover more of the Rust dependencies, and hence reduce the trusted codebase.
2. **Maintaining this specification** so that it is up-to-date with the latest commit of the Revm repository.
3. **Proving the equivalence with other EVM implementations**, such as Geth or the Python Specs, following the same approach as we have done with the Rust language.
4. **Proving the equivalence with the Rocq and Lean EVM specifications** that exist. This can be followed by a formally verified compilation of these implementations through projects like [Peregrine](https://peregrine-project.github.io/). Combining both, this offers a way to compile Revm down to RISC-V in a formally verified way.
5. **Improving the `rocq-of-rust` tool** so that other projects can use it more easily, maybe even without our help.
6. **Pushing the equivalence proofs through the Rust compiler**, down to the assembly language. The general goal is to compile Revm or other Rust projects in a verified way, with the same or similar speed as with the Rust compiler. Using [CompCert](https://compcert.org/) as a Rust backend is probably a good way to go.

## Conclusion

We have produced a formal specification of 94% of the EVM instructions as implemented in Revm, totaling about 50,000 lines of Rocq. This work demonstrates that our methodology, based on the `rocq-of-rust` tool, is applicable to a wide variety of *safe* Rust code. Our tool is one of the few, if not the only, tools capable of handling such general translations. We do not rely on the borrow checker, so the techniques in use could also be applied to other languages such as Go or C.

You can read the full report here: [Formal Specification of Revm - Report](/reports/2026-02-15_revm-formal-specification.pdf).

> Want to secure critical applications? Discuss with us to know what is possible at [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land).

:::success Socials

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more!_

:::
