---
title: 🥷 Formal verification of the Keccak precompile from Plonky3
tags: [zkVM, zero-knowledge, Plonky3, Keccak]
authors: []
---

In this blog post, we present our work to formally verify the determinism of the Keccak precompile ZK circuits in [Plonky3](https://github.com/Plonky3/Plonky3) using our [🍀&nbsp;Garden](https://github.com/formal-land/garden) framework.

Concretely, this means that:

- This complex circuit is safe for use with all the zkVMs based on Plonky3.
- The 🍀&nbsp;Garden framework is very expressive and can verify arbitrary circuits, as optimized precompiles are one of the most complex ZK circuits.

The formal verification of the determinism of ZK circuits is important, as this is one of the main sources of critical bugs in zkVMs, and these bugs cannot be found by other means, like testing, while most of the unverified zkVMs have at least one such bug.

<!-- truncate -->

:::info

This work was funded by a grant from the [Ethereum Foundation](https://ethereum.foundation/) to whom we are thankful, as part of the [zkEVM Formal Verification Project](https://verified-zkevm.org/), to "accelerate the application of formal verification methods to zkEVMs".

:::

<figure>
  ![Snow forest](2026-01-14/snow-forest.png)
</figure>

## Source code

The code of the Keccak circuit in Plonky3 is in [keccak-air/src/air.rs](https://github.com/Plonky3/Plonky3/blob/main/keccak-air/src/air.rs). This is a Rust code generating a list of polynomial constraints whose unique solution is the Keccak hash of the input. Here is an extract for one of the loops:

```rust
for x in 0..5 {
    builder.assert_bools(local.c[x].clone());
    builder.assert_zeros::<64, _>(array::from_fn(|z| {
        let xor = local.c[x][z].clone().into().xor3(
            &local.c[(x + 4) % 5][z].clone().into(),
            &local.c[(x + 1) % 5][(z + 63) % 64].clone().into(),
        );
        local.c_prime[x][z].clone() - xor
    }));
}
```

Here is our translation in the formal language [Rocq](https://rocq-prover.org/) that we use for Garden, from the file [Garden/Plonky3/keccak/air.v](https://github.com/formal-land/garden/blob/main/Garden/Plonky3/keccak/air.v):

```coq
Definition eval {p} `{Prime p}
    (local : KeccakCols.t) :
    M.t unit :=
  M.for_in_zero_to_n 5 (fun x =>
    let* _ := M.assert_bools (local.(KeccakCols.c).(Array.get) x) in
    M.assert_zeros (N := 64) {|
      Array.get z :=
        let xor :=
          xor3
            (local.(KeccakCols.c).[x].[z])
            (local.(KeccakCols.c).[(x + 4) mod 5].[z])
            (local.(KeccakCols.c).[(x + 1) mod 5].[(z + 63) mod 64]) in
        local.(KeccakCols.c_prime).[x].[z] -F xor
    |}
  ).
```

Note that the style is very similar to the Rust code. The variables, or columns since they are in a matrix, are described in [keccak-air/src/columns.rs](https://github.com/Plonky3/Plonky3/blob/main/keccak-air/src/columns.rs). For example, there is:

```rust
pub struct KeccakCols<T> {
    pub step_flags: [T; NUM_ROUNDS],
    pub export: T,
    pub preimage: [[[T; U64_LIMBS]; 5]; 5],
    pub a: [[[T; U64_LIMBS]; 5]; 5],
    pub c: [[T; 64]; 5],
    pub c_prime: [[T; 64]; 5],
    pub a_prime: [[[T; 64]; 5]; 5],
    pub a_prime_prime: [[[T; U64_LIMBS]; 5]; 5],
    pub a_prime_prime_0_0_bits: [T; 64],
    pub a_prime_prime_prime_0_0_limbs: [T; U64_LIMBS],
}
```

that we translate in [Garden/Plonky3/keccak/columns.v](https://github.com/formal-land/garden/blob/main/Garden/Plonky3/keccak/columns.v) to:

```coq
Module KeccakCols.
  Record t : Set := {
    step_flags : Array.t Z NUM_ROUNDS;
    export : Z;
    preimage : Array.t (Array.t (Array.t Z U64_LIMBS) 5) 5;
    a : Array.t (Array.t (Array.t Z U64_LIMBS) 5) 5;
    c : Array.t (Array.t Z 64) 5;
    c_prime : Array.t (Array.t Z 64) 5;
    a_prime : Array.t (Array.t (Array.t Z 64) 5) 5;
    a_prime_prime : Array.t (Array.t (Array.t Z U64_LIMBS) 5) 5;
    a_prime_prime_0_0_bits : Array.t Z 64;
    a_prime_prime_prime_0_0_limbs : Array.t Z U64_LIMBS;
  }.
```

## Correction of the translation

How do we know that our formal representation of the Keccak circuit in Rocq is the same as in Rust? To make sure they are the same, without resorting to a complex formalization of the Rust code of Plonky3, we rely on the fact that circuits are lists of polynomial equations, which can be compared once we extend all the definitions.

To that end, we implement both in Plonky3 and Rocq a pretty-printing function for circuits as polynomials, using the same format to make sure both definitions are the same. We found a few mistakes in our manual translation, but they were quick to fix (less than one hour of work). You can get more information about the pretty-printing in Rust in our previous blog post [🥷 Pretty-printing of Rust ZK constraints](2025-08-26-pretty-printing-rust-constraints.md). For Rocq, there is an extra step to go from our shallow representation of the circuits to a deep embedding using a tactic. You can look at the file [Garden/Plonky3/keccak/pretty_print.v](https://github.com/formal-land/garden/blob/main/Garden/Plonky3/keccak/pretty_print.v) for the details.

The file with all the pretty-printed polynomials is [Garden/Plonky3/keccak/air.snapshot](https://github.com/formal-land/garden/blob/main/Garden/Plonky3/keccak/air.snapshot), containing about 100,000 lines.

## Giving a semantics to the circuit

We use the semantics rules defined on the Garden monad in [Garden/Plonky3/M.v](https://github.com/formal-land/garden/blob/main/Garden/Plonky3/M.v) to give a semantics to the circuit. This part is mostly automated, and reformulates the imperative code of the circuit in propositional formulas on the variables of the circuit.

## Core verification

In order to represent bitwise operations of the hash function Keccak in a very optimized way, the Plonky3 implementation uses a lot of tricks, like representing XOR operations as a succession of multiplications and substractions. Some of the constraints are also not appearing in the natural order of definition for the Keccak steps, and only make sense when we assemble all of them together.

The core property, given in [Garden/Plonky3/keccak/proofs/air.v](https://github.com/formal-land/garden/blob/main/Garden/Plonky3/keccak/proofs/air.v), is as follows:

```coq
Lemma from_implies_to
    (local : KeccakCols.t)
    (a : Array.t (Array.t (Array.t bool 64) 5) 5) :
  From.t local a ->
  To.t local a.
```

Here `From.t` and `To.t` are two propositions expressing the constraints in the order in which they appear in the circuit, and in the expected order for the canonical Keccak definition, respectively. We also check the formula for the XORs as substractions:

```coq
Lemma xor_sum_diff_eq {p} `{Prime p} (H_p : 6 <= p) (local : KeccakCols.t) (x z : Z)
    (H_a_prime_bools : IsBool.t local.(KeccakCols.a_prime))
    (H_c_prime_bools : IsBool.t local.(KeccakCols.c_prime))
    (H_sum_diff :
      let diff :=
        let sum :=
          a_prime_c_prime.get_sum [
            local.(KeccakCols.a_prime).[0].[x].[z];
            local.(KeccakCols.a_prime).[1].[x].[z];
            local.(KeccakCols.a_prime).[2].[x].[z];
            local.(KeccakCols.a_prime).[3].[x].[z];
            local.(KeccakCols.a_prime).[4].[x].[z]
          ] in
        sum -F (local.(KeccakCols.c_prime).[x].[z]) in
      diff *F (diff -F 2) *F (diff -F 4) = 0
    ) :
  0 <= x < 5 ->
  0 <= z < 64 ->
  local.(KeccakCols.c_prime).[x].[z] =
  Z.b2z (xorbs [
    Z.odd (local.(KeccakCols.a_prime).[0].[x].[z]);
    Z.odd (local.(KeccakCols.a_prime).[1].[x].[z]);
    Z.odd (local.(KeccakCols.a_prime).[2].[x].[z]);
    Z.odd (local.(KeccakCols.a_prime).[3].[x].[z]);
    Z.odd (local.(KeccakCols.a_prime).[4].[x].[z])
  ]).
```

We make a general proof, only requiring that the prime order $p$ of the field is greater than $6$, but there is also a simpler proof that takes the specific prime of a circuit like Goldilocks, and tests all possible combinations of boolean inputs. This is pretty efficient as there are only six boolean values as parameters of this formula.

## One round

We make a reference definition of Keccak using boolean values and straightforward definitions. Here is an example of a sub-step:

```coq
Definition compute_a_prime
    (a : Array.t (Array.t (Array.t bool 64) 5) 5) 
    (c : Array.t (Array.t bool 64) 5) :
    Array.t (Array.t (Array.t bool 64) 5) 5 :=
  {|
    Array.get y := {|
      Array.get x := {|
        Array.get z :=
          xorbs [
            a.[y].[x].[z];
            c.[(x + 4) mod 5].[z];
            c.[(x + 1) mod 5].[(z + 63) mod 64]
          ];
      |}
    |}
  |}.
```

Then we show that combining all the equations of the circuit, the only possible solution, if it exists, is the same as one round of the canonical Keccak definition. The whole lemma is:

```coq
Lemma post_implies_round_computation {p} `{Prime p}
    (local' next' : KeccakCols.t)
    (is_first_row is_transition : bool)
    (a : Array.t (Array.t (Array.t bool 64) 5) 5)
    (round : Z) :
  let local := M.map_mod local' in
  let next := M.map_mod next' in
  Post.t local next is_first_row is_transition ->
  a.Valid.t local a ->
  0 <= round < NUM_ROUNDS ->
  step_flags.Valid.t local round ->
  let c := ComputeKeccak.compute_c a in
  let c_prime := ComputeKeccak.compute_c_prime c in
  let a_prime := ComputeKeccak.compute_a_prime a c in
  let b := ComputeKeccak.compute_b a_prime in
  let a_prime_prime := ComputeKeccak.compute_a_prime_prime b in
  let a_prime_prime_prime_0_0 := ComputeKeccak.compute_a_prime_prime_prime_0_0 a_prime_prime round in
  (
    forall x, 0 <= x < 5 ->
    forall y, 0 <= y < 5 ->
    forall limb, 0 <= limb < U64_LIMBS ->
    Impl_KeccakCols.a_prime_prime_prime local y x limb =
    Limbs.of_bools BITS_PER_LIMB
      (Array.get (ComputeKeccak.compute_a_prime_prime_prime a_prime_prime a_prime_prime_prime_0_0).[y].[x])
      limb
  ).
```

It uses the core verification lemmas made just before to handle all the tricks of the Keccak circuit.

## All the rounds

The Keccak hash function runs by applying the same round several times. There are some polynomial constraints to handle these iterations, by counting the number of steps and making sure we start each new round from the result of the previous round.

Here is the final statement, ensuring the safety of the circuit:

```coq
(** We are computing a full round of Keccak every [NUM_ROUNDS] rows. *)
Lemma posts_imply {p} `{Prime p} (rows' : Z -> KeccakCols.t)
    (preimages : Z -> Array.t (Array.t (Array.t bool 64) 5) 5) :
  let rows i := M.map_mod (rows' i) in
  ( (* We assume we validated the circuit on all the rows. Note that we assume here that we are
       always transitioning. *)
    forall i, 0 <= i ->
    Post.t (rows i) (rows (i + 1)) (i =? 0) true
  ) ->
  ( (* We assume the preimages are given by the [preimages] function at the beginning of
       each round. *)
    forall i, 0 <= i ->
    i mod NUM_ROUNDS = 0 ->
    forall x, 0 <= x < 5 ->
    forall y, 0 <= y < 5 ->
    forall limb, 0 <= limb < U64_LIMBS ->
    (rows i).(KeccakCols.preimage).[y].[x].[limb] =
    Limbs.of_bools BITS_PER_LIMB
      (Array.get (preimages (i / NUM_ROUNDS)).[y].[x])
      limb
  ) ->
  ( (* We prove that we get the Keccak output in the [a_prime_prime_prime] array of the
       last round. *)
    forall i, 0 <= i ->
    forall x, 0 <= x < 5 ->
    forall y, 0 <= y < 5 ->
    forall limb, 0 <= limb < U64_LIMBS ->
    let final_index := NUM_ROUNDS * (i / NUM_ROUNDS) + 23 in
    Impl_KeccakCols.a_prime_prime_prime (rows final_index) y x limb =
    Limbs.of_bools BITS_PER_LIMB
      (Array.get (ComputeKeccak.compute_keccak (preimages (i / NUM_ROUNDS))).[y].[x])
      limb
  ).
```

We represent the matrix of field variables with indexed columns, in the variable `rows : Z -> KeccakCols.t`.

:::note Remark

In addition to having verified the determinism of the circuit, we have also proven functional correctness. Indeed, we state that if there is a solution, then it must be the same as the canonical definition of Keccak.

:::

:::note Remark

We also show that we can optimize the circuit a bit, as we do not rely on all the constraints, in particular the ones related to the `preimage` column.

:::


## ✒️ Conclusion

Verifying the determinism of ZK circuits is mandatory, as this is a major source of vulnerabilities in zkVMs. We have seen here the summary of how to verify a very complex example, with the Keccak circuit of Plonky3 using the Garden framework and theorem proving.

The same principles extend to arbitrary circuits, including RISC-V circuits, other precompiles, and recursion circuits, or circuits containing other primitive operations such as lookups.

> You want to secure your zkVM? Discuss with us to know what is possible! ⇨ [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
