---
id: introduction
title: coq-of-solidity 🪁🌲
---

:::note

This project was funded by the [Aleph Zero Foundation](https://alephzero.org/).

:::

[**coq-of-solidity**](https://github.com/formal-land/solidity) is a **formal verification** tool with **interactive theorem proving&nbsp;💫** for the **[🪁&nbsp;Solidity](https://soliditylang.org/) smart contract language**.

It converts Solidity smart contracts to the [🐓&nbsp;Coq](https://coq.inria.fr/) proof assistant. It enables **formal verification** of Solidity smart contracts, that is to say code audits that cover all possible executions. The `coq-of-solidity` tool is open source. It makes the Coq translation from the [Yul](https://docs.soliditylang.org/en/latest/yul.html) intermediate representation used by the Solidity compiler. The generated Coq code is more verbose than the source Solidity as it explicates low-level details of the execution model.

:::tip Services

We apply `coq-of-rust` to **formally verify your Solidity programs** for **&#36;10 per line of 🪁&nbsp;Solidity code** (excluding comments) and	**&#36;20 per line for concurrent code**. Formal verification with **interactive theorem proving&nbsp;💫** provides the highest level of security so it would be a big miss not to use it. This is the only way to ensure full protection even against state-level actors&nbsp;🦸.

Our email:&nbsp;[&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land).

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
