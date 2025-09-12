---
title: 🥷 Formal verification of an OpenVM chip
tags: [zkVM, zero-knowledge, determinism]
authors: []
---

In this blog post, we present the formal verification of the determinism of the [BranchEq](https://github.com/openvm-org/openvm/blob/main/extensions/rv32im/circuit/src/branch_eq/core.rs) circuit of the [OpenVM](https://openvm.dev/) zkVM. This zkVM provides an implementation of RISC-V with [Plonky3](https://github.com/Plonky3/Plonky3), and appears to be very fast even on a CPU.

We do our verification work using the formal verification system [Rocq](https://rocq-prover.org/), showing the determinism on a model of the code. To see the other properties that can be verified, you can refer to our previous blog post [🦄 What to verify in a zkVM](2025-08-12-verification-of-zkvm.md). We will see later how to make sure that the Rocq model corresponds to the actual Rust implementation of the circuit.

<!-- truncate -->

:::info

This work was funded by a grant from the [Ethereum Foundation](https://ethereum.foundation/) to whom we are thankful, as part of the [zkEVM Formal Verification Project](https://verified-zkevm.org/), to "accelerate the application of formal verification methods to zkEVMs".

:::

<figure>
  ![Green forest](2025-08-13/forest.png)
</figure>

## 🦀 Rust source code

The role of the `branch_eq` chip is to compare two integers decomposed into limbs, and to make a code jump depending on the result of the comparison. To check the determinism, we only need to verify the code of the circuit itself, which is:

```rust
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

    // 1 if cmp_result indicates a and b are equal, 0 otherwise
    let cmp_eq =
        cols.cmp_result * cols.opcode_beq_flag + not(cols.cmp_result) * cols.opcode_bne_flag;
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

If you are used to Plonky3 circuits, you should be able to read most of the code. The most clever part is this loop:

```rust
let mut sum = cmp_eq.clone();

for i in 0..NUM_LIMBS {
    sum += (a[i] - b[i]) * inv_marker[i];
    builder.assert_zero(cmp_eq.clone() * (a[i] - b[i]));
}
builder.when(is_valid.clone()).assert_one(sum);
```

to compute whether the two integers are equal. For two different values of `a` and `b`, it relies on the oracle `inv_marker`, which will be equal to the inverse of `(a[i] - b[i])` for one of the `i` such that `a` and `b` differ, and to 0 otherwise. In contrast to the AIR examples provided in the Plonky3 repository, we return field expressions in addition to asserting equations with the `builder`. This will enable more advanced compositions with other chips.

## 🐓 Rocq model

We translate this code _manually_ to the formal language Rocq using our zero-knowledge framework [Garden](https://github.com/formal-land/garden). We will see later how to check that this translation is faithful to the original code. Here is our translation:

```coq
Definition eval {p} `{Prime p} {NUM_LIMBS : Z}
    (self : BranchEqualCoreAir.t NUM_LIMBS)
    (local : BranchEqualCoreCols.t NUM_LIMBS)
    (from_pc : Z) :
    M.t (AdapterAirContext.t NUM_LIMBS) :=
  let flags : list Z := [
    local.(BranchEqualCoreCols.opcode_beq_flag);
    local.(BranchEqualCoreCols.opcode_bne_flag)
  ] in

  let* is_valid : Z :=
    List.fold_left
      (fun acc flag =>
        let* _ := M.assert_bool flag in
        M.pure (BinOp.add acc flag)
      )
      Z.zero
      flags in
  let* _ := M.assert_bool is_valid in
  let* _ := M.assert_bool local.(BranchEqualCoreCols.cmp_result) in

  let a : Array.t Z NUM_LIMBS := local.(BranchEqualCoreCols.a) in
  let b : Array.t Z NUM_LIMBS := local.(BranchEqualCoreCols.b) in
  let inv_marker : Array.t Z NUM_LIMBS := local.(BranchEqualCoreCols.diff_inv_marker) in

  let* cmp_eq : Z :=
    M.pure (
      BinOp.add
        (BinOp.mul local.(BranchEqualCoreCols.cmp_result) local.(BranchEqualCoreCols.opcode_beq_flag))
        (BinOp.mul (M.not local.(BranchEqualCoreCols.cmp_result)) local.(BranchEqualCoreCols.opcode_bne_flag))
    ) in

  let* _ := M.for_in_zero_to_n NUM_LIMBS (fun i =>
    M.assert_zero (BinOp.mul cmp_eq (BinOp.sub (Array.get a i) (Array.get b i)))
  ) in
  let sum : Z := M.sum_for_in_zero_to_n NUM_LIMBS (fun i =>
    BinOp.mul (Array.get inv_marker i) (BinOp.sub (Array.get a i) (Array.get b i))
  ) in
  let sum := BinOp.add sum cmp_eq in
  let* _ := M.when is_valid (M.assert_one sum) in

  let flags_with_opcode_integer : list (Z * Z) :=
    [
      (local.(BranchEqualCoreCols.opcode_beq_flag), 0);
      (local.(BranchEqualCoreCols.opcode_bne_flag), 1)
    ] in
  let expected_opcode : Z :=
    Lists.List.fold_left
      (fun acc '(flag, opcode) =>
        BinOp.add acc (BinOp.mul flag opcode)
      )
      flags_with_opcode_integer
      0 in
  let expected_opcode : Z :=
    BinOp.add expected_opcode self.(BranchEqualCoreAir.offset) in

  let to_pc : Z :=
    BinOp.add
      (BinOp.add
        from_pc
        (BinOp.mul local.(BranchEqualCoreCols.cmp_result) local.(BranchEqualCoreCols.imm))
      )
      (BinOp.mul (M.not local.(BranchEqualCoreCols.cmp_result)) self.(BranchEqualCoreAir.pc_step))
    in

  M.pure {|
    AdapterAirContext.to_pc := Some to_pc;
    AdapterAirContext.reads := (a, b);
    AdapterAirContext.writes := tt;
    AdapterAirContext.instruction := {|
      ImmInstruction.is_valid := is_valid;
      ImmInstruction.opcode := expected_opcode;
      ImmInstruction.immediate := local.(BranchEqualCoreCols.imm);
    |};
  |}.
```

It should be similar to the Rust code above, with the use of the monadic notation `let*` as asserting equations makes a side-effect. We do not need an explicit `builder` variable, as it is part of the monad `M.t`. We should use binary notations `+` and `*` for `BinOp.add` and `BinOp.mul` to make it even more similar to the original code. We do not distinguish between field elements, variables, and polynomial expressions, as we can do symbolic reasoning in Rocq, and we do not need to translate the constraints to a list of polynomial equations.

We parametrize all the code by an ambient prime number $p$, which is used for all the field operations, in order to know modulo which&nbsp;$p$ we should make the computations. We represent all the field elements in $\mathbb{Z}$, and we apply the modulo operation on the result of each operation.

## 🧠 Reasoning rules

We use similar reasoning rules as in the previous blog post [🥷 Formal verification of LLZK circuits in Rocq](2025-07-31-llzk-to-rocq-verification.md). These rules execute the code as one would expect for a purely functional program, and additionally accumulate the equational constraints in a resulting proposition. Here is the rule for the monadic bind:

```coq
| Let {A B : Set} (e : M.t A) (k : A -> M.t B) (value : A) (output : B) (P1 P2 : Prop) :
  {{ e 🔽 value, P1 }} ->
  (P1 -> {{ k value 🔽 output, P2 }}) ->
  {{ M.Let e k 🔽 output, P1 /\ P2 }}
```

When we execute two computations in sequence `e` and `k`, the final constraint is the conjunction of the constraints for `e` and `k`. The basic rule to add a constraint is:

```coq
| Equal (x1 x2 : Z) :
  {{ M.Equal x1 x2 🔽 tt, x1 = x2 }}
```

We can also simplify the proposition by a potentially weaker one, as we are only interested in what the constraints imply to verify determinism:

```coq
| Implies {A : Set} (e : M.t A) (value : A) (P1 P2 : Prop) :
  {{ e 🔽 value, P1 }} ->
  (P1 -> P2) ->
  {{ e 🔽 value, P2 }}
```

You can find the full list of rules in the file [Garden/Plonky3/M.v](https://github.com/formal-land/garden/blob/main/Garden/Plonky3/M.v) in the [Garden repository](https://github.com/formal-land/garden).

## 📝 Specification

We can now specify the code. You can read the full specification in the lemma `eval_implies` in the file [Garden/OpenVM/BranchEq/core_with_monad.v](https://github.com/formal-land/garden/blob/main/Garden/OpenVM/BranchEq/core_with_monad.v). We state:

- What is the expected output in a purely functional form for the output of the function in `AdapterAirContext.t NUM_LIMBS`?
- What are the constraints on the columns in `local`?

Here is the type of the `local` parameter:

```coq
Record t {NUM_LIMBS : Z} : Set := {
  a : Array.t Z NUM_LIMBS;
  b : Array.t Z NUM_LIMBS;
  cmp_result : Z;
  imm : Z;
  opcode_beq_flag : Z;
  opcode_bne_flag : Z;
  diff_inv_marker : Array.t Z NUM_LIMBS;
}.
Arguments t : clear implicits.
```

We assume that either `opcode_beq_flag` or `opcode_bne_flag` is equal to `1`, and that the other one is equal to `0`. This flag controls whether we are checking the equality or the inequality of the two integers `a` and `b`. For the constraints, our specification says that:

```coq
local.(BranchEqualCoreCols.cmp_result) = Z.b2z expected_cmp_result
```

meaning that the column `cmp_result` must represent a boolean with value:

```coq
let expected_cmp_result : bool :=
  match branch_equal_opcode with
  | BranchEqualOpcode.BEQ =>
    if Array.Eq.dec local.(BranchEqualCoreCols.a) local.(BranchEqualCoreCols.b) then
      true
    else
      false
  | BranchEqualOpcode.BNE =>
    if Array.Eq.dec local.(BranchEqualCoreCols.a) local.(BranchEqualCoreCols.b) then
      false
    else
      true
  end
```

which is the result of the comparison check, depending on the opcode flag.

## 🔍 Proof

We verify the specification by applying the reasoning rules to accumulate the constraints on each monadic bind `let*`. For example, for:

```coq
let* _ := M.assert_bool local.(BranchEqualCoreCols.cmp_result) in
```

we do:

```coq
eapply Run.LetAccumulate. {
  constructor.
}
intros H_cmp_result.
```

This gives us, in the proof context, the additional hypothesis:

```coq
H_cmp_result: IsBool.t local.(BranchEqualCoreCols.cmp_result)
```

It states that the column `cmp_result` is either `0` or `1`. For most of the rest of the reasoning, we apply similar rules and reason exhaustively for all the possible cases over the boolean variables and the equality of `a` and `b`, eliminating impossible cases and showing that the column `cmp_result` always contains the expected value.

To verify this circuit, we also made the choice to use a specific value for the prime number&nbsp;$p$ with the Goldilocks prime. This is making the proof simpler in some cases, as we can explicitly compute the result of modulo operations on boolean values, without relying on field reasoning. We think it is safe to assume a specific prime, as circuits generally use a single fixed prime value.

For the expected output, for example, for the `pc` variable, which is modified if we decide to jump, we state that we must have the expected value:

```coq
AdapterAirContext.to_pc :=
  Some (BinOp.add from_pc (
    if expected_cmp_result then
      local.(BranchEqualCoreCols.imm)
    else
      self.(BranchEqualCoreAir.pc_step)
  ));
```

Once we have specified the `cmp_result` column, this amounts to showing the equality of two expressions using field elements, which is done through automation procedures.

:::info Note

For this circuit, the completeness is not obvious, as there is an oracle variable `diff_inv_marker` which must have a correct value provided by the prover. We should also verify the completeness of the circuit with appropriate reasoning rules.

:::

## ✒️ Conclusion

We have seen how to specify the determinism of the `branch_eq` chip of OpenVM, and to formally verify that this is the case for any possible parameters and column values.

Next, we will see how to make sure that our Rocq formalization corresponds to the Rust implementation of the chip.

> You want to discuss security? Contact us! ⇨ [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
