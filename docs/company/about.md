# About

We started in 2021. We specialize in **formal verification** for **critical software**. Our current public case studies are concentrated in blockchain and financial infrastructure, but our methods apply more broadly to embedded, systems, and other high-assurance software. Most of our code is eventually **[open-sourced](https://github.com/formal-land)** and relies on the proof assistant <a href="https://rocq-prover.org/">Rocq</a>.

Exhaustively testing a program is a difficult task, as the set of possible program inputs is generally **infinite**. With formal verification, we make a **mathematical analysis** of the code to ensure that it behaves as expected in all possible situations. As this mathematical analysis is complex, we use the **proof system Rocq** to make sure that our reasoning is correct. You can then replay these proofs on your computer to **verify our claims**. When the code changes, we can **replay existing proofs** to check if nothing broke. This contrasts with manual code reviews where the most rigorous work is often difficult to preserve across code upgrades.

Here are our main past and current projects:

- [coq-tezos-of-ocaml](https://formal-land.gitlab.io/coq-tezos-of-ocaml/) for the formal verification of the code of the L1 of the Tezos blockchain,
- [rocq-of-rust](https://github.com/formal-land/rocq-of-rust) a tool to formally verify Rust programs,
- [coq-of-python](https://github.com/formal-land/coq-of-python) a tool to formally verify Python programs and specify the [reference implementation](https://github.com/ethereum/execution-specs) of the EVM (the virtual machine for the [Ethereum](https://ethereum.org/)'s smart contracts).

We work best on **selected software components** where stronger evidence is worth the cost: critical logic, high-risk libraries, infrastructure code, and verification-sensitive subsystems.

If you want to make your software more trustworthy and work with us, <a href="mailto:&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;">email us</a>!
