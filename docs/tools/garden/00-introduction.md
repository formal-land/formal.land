---
id: introduction
title: 🌱 Garden
---

:::info

[Garden](https://github.com/formal-land/garden) is a formal verification framework that helps you verify your zero-knowledge applications with ease.

:::

Link: [github.com/formal-land/garden](https://github.com/formal-land/garden) This project is funded thanks to the [Ethereum Foundation&nbsp;✨](https://ethereum.foundation/) and the [Verified zkEVM](https://verified-zkevm.org/) project.


## Overview

Zero-knowledge cryptography is a new technology coming to the blockchain space, offering applications that are both scalable and privacy-preserving. As an important application, the next version of Ethereum should be [rewritten entirely in zero-knowledge](https://www.youtube.com/watch?v=8mJDt8TGebc) with the Beam project.

Due to this technology being complex, making sure that the code is free of vulnerabilities is a challenge. This is where [Garden](https://github.com/formal-land/garden) comes to help.

By relying on formal verification techniques, that is to say, a mathematical analysis of the code, we can make sure that no attacks are possible. Formal verification is considered by the community as a requirement to ensure the security of zero-knowledge applications, given their complexity.

## Focus

We focus on the verification of circuits by providing building blocks to define and prove correct circuits. Our framework is intended to be language-agnostic. We work on [Plonky3](https://github.com/Plonky3/Plonky3) and [Circom](https://github.com/iden3/circom) circuits, with the verification of the [Blake3](https://github.com/Plonky3/Plonky3/tree/main/blake3-air) hash function as a first target.

We use the formal verification tool [Rocq](https://rocq-prover.org/), which we successfully use for our other projects to verify Rust and Solidity code.

## Status

This is a work in progress. We intend to be fully ready in the summer of 2025. If you have need to audit your circuits, please reach out to us. Book a [free 15-minute call](https://calendly.com/guillaume-claret) with us to discuss your needs.
