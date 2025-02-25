---
id: specification-project
title: 💯 Full Specification Project
---

:::note GitHub

Repository: [github.com/formal-land/100-specification-smart-contracts](https://github.com/formal-land/100-specification-smart-contracts)

:::

This is a research project to improve the state-of-the-art of the specification of smart contracts.

The goal is to make sure a smart contract specification is complete and to fully express that "a user cannot steal or block a smart contract".

As the specification is the single point of failure in formal verification (if we assume the tooling correct), we would obtain a way to guarantee that a smart contract cannot be attacked. This means:

- For auditors: a way to find all vulnerabilities in a smart contract and win contests, at the expense of getting into the complexity of formal methods.
- For smart contract companies: a way to make sure their assets are safe and to get a competitive advantage.

Having code that can be considered as "the law" is also one of the initial dreams of the web3 movement.

## Ingredients

Here is what we have as an input:

- A list of standard smart contracts (ERC20, ERC721, etc.) with for example the OpenZeppelin implementations: [github.com/OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts). These correspond to the most common use cases, such as creating and exchanging tokens with various rules (stable coins, NFTs, etc.).
- A list of large and mainstream smart contracts, such as Uniswap or Compound: [github.com/shafu0x/awesome-smart-contracts](https://github.com/shafu0x/awesome-smart-contracts)
- Lists of known vulnerabilities:
  - A GitHub repository grouping the vulnerabilities in main categories: [github.com/kadenzipfel/smart-contract-vulnerabilities](https://github.com/kadenzipfel/smart-contract-vulnerabilities)
  - The list of audit reports from Code4rena: [code4rena.com/reports](https://code4rena.com/reports)
  - The [🐸&nbsp;rekt blog](https://rekt.news/)

On the side of formal verification, we can leverage these techniques:

- The use of the interactive theorem prover [Rocq](https://rocq-prover.org/). It is more powerful than most alternatives in this space, which tend to focus more on full automation and hence limit the kind of properties that can be stated and verified. To extract the semantics of a Solidity smart contract we use our tool [coq-of-solidity](https://github.com/formal-land/coq-of-solidity).
- The definition of a Domain Specific Language (DSL) to represent the contracts in a more high-level manner, while still being proven as equivalent to the original Solidity code.
- In this DSL the use of high-level primitives to express the most common patterns, in a way that is less efficient to execute but easier to reason about. This includes:
  - A notion of user.
  - A notion of token.
  - A notion of transfer.
  - A notion of promise (giving the right to someone to spend a certain amount of tokens). This could be represented as a virtual smart contract defining what can be done with the tokens for which we receive some execution rights.
- Expressing (and verifying) higher-order properties to state that it is impossible to get tokens without the explicit user consent, or to block the contract. That can leverage the use of temporal logic and flexibility of the Rocq prover.
