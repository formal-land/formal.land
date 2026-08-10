---
title: ⚡ Faster verified polynomial evaluation in Lean
tags: [Lean, zero-knowledge, formal verification, CompPoly]
authors: []
---

We have completed a milestone in [CompPoly](https://github.com/Verified-zkEVM/CompPoly), the Lean library developed in the context of the Verified zkEVM project for polynomial algorithms. The goal was practical: make polynomial evaluation and nearby operations faster, while keeping Lean proofs that the optimized executable code agrees with simpler specification-level definitions.

You can read the full report here: [CompPoly evaluation optimization report](/reports/2026-05-25_comppoly_optimization-evaluation.pdf).

<!-- truncate -->

<figure>
  ![Polynomial evaluation over a verified landscape](2026-06-23/polynomial-evaluation.webp)
</figure>

:::info

This work was funded by a grant from the [Ethereum Foundation](https://ethereum.foundation/) as part of the [zkEVM Formal Verification Project](https://verified-zkevm.org/). The implementation work was done by Valerii Huhnin from Formal Land and merged upstream in CompPoly.

:::

## Why polynomial evaluation matters

Polynomial algorithms are everywhere in zero-knowledge systems. They appear in encodings of constraints, interpolation and evaluation steps, polynomial commitments, low-degree testing, and FFT/NTT-based routines.

For a formal library such as CompPoly, there are two requirements that pull in different directions:

- The code should be clear enough to reason about in Lean.
- The code should be executable enough to use in larger algorithms.

The simplest definition is often the best one for proofs, but not always the one we want to run. This milestone was about closing that gap: adding optimized implementations, then proving that they compute the same result as the simple versions.

## What changed

The first part of the work added Horner-style evaluation across the main polynomial representations in CompPoly: univariate, bivariate, multivariate, and multilinear polynomials. This gives direct executable evaluation functions with correctness lemmas connecting them to the existing definitions.

The second part added batch evaluation for one univariate polynomial at many points. The naive approach evaluates the polynomial independently at each point. For a degree `n` polynomial and `m` points, this costs roughly `O(nm)`. The optimized implementation uses a subproduct tree: it builds products of the linear factors for the requested points, then reduces the input polynomial down the tree. With fast multiplication and fast monic modular reduction, this gives a much better asymptotic shape for large inputs.

We also improved the NTT-backed paths. The additive NTT implementation was rewritten around arrays, recurrence-based computation of vanishing polynomials, and precomputed twiddle factors. Separately, the root-of-unity NTT path gained a faster pipeline with cached plans, fused stages, compatible forward and inverse transforms, and multiplication contexts that can be reused by higher-level algorithms.

Finally, the milestone included a fast KoalaBear field implementation using machine integers and Montgomery representation, plus an optimization that was originally optional in the roadmap: evaluating many polynomials at one point.

## The proof story

The important point is not just that these functions are faster. It is that they are still connected to the simple versions by Lean proofs.

For example, the optimized Horner evaluators come with equivalence lemmas for the corresponding polynomial representations. The additive NTT work includes lemmas connecting the faster executable transform back to the previous computable version and to the NTT specification. The faster root-of-unity NTT path is similarly tied back to ordinary polynomial multiplication. The fast KoalaBear field is proven equivalent to the basic KoalaBear field.

This is the pattern we want for verified performance work:

- keep a simple definition as the specification;
- implement a faster executable version;
- prove that the faster version refines the simple one;
- benchmark the executable path so future changes do not silently erase the gain.

## Representative speedups

The report contains the detailed PR list and benchmark notes. Here are some representative numbers.

For additive NTT, one benchmark went from 16.77 ms to 1.34 ms, and a larger one went from 1.51 seconds to 8.12 ms.

For batch evaluation, a dense polynomial of degree below 65,536 evaluated at 8,192 points went from 25.60 seconds with pointwise Horner evaluation to 13.59 seconds using the subproduct-tree evaluation with NTT multiplication and reversal-based monic remainder.

For the faster root-of-unity NTT multiplication pipeline, degree-below-1,024 multiplication went from about 13.5 ms to about 3.8 ms over BabyBear and KoalaBear. With a reused plan, the same benchmark was around 3.5 ms. The same NTTFast backend also improved a large subproduct-tree evaluation benchmark from 14.93 seconds to 3.78 seconds compared with the baseline NTT backend.

The fast KoalaBear field gave broad downstream gains. The report describes algorithms using it as about 4x faster on average, with examples around 10x faster for univariate Horner evaluation and around 3x faster for univariate multiplication using fast NTT.

The many-polynomials-at-one-point optimization also paid off. Shared-power univariate evaluation was about 2x faster on optimized KoalaBear, and the faster multilinear implementation was about 50 percent faster on optimized KoalaBear.

## What we deliberately left out

Not every investigated optimization was merged.

One specialization for a 3-coset shape appeared technically possible, but it did not improve the bottleneck stage enough to justify the additional complexity. Another idea, transposing the memory layout for evaluating many polynomials, looked promising for cache behavior but would have required a specialized API.

Leaving these out was part of the engineering work. In a verified library, optimized code is not free: it has to be maintained, specified, proved, and benchmarked. The merged changes are the ones where the performance and proof story were strong enough.

## What this enables

CompPoly is now closer to being useful not only as a specification library, but also as an implementation library for large polynomial computations in Lean.

The optimized evaluation, NTT, field, multiplication, remainder, and batch-evaluation paths give downstream algorithms faster building blocks. The benchmark suite gives maintainers a way to compare naive and optimized variants, emit JSON and Markdown reports, and catch performance regressions in CI.

Most importantly, the work shows that we can optimize inside a proof assistant without losing the connection to clear mathematical definitions.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below._

:::
