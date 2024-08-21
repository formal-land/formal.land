---
title: 🦀 Formal verification of the type checker of Sui – part 1
tags: [Sui, formal verification, Coq, Rust, Move, type checker]
authors: []
---

In this blog post, we present our project to formally verify the implementation of the type checker for smart contracts of the [💧&nbsp;Sui blockchain](https://sui.io/). The Sui blockchain uses the [Move](https://sui.io/move) language to express smart contracts. This language is implemented in [🦀&nbsp;Rust](https://www.rust-lang.org/) and compiles down to the Move bytecode that is loaded in memory when executing the smart contracts.

We will formally verify the part that checks that the bytecode is well-typed, so that when a smart contract is executed it cannot encounter critical errors. The [type checker itself](https://github.com/move-language/move-sui/blob/main/crates/move-bytecode-verifier/src/type_safety.rs) is also written in Rust, and we will verify it using the proof assistant [Coq&nbsp;🐓](https://coq.inria.fr/) and our tool [coq-of-rust](https://github.com/formal-land/coq-of-rust) that translates Rust programs to Coq.

<!-- truncate -->

:::success Get started

To formally verify your Rust code and ensure it contains no bugs or vulnerabilities, contact us at&nbsp;[&nbsp;📧&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land).

The cost is €10 per line of Rust code (excluding comments) and €20 per line for concurrent code.

:::

<figure>
  ![Sui in forest](2024-08-19/sui-in-forest.webp)
</figure>

## Plan

The plan for this project is as follows:

1. **Write simulations&nbsp;🧮** of the Rust code we want to verify in Coq, namely the [type checker](https://github.com/move-language/move-sui/blob/main/crates/move-bytecode-verifier/src/type_safety.rs) and the [interpreter of bytecode](https://github.com/move-language/move-sui/blob/main/crates/move-vm-runtime/src/interpreter.rs). The simulations are functions that are equivalent to the ones in the original Rust program, but written in a style that is more amenable to formal verification. The changes can be:
    - very simple, for example renaming variables to avoid name collisions in Coq,
    - more involved like solving the trait instances or replacing Rust references with purely functional code, or
    - specific to the project, like reversing the order of the bytecode's stack to simplify the proofs.
2. **Test these simulations&nbsp;🔍** to show they behave like the original Rust code on examples covering all the opcodes of the Move bytecode.
3. **Prove the equivalence&nbsp;🟰** between the Coq simulations and the Rust code as translated to Coq by `coq-of-rust`. This part will give more precise results than the tests, as it will cover all possible inputs and states of the program. The complexity of this part is to go through all the details that exist in the Rust code, like the use of references to manipulate the memory, the macros after expansion, and the parts of the Rust standard library that the code depends on.
4. **Prove that the type checker is correct&nbsp;🛡️** in Coq. The main properties we want to check are:
    - the interpreter preserves the well-typedness of the code as it steps through the opcodes,
    - when a program is accepted by the type checker, the interpreter will not fail at runtime with a type error.

## What is done

For now, we have written a simulation for the type checker in [CoqOfRust/move_sui/simulations/move_bytecode_verifier/type_safety.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/simulations/move_bytecode_verifier/type_safety.v). We are now:

- adding tests to compare this simulation with the original Rust code,
- writing the simulation for the interpreter of the Move bytecode.

In the following blog posts, we will describe how we structured the simulations and how we are testing or verifying them.

:::success Thanks

_This project is kindly founded by the [Sui Foundation](https://sui.io/about) which we thank for their trust and support._

:::
