---
title: Web3
---

import Link from '@docusaurus/Link';

## Audit Reports

Here are audit reports about formal verification works we have done for blockchain projects:

- <a href="/reports/2026-02-15_revm-formal-specification.pdf">Ethereum Foundation: formal specification of Revm</a> (2026)
- <a href="/slides/2025-ef-zk-reports/keccak.pdf">Ethereum Foundation: Keccak hash function verification</a> (2025)
- <a href="/slides/2025-ef-zk-reports/branch-eq.pdf">Ethereum Foundation: Branch equality verification</a> (2025)
- <a href="/slides/2025-ef-zk-reports/llzk.pdf">Ethereum Foundation: LLZK verification</a> (2025)
- <a href="/reports/sui-type-checker/book/">Sui: the type-checker for Move</a> (Rust)
- <a href="/reports/smoo.th/book/">Smoo.th elliptic curve library</a> (Solidity)
- <a href="/reports/aleph-zero/book/">Aleph Zero: `rocq-of-rust` and `rocq-of-solidity`</a> (Rust/Solidity)
- <a href="/reports/tezos/book/">Tezos: parts of the L1</a> (OCaml)

## Working with us

We propose **formal verification engagements** for projects where stronger assurance is needed, including **Rust**, **Solidity**, **ZK circuits**, and other codebases that can benefit from our proof-oriented tooling and workflows.

Engagements can take the form of:

- a **one-time audit** to verify your code at a specific point in time,
- a **subscription** to verify your code as it evolves,
- **consulting** to train you to use our tools or formal verification in general.

<Link
  className="button button--secondary button--lg"
  href="https://calendar.app.google/hs9VRQYdb71KDMLd8"
  style={{
    marginBottom: 40,
    marginTop: 20,
    background: 'linear-gradient(135deg, #d49a2a 0%, #74b75f 42%, #3f8f4d 100%)',
    border: 'none',
    boxShadow: '0 12px 28px rgba(63, 143, 77, 0.32)',
    color: '#fff',
  }}
>
  <span>Schedule a call ●</span>
</Link>

We use **formal verification** and **[interactive theorem proving](https://rocq-prover.org/)** to cover software behaviors that are difficult to validate exhaustively with tests alone.

The output is a **machine-checked proof** for specified properties of the software under review.

Our verification process can **follow code changes** to re-check only what changed. This means that verification work can remain useful across releases instead of being recreated from zero each time.

Our tools are **open source**, documented, and available on our [GitHub](https://github.com/formal-land). We rely on the proof system Rocq so that the verification work remains inspectable and maintainable on your side as well.

The typical price for our subscription is **$20,000 per month** for one **engineer** available full time for your project to **specify and formally verify your code**. You can stop the subscription at any time or have someone half-time for half the price.

<!-- Contact us on [📧 &#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to get started! -->
