# Verification

We are currently working on the formal verification of the type checker of the Move bytecode. Here is a blog post explaining the verification of a specific sub-function: [🦀 Example of verification for the Move's checker of Sui](https://formal.land/blog/2024/11/14/sui-move-checker-abstract-stack).

We are focusing on the following property, that we verify for each kind of instruction of the Move bytecode:

> Starting from a `stack` of a type `stack_ty`, if the function `verify_instr` of the type-checker is successful, then the function `execute_instruction` of the interpreter is also successful, with a resulting stack of the type returned by the type-checker.
