---
title: 🤖 Annotating what we are doing for an LLM to pick up
tags: [llm, ai]
authors: []
---

We want to write a series of blog posts about our efforts to use LLMs to formally verify code faster with the [<img src="https://raw.githubusercontent.com/coq/rocq-prover.org/refs/heads/main/rocq-id/logos/SVG/icon-rocq-orange.svg" height="18px" />&nbsp;Rocq/Coq](https://rocq-prover.org/) theorem prover. Here, we present an experiment consisting of writing all that we are doing so that we can document our reasoning and help LLMs to pick up human techniques.

According to many publications about using generative AI to help formal verification, it is almost impossible to find a proof in "one shot". So, one certainly has to interact with the system, maybe by following the human way. Here we aim to document this "human way" of writing proofs.

<!-- truncate -->

:::success Ask for the highest security!

How do you ensure your security audits are exhaustive?

When millions are at stake, bug bounties are not enough.

The only way to do this is to use **formal verification** to _prove_ your code is correct.

This is what we provide as a service. **Contact us** at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to ensure your code is safe!&nbsp;🚀

We cover **Rust**, **Solidity**, and soon **zk circuits**.

:::

<figure>
  ![Robot](2025-01-06/robot-forest.webp)
</figure>

## 🔍 Example

We take as an example our verification effort for the type-checker of the Move language. We have a big lemma to verify with 77 cases, one per Move instruction. We now write everything we do in a single linear document [what_we_do.md](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/what_we_do.md). Here is an extract:

>Now a previous case is failing:
>
>```
>hauto l: on.
>```
>
>with:
>
>```
>Error: hauto failed
>```
>
>As this is a tactic generated by `best`, we try to use `best` again. It works! We continue and arrive at our current goal. Out of curiosity, we try `best` again. It works! The idea is that since we made weaker the definition of what we want to prove, maybe we can now solve it automatically.
>
>We have six cases which are solved by `best`:
>
>```
>{ best. }
>{ best. }
>{ best. }
>{ best. }
>{ best. }
>{ best. }
>```
>
>We replace it by `; best` after the block of previous tactics:
>
>```
>step; cbn; (try easy); (try now destruct operand_ty);
>  repeat (step; cbn; try easy);
>  constructor; cbn; try assumption;
>  best.
>```
>
>It works! By running `make` again we get that we can replace the `best` by `
>
>So now we have done the `Bytecode.CastU8` case.

We document both our successes and failures, as this is what we do when we interact with the system to try to find the proof of a property.

## 🐆 Quick takeaways

This is time-consuming. Hopefully, this pays off in the long run. There may be a way to automatically record what we are doing, by recording the user interactions in a VSCode plugin. In addition, when writing what we do by hand we might forget to write some important steps but seemingly obvious steps, like checking into another file, due to laziness.

The autocomplete from GitHub Copilot, while writing the document, already generated the right steps to do from the journal we are writing, like "compile the project again" or a good tactic to try.

We realize that we have a lot to write in consolidated documents and that a lot of what we do are coding conventions we have taken. These might not be the ones used by everyone, so we have to distinguish between our conventions and general Rocq knowledge.

There is a lot of domain-specific knowledge that only a human can provide and that is specific to each project. For example, here, a human has to give hints related to how the Move type-checker is implemented, which can only be understood by reading the source code.

Here we try to give some sense of mid-level intuitions: how to navigate the project, go to a definition, add a new property, ... We do not focus too much on the details of the tactics to use (more low-level), or the high-level intuition behind the proof which might be better done by a human.

This helps to understand how an LLM thinks and which information it has access to.

## ✒️ Conclusion

We have quickly presented the idea of writing what we are doing along the way to help LLMs understand how to verify some code.

Please tell us what you think or if you have some ideas for improving this process!

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::