# Verification

We are currently working on the formal verification of the type checker of the Move bytecode. Here is a blog post explaining the verification of a specific sub-function: [🦀 Example of verification for the Move's checker of Sui](https://formal.land/blog/2024/11/14/sui-move-checker-abstract-stack).

We are focusing on the following property, that we verify for each kind of instruction of the Move bytecode:

> Starting from a `stack` of a type `stack_ty`, if the function `verify_instr` of the type-checker is successful, then the function `execute_instruction` of the interpreter is also successful, with a resulting stack of the type returned by the type-checker.

## Issues in our translation

Here is the list of issues we found in our translation of the Move implementation to the Coq language. The code was correctly working in Rust. We found these issues despite the fact that we have a test suite for the type-checker, to compare the results of the Rust and Coq implementations.

### Typing of `Bytecode::CastU256`

We were returning the type `SignatureToken.U64` instead of `SignatureToken.U256`.

## To investigate more

### Deprecated opcodes

There is a list of deprecated opcodes:

- `MutBorrowGlobalDeprecated`
- `ImmBorrowGlobalDeprecated`
- `MutBorrowGlobalGenericDeprecated`
- `ImmBorrowGlobalGenericDeprecated`
- `ExistsDeprecated`
- `ExistsGenericDeprecated`
- `MoveFromDeprecated`
- `MoveFromGenericDeprecated`
- `MoveToDeprecated`
- `MoveToGenericDeprecated`

In the type-checker we check these instructions as if they were still valid. On the interpreter side, we have:

```rust
unreachable!("Global bytecodes deprecated")
```

which would make a panic at execution time in case it is possible to load this kind of bytecode.
