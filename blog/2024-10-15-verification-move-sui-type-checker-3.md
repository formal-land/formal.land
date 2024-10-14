---
title: 🦀 Formal verification of the type checker of Sui – part 3
tags: [monad, Rust, Sui]
authors: []
---

In the [previous blog post](/blog/2024/10/14/verification-move-sui-type-checker-2), we have seen how we represent side-effects from the Rust code of the [Sui](https://sui.io/)'s [Move](https://sui.io/move) type-checker of bytecode in Coq. This translation represents about 3,200 lines of Coq code excluding comments. We need to trust that this translation is faithful to the original Rust code, as we generate it by hand or with GitHub Copilot.

In this blog post, we present how we test this translation to ensure it is correct by running the type-checker on each opcode of the Move bytecode and comparing the results with the Rust code, testing the success and error cases.

<!-- truncate -->

:::success Get started

To ensure your code is secure today, contact us at&nbsp;[&nbsp;📧&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

Formal verification goes further than traditional audits to make 100% sure you cannot lose your funds. It can be integrated into your CI pipeline to make sure that every commit is correct without running a full audit again.

We make bugs such as the [DAO hack](https://www.gemini.com/fr-fr/cryptopedia/the-dao-hack-makerdao) ($60 million stolen) virtually impossible to happen again.

:::

<figure>
  ![Forge in forest](2024-10-15/rock-with-mirror.webp)
</figure>

## The type-checker

The type-checker of Move Sui is a large piece of Rust code with a core function&nbsp;`verify_instr` in [move-bytecode-verifier/src/type_safety.rs](https://github.com/formal-land/move-sui/blob/main/crates/move-bytecode-verifier/src/type_safety.rs) that type-checks each individual instruction in a Move bytecode. There are exactly&nbsp;`77` different opcodes. To give you an example, here is how it type-checks the opcode&nbsp;`Add`:

```rust
let operand1 = safe_unwrap_err!(verifier.stack.pop());
let operand2 = safe_unwrap_err!(verifier.stack.pop());
if operand1.is_integer() && operand1 == operand2 {
    verifier.push(meter, operand1)?;
} else {
    return Err(verifier.error(StatusCode::INTEGER_OP_TYPE_MISMATCH_ERROR, offset));
}
```

The Move virtual machine is stack-based. The type-checker maintains a stack of types, corresponding to the types of the values that should be on the stack at the current point of the execution. For the `Add` operation it pops the two last types on the types, checks that they are integers and equal, and pushes the result type on the stack. The result of an addition is of the same type as the operands. In case of an error, it returns the status code `INTEGER_OP_TYPE_MISMATCH_ERROR`.

We translate this code to Coq in the following way:

```coq
letS! operand1 :=
  liftS! TypeSafetyChecker.lens_self_stack AbstractStack.pop in
letS! operand1 := return!toS! $ safe_unwrap_err operand1 in
letS! operand2 :=
  liftS! TypeSafetyChecker.lens_self_stack AbstractStack.pop in
letS! operand2 := return!toS! $ safe_unwrap_err operand2 in
if andb
  (SignatureToken.is_integer operand1)
  (SignatureToken.t_beq operand1 operand2)
then
  TypeSafetyChecker.Impl_TypeSafetyChecker.push operand1
else
  returnS! $ Result.Err $ TypeSafetyChecker.Impl_TypeSafetyChecker.error
    verifier StatusCode.INTEGER_OP_TYPE_MISMATCH_ERROR offset
```

## Tests

The two code extracts above seem very similar, but how to make sure that they are indeed the same, and that we made no typos or misunderstanding in the 3,200 lines of translation?

To answer that question, we choose to write unit tests on the Rust side covering all the execution paths (success and error, all the opcodes) and to run the same tests on the Coq side after a manual/AI assisted translation of these tests. We will compare the results of the tests to ensure that the Coq code behaves exactly like the Rust code.

The tests on the Rust side are in the file [move-bytecode-verifier/src/type_safety_tests/mod.rs](https://github.com/formal-land/move-sui/blob/main/crates/move-bytecode-verifier/src/type_safety_tests/mod.rs), which is a 3,000-line file with&nbsp;176 tests. For example, for the addition we have:

```rust
#[test]
fn test_arithmetic_correct_types() {
    for instr in vec![
        Bytecode::Add,
        Bytecode::Sub,
        Bytecode::Mul,
        Bytecode::Mod,
        Bytecode::Div,
        Bytecode::BitOr,
        Bytecode::BitAnd,
        Bytecode::Xor,
    ] {
        for push_ty_instr in vec![
            Bytecode::LdU8(42),
            Bytecode::LdU16(257),
            Bytecode::LdU32(89),
            Bytecode::LdU64(94),
            Bytecode::LdU128(Box::new(9999)),
            Bytecode::LdU256(Box::new(U256::from(745_u32))),
        ] {
            let code = vec![push_ty_instr.clone(), push_ty_instr.clone(), instr.clone()];
            let module = make_module(code);
            let fun_context = get_fun_context(&module);
            let result = type_safety::verify(&module, &fun_context, &mut DummyMeter);
            assert!(result.is_ok());
        }
    }
}
```

There are four other tests covering the error cases (missing arguments, wrong types, ...).

One of the difficulties in these tests, apart from their size, is that we need to initialize the&nbsp;`module` variable with the proper content to be able to type-check some of the instructions. We defined some helpers for that, such as:

```rust
fn add_simple_struct_with_abilities(module: &mut CompiledModule, abilities: AbilitySet) {
    let struct_def = StructDefinition {
        struct_handle: StructHandleIndex(0),
        field_information: StructFieldInformation::Declared(vec![FieldDefinition {
            name: IdentifierIndex(5),
            signature: TypeSignature(SignatureToken::U32),
        }]),
    };

    let struct_handle = StructHandle {
        module: ModuleHandleIndex(0),
        name: IdentifierIndex(0),
        abilities: abilities,
        type_parameters: vec![],
    };

    module.struct_defs.push(struct_def);
    module.struct_handles.push(struct_handle);
}
```

that is used in&nbsp;`26` tests involving struct data structures.

## Translation of the tests

We translated the tests using the same approach as for the type-checker, with the same monadic representation of effects. For example, we represent in Coq the arithmetic test above as:

```coq
Definition test_arithmetic_correct_types
    (instr push_ty_instr : Bytecode.t) :
    M!? PartialVMError.t unit :=
  let code := [push_ty_instr; push_ty_instr; instr] in
  let module := make_module code in
  let! fun_context := get_fun_context module in
  verify module fun_context.

Goal List.Forall
  (fun instr =>
    List.Forall
      (fun push_ty_instr =>
        test_arithmetic_correct_types instr push_ty_instr = return!? tt
      )
      [
        Bytecode.LdU8 42;
        Bytecode.LdU16 257;
        Bytecode.LdU32 89;
        Bytecode.LdU64 94;
        Bytecode.LdU128 9999;
        Bytecode.LdU256 745
      ]
  )
  [
    Bytecode.Add;
    Bytecode.Sub;
    Bytecode.Mul;
    Bytecode.Mod;
    Bytecode.Div;
    Bytecode.BitOr;
    Bytecode.BitAnd;
    Bytecode.Xor
  ].
Proof.
  repeat constructor.
Qed.
```

We convert the test that iterates assertions to an anonymous proof goal that uses the `List.Forall` predicate to verify a series of equalities. The `List.Forall` predicate is defined as "the following property is valid for all elements of the list".

Fortunately for us, GitHub Copilot was extremely efficient in the translation of these tests with a success rate of about&nbsp;%95 (we did not make a precise measurement). These end result is in [move_sui/simulations/move_bytecode_verifier/type_safety_tests/mod.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/move_sui/simulations/move_bytecode_verifier/type_safety_tests/mod.v) that contains more than 6,000 lines of Coq code excluding comments.

## Detected issues

About&nbsp;%20 of our translated Coq tests failed&nbsp;💥, which we actually consider a very good success&nbsp;💪 as the translated Coq code of the type-checker was not run before. Apart from one misunderstanding of the Rust code, all the issues were due to typos in the translation. We had about a dozen of them, such as a missing negation in a condition, some of them generating multiple test failures. It took about one day to fix all of them by changing our Coq translation of the type-checker accordingly. Now all the tests work&nbsp;🎉!

A few errors where also due to incorrectly translated tests, typically with a missing line. We did a manual review, but we do not know for sure if there are tests with a mistake that by chance fix an error in the translation of the type-checker. We have not seen any such case yet.

## Conclusion

We now have an idiomatic 🐓&nbsp;Coq translation of the type-checker of the Move bytecode in Rust. In addition, we test the result of this translation for every opcode and error case.

Now that we are confident enough in the translation, we can start the specification and formal verification of the type-checker. This will involve reasoning on both the type-checker and the bytecode interpreter, showing that:

- ✅ The interpreter preserves the well-typedness of the code as it steps through the opcodes.
- ✅ When a program is accepted by the type checker, the interpreter will not fail at runtime with a type error.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land), or comment on this post below! Feel free to DM us for any services you need._

:::
