# Introduction

In this document, we explain our work to formally verify the correctness of the [🦀&nbsp;Rust implementation](https://github.com/move-language/move-sui) of the [Move language](https://sui.io/move) for the [💧&nbsp;Sui blockchain](https://sui.io/).

For now, we concentrate on the _type-checker_ of the Move bytecode. Smart contracts are stored as Move bytecode on the blockchain, and several sanity checks are performed on the bytecode before it is executed. The type-checker is one of these checks, and the one that is the most involved.

Here are some reference files:

- The type-checker [move-bytecode-verifier/src/type_safety.rs](https://github.com/move-language/move-sui/blob/main/crates/move-bytecode-verifier/src/type_safety.rs)
- The interpreter of the Move bytecode [move-vm-runtime/src/interpreter.rs](https://github.com/move-language/move-sui/blob/main/crates/move-vm-runtime/src/interpreter.rs)
- A README about the list of checks performed on the bytecode [crates/move-bytecode-verifier/README.md](https://github.com/move-language/move-sui/tree/main/crates/move-bytecode-verifier)

## General strategy

We use the [🐓&nbsp;Coq](https://coq.inria.fr/) proof assistant for our formal verification effort.

With have the tool [coq-of-rust](https://github.com/formal-land/coq-of-rust) which automatically translates Rust programs to Coq, but we are not using it for this project as the generated translation is too verbose. Typically, handling the details of the memory handling, interactions with the standard library, or the traits hierarchy represents too much work.

Instead we write a Coq translation by hand of the Rust code of:

- the type-checker and
- the interpreter

which we test as being equivalent to the Rust code on a set of test cases.

Then we verify the following property on the type-checker:

> Starting from a `stack` of a type `stack_ty`, if the function `verify_instr` of the type-checker is successful, then the function `execute_instruction` of the interpreter is also successful, with a resulting stack of the type returned by the type-checker.

This is not everything we could check but it is a start. Ultimately, we will verify that:

> If the type-checker is successful, then the interpreter does not run with a critical error.

To ensure this property, other checks such as the "stack safety" (analysis of the stack height) will be necessary.
