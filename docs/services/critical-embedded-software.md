# Critical Embedded Software

We produce **machine-checked proofs** for critical software components in embedded and systems codebases using the [Rocq](https://rocq-prover.org/) proof system and our own translation tooling.

## Sectors

- Aerospace and defence
- Automotive and software-defined vehicles
- Rail and safety-critical transport
- Critical infrastructure
- Tool vendors and engineering suppliers serving these sectors

## Typical targets

- Control logic and mode management
- Interface contracts and safety invariants
- Real-time or stateful components
- High-risk libraries in Rust or OCaml

## Services

- Formal verification of selected components
- Proof-oriented review and supplier code assurance
- Training for engineering teams
- Custom tooling to connect source languages to proof workflows

## Languages

Our strongest tooling covers **Rust**, **OCaml**, and **Solidity**. The blockchain case studies on this site use the same underlying methods — source-level translation into Rocq and replayable proofs — that apply to embedded and infrastructure software.

## How we work

We start from existing source code and focus on components where proof adds value beyond testing. A typical engagement:

1. Identify one component where failures are costly
2. Define a small set of properties worth proving
3. Connect the code to a proof workflow
4. Deliver machine-checked proofs and supporting artifacts
5. Keep proofs maintainable as the code evolves

## Contact

Reach us at [contact@formal.land](mailto:contact@formal.land) or book a call on [Calendly](https://calendly.com/guillaume-claret).
