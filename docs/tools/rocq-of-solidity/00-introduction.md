---
id: introduction
title: 🪁 rocq-of-solidity
---

import Link from '@docusaurus/Link';

:::note

This project was funded by the [Aleph Zero Foundation](https://alephzero.org/).

:::

[**rocq-of-solidity**](https://github.com/formal-land/rocq-of-solidity) is a **formal verification** tool with **interactive theorem proving&nbsp;💫** for the **[🪁&nbsp;Solidity](https://soliditylang.org/) smart contract language**.

It converts Solidity smart contracts to the [🐓&nbsp;Rocq](https://rocq-prover.org/) proof assistant. It enables **formal verification** of Solidity smart contracts, that is to say code audits that cover all possible executions. The `rocq-of-solidity` tool is open source. It makes the Rocq translation from the [Yul](https://docs.soliditylang.org/en/latest/yul.html) intermediate representation used by the Solidity compiler. The generated Rocq code is more verbose than the source Solidity as it explicates low-level details of the execution model.

:::tip Service

Formal verification with **interactive theorem proving&nbsp;💫** provides the highest level of security so it would be a big miss not to use it. This is the only way to ensure full protection even against state-level actors&nbsp;🦸.

<Link
  className="button button--secondary button--lg custom-not-underlined"
  href="mailto:&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;"
>
  <span>🦸&nbsp;Contact us!&nbsp;</span>
</Link>

:::

## Workflow

To formally verify a Solidity project using `rocq-of-solidity` we work as follows:

1. Translate the Solidity code to Rocq using `rocq-of-solidity`
2. Define the state model of the contract (storage, memory, etc.)
3. Write functional specifications for each function of the Solidity contract
4. Verify that these specifications are equivalent to the translated Rocq code
5. Prove properties over these specifications

Some of this work can be verbose and repetitive, but tools like [Github Copilot](https://github.com/features/copilot) are increasingly helpful for generating boilerplate code and specifications.

## Benefits

- **Comprehensive security:** Formal verification covers all possible inputs and execution paths.
- **Reusable proofs:** Verification can be re-run as the contract evolves.
- **Higher assurance:** Provides mathematical guarantees beyond traditional testing and auditing.
