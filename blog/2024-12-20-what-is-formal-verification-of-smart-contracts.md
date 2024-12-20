---
title: 🦄 How does formal verification of smart contracts work?
tags: [Solidity, smart contract, audit]
authors: []
---

We make here a general presentation about how the formal verification of smart contracts works by explaining:

- How people secure their smart contracts without formal verification.
- How do formal tools typically work?
- How our solution [coq-of-solidity](https://github.com/formal-land/coq-of-solidity) works on a short example (an [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) contract).
- Where LLMs could be the most useful, according to us, for formal verification work.

<!-- truncate -->

:::success Ask for the highest security!

To ensure your code is fully secure today, contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

Formal verification goes further than traditional audits to make 100% sure you cannot lose your funds, thanks to **mathematical reasoning on the code**. It can also be integrated into your CI pipeline to check that every commit is fully correct **without doing a whole audit again**.

We are already working with some of the leading blockchain entities such as:

- The [Ethereum Foundation](https://ethereum.foundation/)
- The [Sui Foundation](https://sui.io/about)
- Previously, the [Aleph Zero](https://alephzero.org/) and [Tezos](https://tezos.com/) foundations

:::

<figure>
  ![Forest](2024-12-20/forest.webp)
</figure>

## 🛡️ Securing smart contracts, the common way

Smart contracts are short programs, typically less than 5,000 lines of code, running "on the blockchain" to implement transaction rules. Examples can be virtual marketplaces to trade cryptocurrencies, virtual dollar coins, traceability databases, and NFTs, ... Most of the smart contracts are written in [Solidity](https://soliditylang.org/), a JavaScript-like language, and some are in [Rust](https://www.rust-lang.org/).

To know what a smart contract looks like, you can find a list of the biggest ones (in terms of users) on [shafu0x/awesome-smart-contracts](https://github.com/shafu0x/awesome-smart-contracts). A popular library to write smart contracts is [OpenZeppelin](https://www.openzeppelin.com/solidity-contracts). You can also search for the [Solidity language](https://github.com/search?q=lang%3ASolidity%20&type=repositories) on GitHub to find repositories with Solidity code.

Smart contracts are most of the time open-source, as it is important for the users to know what are the rules which handle their money. If a contract is not open-source, _it is probably a scam_.

Securing smart contracts is very important as a single bug can mean that an attacker can steal all the funds of the users who deposited money on the contract, or just block it to compromise the service. Millions of dollars are stolen every month due to bugs in the contracts, and some projects almost lose everything in such attacks. An historically important attack is the [DAO hack](https://www.gemini.com/fr-fr/cryptopedia/the-dao-hack-makerdao) where $60 million was stolen, leading to a hard fork of the [Ethereum](https://ethereum.org/) blockchain.

Now, how do people secure their code? First of all, most projects are well aware that software security is important, and if they want to raise money or advertise their product, they need to show that they are secure. They typically do the following:

- **Audits** Projects require a few audits, which are made by specialized companies or individuals, to review the code of a smart contract and find bugs or vulnerabilities. The issues are classified into categories of importance: informational, low, medium, high, or critical. The highest categories mean it is possible to steal all of the funds. Lower categories are more remarks about the coding style/missing documentation. At the end of an audit, a **report** is published together with the corrections for the vulnerabilities that were discovered. As an example, [here](https://github.com/trailofbits/publications/tree/master/reviews) is a list of audit reports from the company [Trail of Bits](https://www.trailofbits.com/).
- **Competitions** They enable anyone, during a pre-defined period of time of like a month, to look for bugs in a smart contract. At the end of the competition, a price pot is shared among the persons who found the most bugs. A typical price pot is &dollar;100,000, and some large competitions can go above &dollar;1,000,000&nbsp;💰. You can see the list of all ongoing competitions on [www.dailywarden.com](https://www.dailywarden.com/).
- **Bounties** Finally, bounties are like competitions but always live. The aim is to reward critical vulnerabilities, such that there is an incentive to report a bug instead of exploiting it. A popular platform is [Immunefi](https://immunefi.com/).

To give an idea of the amounts that are at risk of attacks on the blockchain, the total valuation of Ethereum, the main smart contracts platform, is estimated at more than 300 Billion dollars! Attacks are believed to be mainly done by 🇰🇵&nbsp;North Korean agents, but sometimes they happen to be single, clever individuals.

## 🛠️ Formal verification tools

So, where does formal verification stand in all that?

As it is the idea to mathematically reason about code to show the total absence of bugs in a protocol, formal verification seems to be the ideal tool to ensure the absence of vulnerabilities in a smart contract. In fact, most popular platforms do not take the risk of deploying new versions without a formal verification step, mainly with the leading tool [Certora](https://www.certora.com/).

As the verification is, at the end of the day, a mathematical proof, we can be sure that the code is correct for any possible user inputs, for a given and explicit _specification_. In addition, when the code changes, there is no need to review everything again: you can just formally verify the code that changed, as you would do when writing tests. This saves you time and money.

## 🚧 Limitations

So, what are the limitations? Here are a few:

- **Cost** You need to pay more than with traditional audits. Although the rewards are probably there, given the quantity of funds at risk in a smart contract, many small companies take the risk.
- **Time** Sometimes, time is an issue, even if the verification can be done in a continuous manner.
- **Specification** You still to have write the correct specification of your code! This is what defines what is a bug and what is a feature.
- **Complexity** Formal verification requires some specific knowledge which most developers do not have (This is why we are here to help you!&nbsp;😄).

Another one is completeness. Some formal verification tools aim to _fully automate_ the proof part, so that you only need to write the specifications. But then:

- Some properties are unprovable, or need to be cut into smaller ones in non-trivial ways.
- Some parts of the code are not verified. Typically, loops are only unrolled a few times (two or three times), instead of covering all the possible iterations.
- Some properties cannot even be expressed!

This is a _real_ concern, according to the security teams of a few blockchain companies we talked to. Popular tools such as Certora or [Halmos](https://github.com/a16z/halmos) fall into this category.

## 🌟 How to do better?

Using interactive theorem provers, such as [🐓&nbsp;Coq](https://coq.inria.fr/) or Lean, you overcome the limitations of automated provers as presented above. Here are a few tools you can use:

- [coq-of-solidity](https://github.com/formal-land/coq-of-solidity) using the Coq theorem prover. This is the tool we made!&nbsp;🎉
- [Clear](https://github.com/NethermindEth/Clear) using the Lean theorem prover. This is a tool made by the company [Nethermind](https://nethermind.io/).

[Kontrol](https://kontrol.runtimeverification.com/) from Runtime Verification is another verification tool providing ways to go further than automated tools.

For the question of correct and complete specifications, here is our idea:

> Build a set of high-level primitives encoding ideas such as "identity", "value", "ownership", "exact calculation", ... which are not necessarily definable in a programming language but can be axiomatized in a proof system. Use them to give the business rules of a contract in a clear manner and to express meta-properties such as "it is impossible to steal"&nbsp;🚓.

## 🔧 Technical pipeline

Solidity is a complex language. All the tools we mentioned above translate the code into a formal language to reason about it. They never take the Solidity code as it is. Instead, they first translate it to a simpler language, generally EVM bytecode (the assembly language for Solidity) or [Yul](https://docs.soliditylang.org/en/latest/yul.html) which is slightly higher level.

Then, they run several steps to first "🧼&nbsp;clean up the code" and obtain a representation that is high-level again. See, for example, the [Practical Verification of Smart Contracts using Memory Splitting](https://dl.acm.org/doi/10.1145/3689796) article from Certora about optimizing the memory representation of EVM code to retrieve some properties from the Solidity representation.

In `coq-of-solidity`, we call this step of going from low-level to high-level writing a "simulation", which is a high-level representation of the low-level code. This task is time-consuming. An alternative would be to use LLMs to generate it. We can check that the simulation is equivalent to the low-level version, either by writing a formal proof or by testing.

As an example, here is what we get for the verification of an ERC-20 smart contract with `coq-of-solidity` (you can click on the links to see the code):

- [the ERC-20 Solidity contract](https://github.com/formal-land/coq-of-solidity/blob/develop/coq/CoqOfSolidity/contracts/erc20/contract.sol)
- [the low-level version (in Yul, generated)](https://github.com/formal-land/coq-of-solidity/blob/develop/coq/CoqOfSolidity/contracts/erc20/contract.yul)
- [the Coq translation of the low-level version (generated)](https://github.com/formal-land/coq-of-solidity/blob/develop/coq/CoqOfSolidity/contracts/erc20/shallow.v)
- [the simulation in Coq (hand-written)](https://github.com/formal-land/coq-of-solidity/blob/develop/coq/CoqOfSolidity/contracts/erc20/simulations/contract.v)
- [the formal proof that the two are equivalent (hand-written)](https://github.com/formal-land/coq-of-solidity/blob/develop/coq/CoqOfSolidity/contracts/erc20/proofs/contract.v)

## 🧠 Use cases for LLMs

Here are a few areas where LLMs can be useful:

1. Writing formal **specifications** from the code of a smart contract, its documentation, and a dataset of known vulnerabilities. We can find such datasets on the Internet or by reading audits and competition reports.
2. Writing **formal proofs** for the specifications.
3. Writing a **high-level representation** of a smart contract in a formal system.
4. Writing a formal proof that a **high-level representation is valid**.

The fact that most of the smart contracts are open-source should also help running learning algorithms. We hope to explore this area more in the future or give ideas to others.

## ✒️ Conclusion

We have made a general presentation of security challenges around the deployment of smart contracts and how formal verification works and helps to secure smart contracts even more. We also presented a few ways to potentially improve current tooling.

We hope that this article will help you understand the importance of formal verification and how it can be used to secure your smart contracts. Please contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) if you need formal verification services or advice!

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::
