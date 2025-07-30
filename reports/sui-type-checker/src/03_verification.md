# Verification

We have worked on the formal verification of the type checker of the Move bytecode. Here two associated blog posts on the matter:

- [🦀 Example of verification for the Move's checker of Sui](https://formal.land/blog/2024/11/14/sui-move-checker-abstract-stack) for the verification of primitives handling the stack of types;
- [🦀 Verification of one instruction of the Move's type-checker](https://formal.land/blog/2025/01/13/verification-one-instruction-sui) for the verification of a part of the type-checker itself.

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

The abstract stack is used to efficiently represent a type for the stack in the type-checker. Here are the relevant files for the formal verification of the abstract stack:

- The Rust definition is in [move-abstract-stack/src/lib.rs](https://github.com/move-language/move-sui/blob/main/crates/move-abstract-stack/src/lib.rs).
- The Rocq simulations are in [simulations/move_abstract_stack/lib.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/simulations/move_abstract_stack/lib.v).
- The Rocq verifications are in [proofs/move_abstract_stack/lib.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/proofs/move_abstract_stack/lib.v).

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

We have not found bugs in this part. This only thing that we assumed is that there cannot be integer overflows for the number of duplicates for an element in the stack, or for the length of the stack. This seems unlikely to happen in practice as the maximum number of elements `2^64` is very large.

## Verification of the type-checker

For the type-checker itself, we have formally verified 43 over 67 non-deprecated bytecode instructions:

- ✅ `Pop`
- 🚨 `Ret`
- ✅ `BrTrue`
- ✅ `BrFalse`
- ✅ `Branch`
- ✅ `LdU8`
- ✅ `LdU16`
- ✅ `LdU32`
- ✅ `LdU64`
- ✅ `LdU128`
- ✅ `LdU256`
- ✅ `CastU8`
- ✅ `CastU16`
- ✅ `CastU32`
- ✅ `CastU64`
- ✅ `CastU128`
- ✅ `CastU256`
- ✅ `LdConst`
- ✅ `LdTrue`
- ✅ `LdFalse`
- ✅ `CopyLoc`
- ✅ `MoveLoc`
- ✅ `StLoc`
- 🚨 `Call`
- 🚨 `CallGeneric`
- ❌ `Pack`
- ❌ `PackGeneric`
- ❌ `Unpack`
- ❌ `UnpackGeneric`
- ❌ `ReadRef`
- ❌ `WriteRef`
- ❌ `FreezeRef`
- ❌ `MutBorrowLoc`
- ❌ `ImmBorrowLoc`
- ❌ `MutBorrowField`
- ❌ `MutBorrowFieldGeneric`
- ❌ `ImmBorrowField`
- ❌ `ImmBorrowFieldGeneric`
- ✅ `Add`
- ✅ `Sub`
- ✅ `Mul`
- ✅ `Mod`
- ✅ `Div`
- ✅ `BitOr`
- ✅ `BitAnd`
- ✅ `Xor`
- ✅ `Or`
- ✅ `And`
- ✅ `Not`
- ✅ `Eq`
- ✅ `Neq`
- ✅ `Lt`
- ✅ `Gt`
- ✅ `Le`
- ✅ `Ge`
- ✅ `Abort`
- ✅ `Nop`
- ✅ `Shl`
- ✅ `Shr`
- ❌ `VecPack`
- ❌ `VecLen`
- ❌ `VecImmBorrow`
- ❌ `VecMutBorrow`
- ❌ `VecPushBack`
- ❌ `VecPopBack`
- ❌ `VecUnpack`
- ❌ `VecSwap`

> Legend: ✅ verified, ❌ not verified, 🚨 not verified as function instruction.

Note that we have made our verification statement for a single step of the type-checker, excluding function instructions. We would also need to verify that the type-checker is correct for a sequence of instructions.

### First formal statement

Here is our initial formal statement of the validity of the type-checker, with the lemma `progress` in the file [proofs/move_bytecode_verifier/type_safety.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/proofs/move_bytecode_verifier/type_safety.v). We name this lemma like this as it shows that when the code is well typed, the interpreter can make one more execution step returning a well-typed state.

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

### Updated formal statement

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

## Operations

Here we detail how the verification went for each kinds of operation.

### Atomic type operations

We verified all the "atomic operations". These are operations on atomic types such as booleans or integers were the simplest to verify. Most of the time it consisted in popping a few types/values on the side of the type-checker/interpreter, making a few operations, and pushing the resulting type/value back on the stack. Here is as an example for the `Add` instruction:

```rust
// Rust type-checker
Bytecode::Add => {
    let operand1 = safe_unwrap_err!(verifier.stack.pop());
    let operand2 = safe_unwrap_err!(verifier.stack.pop());
    if operand1.is_integer() && operand1 == operand2 {
        verifier.push(meter, operand1)?;
    } else {
        return Err(verifier.error(
            StatusCode::INTEGER_OP_TYPE_MISMATCH_ERROR,
            offset,
        ));
    }
}
```

```rust
// Rust interpreter
Bytecode::Add => {
    gas_meter.charge_simple_instr(S::Add)?;
    interpreter.binop_int(IntegerValue::add_checked)?
}

// Auxiliary functions
fn binop_int<F>(&mut self, f: F) -> PartialVMResult<()>
where
    F: FnOnce(IntegerValue, IntegerValue) -> PartialVMResult<IntegerValue>,
{
    self.binop(|lhs, rhs| {
        Ok(match f(lhs, rhs)? {
            IntegerValue::U8(x) => Value::u8(x),
            IntegerValue::U16(x) => Value::u16(x),
            IntegerValue::U32(x) => Value::u32(x),
            IntegerValue::U64(x) => Value::u64(x),
            IntegerValue::U128(x) => Value::u128(x),
            IntegerValue::U256(x) => Value::u256(x),
        })
    })
}

fn binop<F, T>(&mut self, f: F) -> PartialVMResult<()>
where
    Value: VMValueCast<T>,
    F: FnOnce(T, T) -> PartialVMResult<Value>,
{
    let rhs = self.operand_stack.pop_as::<T>()?;
    let lhs = self.operand_stack.pop_as::<T>()?;
    let result = f(lhs, rhs)?;
    self.operand_stack.push(result)
}
```

We can see that both implementations follow the same structure and control-flow, failing when the two parameters are not of the same integer type. Here is our Rocq proof of validity:

```coq
{ guard_instruction Bytecode.Add.
  destruct_abstract_pop.
  destruct_abstract_pop.
  destruct_initial_if.
  destruct_abstract_push.
  destruct_all IntegerValue.t; cbn in *; try easy; (
    unfold IntegerValue.add_checked; cbn;
    repeat (step; cbn; try easy);
    constructor; cbn;
    try assumption;
    sauto lq: on
  ).
}
```

At the beginning of the `Add` case here is the proof state:

```
(* Hypothesis from the statement of the lemma *)
----------------------------------------
1/1
match
  (letS! operand1 := liftS! TypeSafetyChecker.lens_self_stack AbstractStack.pop
   in letS! operand0 := return!toS! (safe_unwrap_err operand1)
      in letS! operand2 := liftS! TypeSafetyChecker.lens_self_stack AbstractStack.pop
         in letS! operand3 := return!toS! (safe_unwrap_err operand2)
            in if SignatureToken.is_integer operand0 && SignatureToken.t_beq operand0 operand3
               then TypeSafetyChecker.Impl_TypeSafetyChecker.push operand0
               else
                returnS!
                  (Result.Err (* ... *)))
    {|
      TypeSafetyChecker.module := module;
      TypeSafetyChecker.function_context := function_context;
      TypeSafetyChecker.locals := locals_ty;
      TypeSafetyChecker.stack := stack_ty
    |}
with
(* ... code containing the interpreter ... *)
end
```

It starts by the code of the type-checker that we can recognize, followed by a `match` on its result, then the interpreter code in case of success, and finally a statement to say that the final state (mainly composed of a stack) is of the computed type.

Let us decompose the proof steps:

- We check that we are indeed in the case of the `Add` instruction, to help for proof debugging.
- We follow two pop instructions from type-checker. In the case of success, they ensure that the stack has at least one element so that the pop instruction from the interpreter is automatically evaluated.
- The `destruct_initial_if` tactic is a helper to automatically get the information from the `if` instruction at the beginning of the type-checker. This instructions ensures that the two popped values have the same type and are both integers.
- Then we say with the `destruct_abstract_push` tactic that the type-checker pushes the popped integer type back on the stack.

At the end we conclude with a series of tactics to handle all the different integer kinds (fom `U8` to `U256`) which behave in the same way. Here is the proof state just before the end, with the same kind of proof state from `U8` to `U256`:

```
List.Forall2 IsValueImplOfType.t
  (ValueImpl.U8 (z0 + z) :: x2)
  (operand_ty :: AbstractStack.flatten stack_ty1)
```

This means that we need to check that for each value in the list on the left, we are of the type in the list on the right:

- For `x2` (the tail of the stack) we get that it is well-typed from our hypothesis. This is the part of the stack that was not modified by the `Add` instruction.
- For `ValueImpl.U8 (z0 + z)` (the head of the stack) we need to check that it is of the type `operand_ty`. This is the result of the `add` instruction. We have one of our hypothesis:
  ```coq
  match operand_ty with
  | SignatureToken.U8 => True
  | _ => False
  end
  ```
  By case analysis we conclude that `operand_ty` is equals to `SignatureToken.U8`, so that the head of the stack is well-typed.

### Loc operations

We verified the "loc" operations that manipulate the local variables (`CopyLoc`, `MoveLoc`, and `StLoc`):

- We axiomatized some of the operations as they are doing operations too low-level for our Rocq model, such as calling the Rust function `std::mem::replace`.
- We also axiomatized some of their properties by lack of time.

### Call operations

These are the two instructions `Call` and `CallGeneric`. They do not modify anything on the interpreter side and immediately return. However, on the type-checker side, they check the type of function parameters which are supposed to be on the top of the stack, and push the type of the results. We do not handle this kind of operation in our statement (final node in the control flow graph) and instead add them in a black-list of final operations which we do not cover.

### Structures, references, and vectors

We did not handle, for a lack of time, the operations about structures, references, and vectors. These are the most involved operations. They generally contain a loop to iterate for example over the fields of a structure, which is generally harder to verify as it requires reasoning by induction. These instructions also typically reference the environment in addition of the stack, for example to get the fields of a structure ID.

## Definition of values

We follow the definition of values from the Rust type in [move-vm-types/src/values/values_impl.rs](https://github.com/move-language/move-sui/blob/main/crates/move-vm-types/src/values/values_impl.rs):

```rust
enum ValueImpl {
    Invalid,

    U8(u8),
    U16(u16),
    U32(u32),
    U64(u64),
    U128(u128),
    U256(u256::U256),
    Bool(bool),
    Address(AccountAddress),

    Container(Container),

    ContainerRef(ContainerRef),
    IndexedRef(IndexedRef),
}
```

This type is mutually recursive with the `Container` type:

```rust
enum Container {
    Locals(Rc<RefCell<Vec<ValueImpl>>>),
    Vec(Rc<RefCell<Vec<ValueImpl>>>),
    Struct(Rc<RefCell<Vec<ValueImpl>>>),
    VecU8(Rc<RefCell<Vec<u8>>>),
    VecU64(Rc<RefCell<Vec<u64>>>),
    VecU128(Rc<RefCell<Vec<u128>>>),
    VecBool(Rc<RefCell<Vec<bool>>>),
    VecAddress(Rc<RefCell<Vec<AccountAddress>>>),
    VecU16(Rc<RefCell<Vec<u16>>>),
    VecU32(Rc<RefCell<Vec<u32>>>),
    VecU256(Rc<RefCell<Vec<u256::U256>>>),
}
```

We made a similar, mutually recursive definition in Rocq in [simulations/move_vm_types/values/values_impl.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/simulations/move_vm_types/values/values_impl.v).

## Well-typed relation

We define the "is well-typed" relation in [CoqOfRust/move_sui/proofs/move_vm_types/values/values_impl.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/proofs/move_vm_types/values/values_impl.v) with:

```coq
Module IsValueImplOfType.
  Definition t (value : ValueImpl.t) (typ : SignatureToken.t) : Prop :=
    match value, typ with
    | ValueImpl.Invalid, _ => False
    | ValueImpl.U8 z, SignatureToken.U8 => True
    | ValueImpl.U16 z, SignatureToken.U16 => True
    | ValueImpl.U32 z, SignatureToken.U32 => True
    | ValueImpl.U64 z, SignatureToken.U64 => True
    | ValueImpl.U128 z, SignatureToken.U128 => True
    | ValueImpl.U256 z, SignatureToken.U256 => True
    | ValueImpl.Bool _, SignatureToken.Bool => True
    | ValueImpl.Address _, SignatureToken.Address => True
    (* TODO: other cases *)
    | _, _ => False
    end.
```

We do not handle the container types but only atomic ones (integers, booleans, addresses). This relation defines when a value is of a given type. We extend it naturally to lists of values, to express that a stack or a set of local variables is well-typed.

## Preservation of invariants

The main invariant we verify is that the abstract stack for the type-checker is always well-formed, meaning that its pre-computed length `len` is always the actual number of elements in the abstract stack. We show this property in the lemma `verify_instr_is_valid` in the file [proofs/move_bytecode_verifier/type_safety.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/proofs/move_bytecode_verifier/type_safety.v).

The proof is done by reasoning by cases over all the instructions, unfolding all the definitions and applying the invariant lemmas for the stack operations.

## Found issues

We have not found any issues in the type-checker. However, our verification work is not complete as we essentially only verified the atomic instructions which are the simplest ones.

We found one typo error in our Rocq representation of the type-checker. We were returning the type `SignatureToken.U64` instead of `SignatureToken.U256` for the instruction `Bytecode::CastU256`.

### Deprecated opcodes

Here are the deprecated instuctions:

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

which would make a panic at execution time in case it is still possible to load this kind of bytecode. Maybe this code could instead return an error with `Result::Err` to be more explicit.
