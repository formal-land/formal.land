---
title: ⚈ Verification of the Smoo.th library – 2
tags: [Solidity, Yul, elliptic curves]
authors: []
---

In this blog post, we detail the continuation of our work to formally verify the [⚈&nbsp;Smoo.th](https://smoo.th/) library, which is an optimized implementation of elliptic curve operations in Solidity. We use our tool [coq-of-solidity](https://github.com/formal-land/rocq-of-solidity), representing any Solidity code in the generic proof assistant [🐓&nbsp;Coq](https://coq.inria.fr/), to verify the code for any execution path.

In particular, we cover the changes we made to use unoptimized Yul code and how we made a functional representation of the loop to compute the most significant bit of the scalars.

<!-- truncate -->

:::success Get started

To ensure your code is secure today, contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

Formal verification goes further than traditional audits to make 100% sure you cannot lose your funds, thanks to **mathematical reasoning on the code**. It can be integrated into your CI pipeline to check that every commit is fully correct **without doing a whole audit again**.

We make bugs such as the [DAO hack](https://www.gemini.com/fr-fr/cryptopedia/the-dao-hack-makerdao) ($60 million stolen) virtually **impossible to happen again**.

:::

<figure>
  ![Smooth in forest](2024-10-28/forest-smooth.webp)
</figure>

## 🐌 Unoptimized Yul

We are now verifying the code based on the unoptimized [Yul](https://docs.soliditylang.org/en/latest/yul.html) output of the Solidity compiler instead of the optimized one. As a consequence the code is a little bit more verbose, although in our present case the difference is limited as we are verifying a code that is already hand-optimized. The main advantage is that the variables are preserved instead of being moved to locations in the memory, which makes the verification easier, especially when handling loop invariants. A downside is that we now have to trust the correctness of the Solidity compiler's optimization passes.

As an example, here is how we now translate in Coq the loop to compute the most significant bit of the scalars with the unoptimized Yul code:

```coq
let~ var_ZZZ_83 := [[ 0 ]] in
let_state~ '(var_ZZZ_83, var_mask_63) :=
  (* for loop *)
  Shallow.for_
    (* init state *)
    (var_ZZZ_83, var_mask_63)
    (* condition *)
    (fun '(var_ZZZ_83, var_mask_63) => [[
      iszero ~(| var_ZZZ_83 |)
    ]])
    (* body *)
    (fun '(var_ZZZ_83, var_mask_63) =>
      Shallow.lift_state_update
        (fun var_ZZZ_83 => (var_ZZZ_83, var_mask_63))
        (let~ var_ZZZ_83 := [[ add ~(| add ~(| sub ~(| 1, iszero ~(| and ~(| var_scalar_u_55, var_mask_63 |) |) |), shl ~(| 1, sub ~(| 1, iszero ~(| and ~(| shr ~(| 128, var_scalar_u_55 |), var_mask_63 |) |) |) |) |), add ~(| shl ~(| 2, sub ~(| 1, iszero ~(| and ~(| var_scalar_v_57, var_mask_63 |) |) |) |), shl ~(| 3, sub ~(| 1, iszero ~(| and ~(| shr ~(| 128, var_scalar_v_57 |), var_mask_63 |) |) |) |) |) |) ]] in
        M.pure (BlockUnit.Tt, var_ZZZ_83)))
    (* post *)
    (fun '(var_ZZZ_83, var_mask_63) =>
      Shallow.lift_state_update
        (fun var_mask_63 => (var_ZZZ_83, var_mask_63))
        (let~ var_mask_63 := [[ shr ~(| 1, var_mask_63 |) ]] in
        M.pure (BlockUnit.Tt, var_mask_63)))
```

As a reference, here is the original smart contract code, in hand-written Yul:

```go
ZZZ := 0
for {} iszero(ZZZ) { mask := shr(1, mask) } {
  ZZZ := add(
    add(
      sub(1, iszero(and(scalar_u, mask))),
      shl(1, sub(1, iszero(and(shr(128, scalar_u), mask))))
    ),
    add(
      shl(2, sub(1, iszero(and(scalar_v, mask)))),
      shl(3, sub(1, iszero(and(shr(128, scalar_v), mask))))
    )
  )
}
```

We recognize the variables `var_ZZZ_83` and `var_mask_63`, corresponding to `ZZZ` and `mask` in the original code. They are made explicit in a state monad with the state `(var_ZZZ_83, var_mask_63)` for the loop.

We had some constructs we were not handling in `coq-of-solidity`, for constructs that appeared in the optimized code but not in the unoptimized one. An example is the initialization part of the `for` loop that seems to be always move away in the optimized code. We added those missing cases to our tool to be able to translate the unoptimized Yul code of Smoo.th.

## 🎗️ Verification of the loop

Verifying the&nbsp;`for` loop above can be challenging. Automated verification tools for Solidity typically do not fully handle loops, and instead unroll them three or four times to check the first iterations, which can miss some bugs.

The first step is to prove the loop is equivalent to a recursive function, as this will simplify reasoning. Here is a recursive function that computes the most significant bit of the scalars `u` and `v`:

```coq
Fixpoint get
  (u_low u_high v_low v_high : U128.t) (over_index : nat) :
  PointsSelector.t * nat :=
  match over_index with
  | O =>
    (* We should never reach this case if the scalars
       are not all zero *)
    (PointsSelector.Build_t false false false false, O)
  | S index =>
    let selector := HighLow.get_selector
      u_low u_high v_low v_high (Z.of_nat index) in
    if PointsSelector.is_zero selector then
      let new_over_index := index in
      get u_low u_high v_low v_high new_over_index
    else
      let next_over_index := index in
      (selector, next_over_index)
  end.
```

Here are some notable changes compared to the original `for` loop:

- We decompose the scalars `u` and `v` of 256 bits into their high and low parts, `u_low`, `u_high`, `v_low`, and `v_high` of 128 bits each.
- We make explicit the scalars that we select with the `PointsSelector` type, which is a record with four boolean fields. In the original code, the `ZZZ` variable is used to group these four booleans into a single integer.
- We use a natural number `over_index` to represent the mask. We decrement it at each iteration until it reaches zero, proving by construction the termination of the function. The relation with the mask is:

$$
\text{mask} = \lfloor 2^{\text{over\_index} - 1} \rfloor
$$

Note that this means that when the `over_index` is zero, then the `mask` is zero. This corresponds to the last case of the loop. We use the variable name `over_index` so that if we define:

$$
\text{over\_index} = \text{index} + 1
$$

then the relation with the mask is:

$$
\text{mask} = 2^{\text{index}}
$$

for all cases except the last one.

## 💡 Reasoning rule

Here is the reasoning rule for the smart contract loops in Coq:

```coq
Lemma LoopStep codes environment {In Out : Set}
    (init : In)
    (body : In -> LowM.t Out)
    (break_with : Out -> In + Out)
    (k : Out -> LowM.t Out)
    (output output_inter : Out)
    state state_inter state'
    (H_body :
      {{? codes, environment, state |
        body init ⇓ output_inter
      | state_inter ?}}
    )
    (H_break_with :
      match break_with output_inter with
      | inr output_inter' =>
        {{? codes, environment, state_inter |
          k output_inter' ⇓ output
        | state' ?}}
      | inl next_init =>
        {{? codes, environment, state_inter |
          LowM.Loop next_init body break_with k ⇓ output
        | state' ?}}
      end
    ) :
  {{? codes, environment, state |
    LowM.Loop init body break_with k ⇓ output
  | state' ?}}.
```

This rule, to be used in combination with some reasoning by induction, allows us to verify that a certain property is true for any number of iterations of the loop. In the present case, we use it to prove that the recursive function `get` is equivalent to the `for` loop. Basically, it states that:

- Assuming that the `body` of the loop evaluates to some output `output_inter`,
- if the `break_with` helper, which wraps the end of the end of the loop to either continue the loop or break it, evaluates to `output`,
- then the whole loop evaluates to `output`.

Here, the output of the body of the loop contains the state of the state monad, that is to say, the two variables `ZZZ` and `mask`, and a special variable to break or continue the `for` loop iterations.

Due to a lack of time, we only made a sketch of the proof of evaluation of this loop, admitting some intermediate lemmas about identities over the selector function. This work is available in the file [coq/CoqOfSolidity/contracts/scl/mulmuladdX_fullgen_b4/run.v](https://github.com/formal-land/rocq-of-solidity/blob/develop/coq/CoqOfSolidity/contracts/scl/mulmuladdX_fullgen_b4/run.v).

## ✒️ Conclusion

We have seen how to reason about loops with `coq-of-solidity`. This example with bit-level arithmetic was rather complex, but the general idea is still to reason by induction, showing the equivalence with a recursive function, using the reasoning rule `LoopStep` above to step through the loop.

If you have smart contracts that you need to secure, talk to us!&nbsp;🤝 The cost of an attack always far outweights the cost of an audit, and our solution, with full formal verification, is the more extensive in terms of coverage.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::
