---
title: 🦄 What we are doing at Formal Land
tags: [security, formal verification, interactive theorem proving, Rust, Solidity]
authors: []
---

In this blog post we present what we are currently doing at Formal Land&nbsp;🌲, what tools and services we are developing to provide more security for our customers&nbsp;😶‍🌫️.

We believe that for critical applications such as blockchains (L1, L2, dApps) you should always **use the most advanced technologies to find bugs, otherwise bad actors will do** and overtake you in the never ending race for security&nbsp;🦸.

**Formal verification** is one of the best techniques&nbsp;💪 to ensure that your code is correct, as it **checks every possible inputs&nbsp;🔍** and scenarios for a given security property. This is what we are focusing on at Formal Land.

<!-- truncate -->

:::success Get started

To know more about formal verification and how we can help you, contact us at&nbsp;[&nbsp;📧&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

:::

<figure>
  ![Forge in forest](2024-09-27/forge.webp)
</figure>

## Company

We have been existing for **three years** focusing on formal verification for the web3 industry, to validate software where safety is of paramount importance&nbsp;🛡️.

**Formal verification** is a technique to analyze the code of a program which relies on making a **mathematical proof that the code is correct**, proof that is furthermore checked by a computer&nbsp;🤓.

For our formal verification work, we exclusively use the proof system [Coq&nbsp;🐓](https://coq.inria.fr/) because this is both:

- **A generic proof system&nbsp;🌌** We can represent any programming languages and security properties in Coq.
- **A well known system&nbsp;💕** Coq is taught in many universities and has a large community of users, with complex software such as the C compiler [CompCert](https://en.wikipedia.org/wiki/CompCert) fully implemented and verified in it.

We verify **existing&nbsp;🗿** code, rather than developing new code written in a style simplifying the formal verification. This is generally harder, but it is also more useful for many of our customers who have already written code and want to ensure it is correct without rewriting it. Verifying the existing code also enables to verify the optimizations, that generally involve low-level operations that would be forbidden rewriting the code for formal verification.

Finally, we verify the actual **implementation&nbsp;🔬** of programs rather than a model of them. This is to capture all the implementation details, such as integer overflows, or the use of specific data structures or libraries. We believe that a lot of bugs are hidden in the details, in addition to the more high-level bugs hidden in the design.

In addition of capturing the details, verifying the implementation makes sure that we are verifying a specific version of the code, and that we can **follow the code updates&nbsp;🪜** as new commits are coming to the main branch.

## coq-of-ocaml

Building 

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land), or comment this post below!_

:::
