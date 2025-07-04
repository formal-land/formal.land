---
title: 🦀 Beginning of translation of OpenVM to Rocq
tags: [Rust, OpenVM, coq-of-rust]
authors: [guillaume_claret]
---

Here, we present our beginning work of translating part of the [OpenVM](https://openvm.dev/) code to the proof assistant [<img src="https://raw.githubusercontent.com/coq/rocq-prover.org/refs/heads/main/rocq-id/logos/SVG/icon-rocq-orange.svg" height="18px" />&nbsp;Rocq](https://rocq-prover.org/). The aim is to experiment around the formal verification of the zero-knowledge circuits of this zkVM based on the [Plonky3](https://github.com/Plonky3/Plonky3) library. One of the aims of the zkVMs is to increase the scalability of the blockchains by packing many transactions in a single zk proof.

<!-- truncate -->

:::success Work with us!

With **formal verification** you can **guarantee** that your code is safe, given the specifications.

**Contact us** at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to discuss how to apply formal verification to your code!&nbsp;🛡️

We cover **Rust**, **Solidity**, and **ZK systems**.

:::

## 🎯 Target

Our goal is to formally verify that the circuit of the component [BranchEq](https://github.com/openvm-org/openvm/blob/main/extensions/rv32im/circuit/src/branch_eq/core.rs) of OpenVM is not underconstrained. This is one of the main security properties to look for in a circuit. This means that it is not possible to provide a proof of execution with a behavior different from what is expected.

A circuit is a set of equality assertions between values in a prime field using only addition or multiplication. Said otherwise, they are a set of equations on polynomials. The OpenVM project uses the Plonky3 library to define these. It adds a wrapper on top of Plonky3 with APIs to define custom instructions. An implementation for the RISC-V instruction set is provided but it could be anything, and it is easily extensible. This is convenient for example to provide optimized circuits for hashing primitives.

We will attempt to directly translate the Rust code describing the circuit to Rocq. There are a lot of challenge in this translation, as the Rust language contains a lot of hidden complexities, but it has the promise to be easy to maintain as we get a circuit description that closely matches its implementation.

The source links are:

- [github.com/openvm-org/openvm/blob/main/extensions/rv32im/circuit/src/branch_eq/core.rs](https://github.com/openvm-org/openvm/blob/main/extensions/rv32im/circuit/src/branch_eq/core.rs)
- [github.com/openvm-org/openvm/blob/main/extensions/rv32im/circuit/src/README.md](https://github.com/openvm-org/openvm/blob/main/extensions/rv32im/circuit/src/README.md)

The main datatype on which the circuit computes is:

```rust
pub struct BranchEqualCoreCols<T, const NUM_LIMBS: usize> {
    pub a: [T; NUM_LIMBS],
    pub b: [T; NUM_LIMBS],

    // Boolean result of a op b. Should branch if and only if cmp_result = 1.
    pub cmp_result: T,
    pub imm: T,

    pub opcode_beq_flag: T,
    pub opcode_bne_flag: T,

    pub diff_inv_marker: [T; NUM_LIMBS],
}
```

where you can consider&nbsp;`T` as being the type of a prime field. The Rust function to generate the equations is:

```rust
impl<AB, I, const NUM_LIMBS: usize> VmCoreAir<AB, I> for BranchEqualCoreAir<NUM_LIMBS>
where
    AB: InteractionBuilder,
    I: VmAdapterInterface<AB::Expr>,
    I::Reads: From<[[AB::Expr; NUM_LIMBS]; 2]>,
    I::Writes: Default,
    I::ProcessedInstruction: From<ImmInstruction<AB::Expr>>,
{
    fn eval(
        &self,
        builder: &mut AB,
        local: &[AB::Var],
        from_pc: AB::Var,
    ) -> AdapterAirContext<AB::Expr, I> {
        let cols: &BranchEqualCoreCols<_, NUM_LIMBS> = local.borrow();
        let flags = [cols.opcode_beq_flag, cols.opcode_bne_flag];

        let is_valid = flags.iter().fold(AB::Expr::ZERO, |acc, &flag| {
            builder.assert_bool(flag);
            acc + flag.into()
        });
        builder.assert_bool(is_valid.clone());
        builder.assert_bool(cols.cmp_result);

        let a = &cols.a;
        let b = &cols.b;
        let inv_marker = &cols.diff_inv_marker;

        let cmp_eq =
            cols.cmp_result * cols.opcode_beq_flag +
            not(cols.cmp_result) * cols.opcode_bne_flag;
        let mut sum = cmp_eq.clone();

        for i in 0..NUM_LIMBS {
            sum += (a[i] - b[i]) * inv_marker[i];
            builder.assert_zero(cmp_eq.clone() * (a[i] - b[i]));
        }
        builder.when(is_valid.clone()).assert_one(sum);

        let expected_opcode = flags
            .iter()
            .zip(BranchEqualOpcode::iter())
            .fold(AB::Expr::ZERO, |acc, (flag, opcode)| {
                acc + (*flag).into() * AB::Expr::from_canonical_u8(opcode as u8)
            })
            + AB::Expr::from_canonical_usize(self.offset);

        let to_pc = from_pc
            + cols.cmp_result * cols.imm
            + not(cols.cmp_result) * AB::Expr::from_canonical_u32(self.pc_step);

        AdapterAirContext {
            to_pc: Some(to_pc),
            reads: [cols.a.map(Into::into), cols.b.map(Into::into)].into(),
            writes: Default::default(),
            instruction: ImmInstruction {
                is_valid,
                opcode: expected_opcode,
                immediate: cols.imm.into(),
            }
            .into(),
        }
    }

```

An interesting part of this code is that it returns polynomial expressions to be used later, in addition to generating equations.

## ❓ Why is Rust code complex?

Although the code of the function is relatively short (around 50 lines), it contains a lot of implicit function calls. This mainly comes from the fact that it is parametrized by many traits, as you can see in the signature of the function. To know exactly which function is being called, you need to unroll a lot of the definitions.

This applies to all the definitions handling field elements, like `AB::Expr`, as well as iterators, with calls to the `zip` and `fold` functions for example. We are exposed to this complexity when formally verifying the code above, and this is one of the reasons Rust is a complex language to formally verify, although it is very elegant with a lot of abstractions.

## 🔍 What is the plan?

Our plan is as follows:

1. Translate the Rust code to Rocq using [coq-of-rust](https://github.com/formal-land/coq-of-rust) (this part is automatically done).
2. Express all the data types using native Rocq types and resolving the trait hierarchies (phase that we call **linking**).
3. Define an API for Plonky3 as a free monad in Rocq, with all the primitive operations like creating an expression, building a constraint, etc.
4. Show that the translated Rust code can be expressed in an equivalent way using this Plonky3 monad. Alternatively we could pretty-print the constraints at this point and compare them between the Rust and Rocq versions, if showing the equivalence is too hard.
5. Formally verify that the circuits are not underconstrained.

## 🔗 Linking

We are focusing on producing a typed-version for the `eval` function above, with an explicit trait hierarchy. Indeed `coq-of-rust` produces definitions that are untyped (all values have the type `Value.t`) and the relation between identifiers and function definitions or trait instances is defined by equations.

### Trait hierarchy

In the file [CoqOfRust/plonky3/commit_539bbc84/field/links/field.v](https://github.com/formal-land/coq-of-rust/blob/e91da9613fee8c2ba6b12f60d6a979935ed1d811/CoqOfRust/plonky3/commit_539bbc84/field/links/field.v) we define the trait hierarchy corresponding to the Plonky3 definitions for fields in [field/src/field.rs](https://github.com/Plonky3/Plonky3/blob/539bbc84085efb609f4f62cb03cf49588388abdb/field/src/field.rs). One thing we had to do was to break the mutual dependency between the traits `FieldAlgebra` and `Field`:

```rust
pub trait FieldAlgebra:
    // ...
{
    type F: Field;
    // ...
}

pub trait Field:
    FieldAlgebra<F = Self>
    // ...
{
    // ...
}
```

by defining on the Rocq side:

1. A trait `FieldAlgebraWithoutField` that is like `FieldAlgebra` but without the `Field` trait constraint on the associated type `F`.
2. A trait `Field` depending on `FieldAlgebraWithoutField`. Note that here, we do not need to add the `Field` constraint on `F` to be equivalent to the Rust code, as it is the `Self` type of `Field`, so it necessarily implements the `Field` trait.
3. A trait `FieldAlgebra` taking the trait `FieldAlgebraWithoutField` and adding the `Field` trait constraint on the associated type `F`.

On the Rocq side, we are free to organize our trait definitions as we want as long as they correspond to the trait equations generated by `coq-of-rust`. If we do not build our trait hierarchy properly, we will be stuck when defining the typed version of the functions' bodies.

### Eval body

For now, the typed version of the `eval` function is defined as follows:

```coq
Instance run_eval
      (AB I : Set) (NUM_LIMBS : Usize.t) `{Link AB} `{Link I}
      (AirBuilder_types : AirBuilder.AssociatedTypes.t)
      `{AirBuilder.AssociatedTypes.AreLinks AirBuilder_types}
      (VmAdapterInterface_types : VmAdapterInterface.AssociatedTypes.t)
      `{VmAdapterInterface.AssociatedTypes.AreLinks VmAdapterInterface_types}
      (run_InteractionBuilder_for_AB : InteractionBuilder.Run AB AirBuilder_types)
      (run_VmAdapterInterface_for_I :
        VmAdapterInterface.Run
          I
          AirBuilder_types.(AirBuilder.AssociatedTypes.Expr)
          VmAdapterInterface_types
      )
      (self : Ref.t Pointer.Kind.Ref (Self NUM_LIMBS))
      (builder : Ref.t Pointer.Kind.MutRef AB)
      (local :
        Ref.t Pointer.Kind.Ref (list AirBuilder_types.(AirBuilder.AssociatedTypes.Var)))
      (from_pc : AirBuilder_types.(AirBuilder.AssociatedTypes.Var)) :
    Run.Trait (eval (φ NUM_LIMBS) (Φ AB) (Φ I))
      [] [] [φ self; φ builder; φ local; φ from_pc]
      unit.
  Proof.
    constructor.
    destruct run_InteractionBuilder_for_AB.
    destruct run_AirBuilder_for_Self.
    destruct run_VmAdapterInterface_for_I.
    destruct (Impl_Borrow_BranchEqualCoreCols_for_slice_T.run
      AirBuilder_types.(AirBuilder.AssociatedTypes.Var)
      NUM_LIMBS
    ).
    destruct run_FieldAlgebra_for_Expr.
    destruct run_FieldAlgebra_for_Self.
    destruct run_Clone_for_Self.
    pose proof (Impl_Into_for_From_T.run (
      Impl_From_for_T.run AirBuilder_types.(AirBuilder.AssociatedTypes.Expr)
    )).
    destruct run_Add_for_Self.
    destruct run_Mul_for_Self.
    destruct run_Add_Expr_for_Var.
    destruct run_Mul_Var_for_Var.
    destruct run_Mul_Var_for_Expr.
    run_symbolic.
Admitted.
```

We generate the typed definition automatically with the tactic `run_symbolic`, based on the code translated by `coq-of-rust` and knowing there should only be one possible typed definition corresponding to each untyped one.

A difficulty that is not solved yet is that we need to provide in context all the trait instances which will be used. This is the series of `destruct` at the beginning of the proof. Unfortunately, a lot of them are needed and it is sometimes hard to find them, especially for those that require specific parameters which we need to make explicit.

There are also a few closures used in this code, for which the handling is not automated enough yet.

## 🏷️ Naming the versions

For now, we put all the Rocq translation of Rust code in a folder [CoqOfRust/](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust). To avoid collisions between different versions of the same library, we started using a sub-folder for each crate with the name of the version in use. For example, the Plonky3 translation is now put in the folder `CoqOfRust/plonky3/commit_539bbc84` as this is the precise version used by the OpenVM code we are looking at.

In the long run, it will also be useful to make backward compatibility proofs, where we show that a newer version of a crate behaves the same as an older one on all the common endpoints. The only downside of this naming scheme is that it makes the paths longer in the `Require` commands.

## ✒️ Conclusion

We have not succeeded yet in extracting a typed Rocq version of the `BranchEq` module of OpenVM. We will work next on adding more automation to `coq-of-rust` to make the linking phase easier.

In parallel, we are working on a hand-written version of the `BranchEq` module in Rocq, to start verifying the circuits, which we will show equivalent to the translated version once the linking phase is automated.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
