# Verification

We are currently working on the formal verification of the type checker of the Move bytecode. Here is a blog post explaining the verification of a specific sub-function: [🦀 Example of verification for the Move's checker of Sui](https://formal.land/blog/2024/11/14/sui-move-checker-abstract-stack).

We are focusing on the following property, that we verify for each kind of instruction of the Move bytecode:

> Starting from a `stack` of a type `stack_ty`, if the function `verify_instr` of the type-checker is successful, then the function `execute_instruction` of the interpreter is also successful, with a resulting stack of the type returned by the type-checker.

## Relevant files

We have put all of our work in the [CoqOfRust/move_sui](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/move_sui) folder, with the two following sub-folders that are of interest:

- [simulations](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/move_sui/simulations) This defines a Rocq version of the Rust code of the Move interpreter and type-checker.
- [proofs](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/move_sui/proofs) The gives the specifications and proofs we have made of the simulations.

The folder [translations](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/move_sui/translations) is generated and not used here, and the folder [links](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/move_sui/links).

With the Rocq file names with follow the names of the Rust files of the Move's implementation:

- The main function of the type-checker `verify_instr` is defined [simulations/move_bytecode_verifier/type_safety.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/simulations/move_bytecode_verifier/type_safety.v).
- The main function of the interpreter `execute_instruction` is defined in [simulations/move_vm_runtime/interpreter.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/simulations/move_vm_runtime/interpreter.v).
- The main verified statement about the type-checker is the lemma `progress` in [proofs/move_bytecode_verifier/type_safety.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/proofs/move_bytecode_verifier/type_safety.v). There is also the lemma `verify_instr_is_valid` in it to show that the output of the type-checker is well-shaped.
- In the file [proofs/move_abstract_stack/lib.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/proofs/move_abstract_stack/lib.v) we group the proofs about the abstract stack used in the type-checker to represent the stack of types in a compact manner.

## Verification of the abstract stack

A first thing we formally verified is the abstract stack:

- The Rust definition is in [move-abstract-stack/src/lib.rs](https://github.com/move-language/move-sui/blob/main/crates/move-abstract-stack/src/lib.rs).
- The Rocq simulations are in [simulations/move_abstract_stack/lib.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/simulations/move_abstract_stack/lib.v).
- The verifications are in [proofs/move_abstract_stack/lib.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/proofs/move_abstract_stack/lib.v).

In Rust, the abstract stack is defined as follows:

```rust
pub struct AbstractStack<T> {
    values: Vec<(u64, T)>,
    len: u64,
}
```

The field `len` must always be equal to the number of elements in the stack. To avoid repetitions, each element comes with a number `u64` indicating the number of times it is repeated.

For each of the stack operations, we check that:

- The `len` field is always correct.
- The stack behaves as if we were applying the normal stack operations push/pop on the stack of values when we repeat the same values multiple times.

As an example, here is the statement for `push_n` that adds `n` times the same value to the stack:

```coq
Lemma check_push_n {A : Set} `{Eq.Trait A} (item : A) (n : Z) (stack : AbstractStack.t A)
    (H_Eq : Eq.Valid.t (fun _ => True))
    (H_n : Integer.Valid.t IntegerKind.U64 n)
    (H_stack : AbstractStack.Valid.t stack) :
  match AbstractStack.push_n item n stack with
  | Panic.Value (Result.Ok tt, stack') =>
    AbstractStack.Valid.t stack' /\
    flatten stack' = List.repeat item (Z.to_nat n) ++ flatten stack
    | Panic.Value (Result.Err _, stack') =>
    stack' = stack
  | _ => True
  end.
```

For context, the type of the Rust code is:

```rust
pub fn push_n(&mut self, item: T, n: u64) -> Result<(), AbsStackError>
```

It says that:

- If the `AbstractStack.push_n` operation succeeds then:
  - The resulting `len` is accurate (`AbstractStack.Valid.t stack'`).
  - The resulting stack, once flattened to duplicate all the repeated elements, is the concatenation of the previous stack with `n` times the same value `item` added on top.
- If the operation fails, then the stack is unchanged.

## First formal statement for the type-checker

Here is our initial formal statement of the validity of the type-checker:

```coq
Lemma progress
    (* [...] The list of parameters and properties stating that they are correct *)
    (H_of_type : IsInterpreterContextOfType.t locals interpreter type_safety_checker)
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
  | Panic.Value (Result.Ok _, _), Panic.Panic _ => False
  | Panic.Value (Result.Ok _, _), Panic.Value (Result.Err error, _) =>
    let '{| PartialVMError.major_status := major_status |} := error in
    match major_status with
    | StatusCode.EXECUTION_STACK_OVERFLOW
    | StatusCode.ARITHMETIC_ERROR => True
    | _ => False
    end
  | Panic.Panic _, _ | Panic.Value (Result.Err _, _), _ => True
  end.
```

We compare the results of `verify_instr` and `execute_instruction`, which are the functions to type-check and execute an instruction, respectively. With the hypothesis `H_type`, we assume that we start with state (composed of a stack and local variables) of types given in `type_safety_checker`.

In case of success of both the type-checker and the interpreter, we get a new state and a new set of types that are matching.

If the type-checker fails, either with a panic or an explicit error, we consider that the interpreter can return any result.

If the type-checker returns a success and the interpreter fails, we state that it can only fail with an explicit error taken from a white list, and no panics.

## Updated formal statement

While doing the proof, we realized that there are many cases when the interpreter can possibly fail with an explicit error. For example, by calling twice `Bytecode::MoveLoc` on the same local variable. We decided to then only show that panics of the interpreter are not possible if the type-checker succeeds, and that the next state is well-typed in case of success.

Here is the new formal statement:

```coq
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
| Panic.Value (Result.Ok _, _), Panic.Panic _ => False
| Panic.Value (Result.Ok _, _), Panic.Value (Result.Err _, _)
| Panic.Value (Result.Err _, _), _
| Panic.Panic _, _ => True
end.
```

This is the same as before, but with a simpler model to handle the errors: we handle any execution errors except panics.

### Loc operations

For the instructions to manipulate the local variables (`CopyLoc`, `MoveLoc`, and `StLoc`):

- We axiomatized some of the operations as they are doing operations too low-level for our Rocq model, such as calling the Rust function `std::mem::replace`.
- We also axiomatized some of their properties by lack of time.

### Call operations

These are the two instructions `Call` and `CallGeneric`. They do not modify anything on the interpreter side and immediately return. However, on the type-checker side, they check the type of function parameters which are supposed to be on the top of the stack, and push the type of the results. We do not handle this kind of operation in our statement (final node in the control flow graph) and instead add them in a black-list of final operations which we do not cover.

### Pack/unpack operations

The `Pack` and `PackGeneric` instructions pop a list of fields from the stack and push the resulting structure. The `Unpack` and `UnpackGeneric` instructions do the opposite. We do not handle these operations yet in our proof.

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
