---
id: introduction
title: What is coq-of-solidity
---

[**coq-of-solidity**](https://github.com/formal-land/coq-of-solidity) is a transpiler from the [Solidity](https://soliditylang.org/) smart contract language to the [🐓&nbsp;Coq](https://coq.inria.fr/) proof assistant. It enables **formal verification** of Solidity smart contracts, that is to say code audits that cover all possible executions. The `coq-of-solidity` tool is open source.

`coq-of-solidity` generates a translation of Solidity into Coq. We run the translation from the [Yul](https://docs.soliditylang.org/en/latest/yul.html) intermediate representation used by the Solidity compiler. The generated Coq code is more verbose than the source Solidity as it explicates low-level details of the execution model.

:::tip Services

If you want to formally verify Solidity smart contracts, contact us at&nbsp;[&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)! Formal verification provides the highest level of assurance for smart contract security.

:::

## Workflow

To formally verify a Solidity project using `coq-of-solidity` we work as follows:

1. Translate the Solidity code to Coq using `coq-of-solidity`
2. Define the state model of the contract (storage, memory, etc.)
3. Write functional specifications for each function of the Solidity contract
4. Verify that these specifications are equivalent to the translated Coq code
5. Prove properties over these specifications

Some of this work can be verbose and repetitive, but tools like [Github Copilot](https://github.com/features/copilot) are increasingly helpful for generating boilerplate code and specifications.

## Benefits

- **Comprehensive security:** Formal verification covers all possible inputs and execution paths.
- **Reusable proofs:** Verification can be re-run as the contract evolves.
- **Higher assurance:** Provides mathematical guarantees beyond traditional testing and auditing.
