# Critical Embedded Software

We help teams apply formal verification to **critical software components** in embedded and systems codebases.

This is relevant when software faults are expensive because they affect:

- safety
- certification
- integration across suppliers
- mission success
- long-lived infrastructure

## Where we fit

We are a good fit for:

- aerospace and defence programs
- automotive and software-defined vehicle platforms
- rail and other safety-critical transport systems
- critical infrastructure software
- tool vendors and engineering suppliers serving these sectors

Typical targets include:

- control logic
- mode management
- interface contracts
- safety invariants
- selected real-time or stateful components
- high-risk libraries in Rust or OCaml

## What we do

We use the [Rocq](https://rocq-prover.org/) proof system together with our own translation and proof tooling to produce **machine-checked proofs** on selected properties of your code.

Our work usually starts from existing source code rather than a greenfield specification effort. We focus on the parts of a system where proof can add value beyond testing and simulation.

We can help with:

- formal verification as a service
- proof-oriented review of critical components
- supplier code assurance
- training and enablement for engineering teams
- custom tooling to connect source languages to proof workflows

## Languages and tooling

Today, our strongest public tooling is around:

- Rust
- OCaml
- Solidity and related blockchain languages

The blockchain references on this website reflect our current public case studies, but the underlying methods are more general:

- source-level translation into Rocq
- replayable machine-checked proofs
- proofs that can be re-run as the implementation evolves

That same approach is relevant to critical embedded and infrastructure software.

## How we work

The most effective engagements are usually narrow and concrete.

A typical project looks like:

1. identify one component where failures are costly
2. define a small set of properties worth proving
3. connect the code to a proof workflow
4. deliver machine-checked proofs and the supporting engineering artifacts
5. keep the work maintainable as the code changes

This works better than trying to "formally verify everything" at once.

## Why buyers care

Formal verification is useful when teams need stronger evidence on software that is:

- hard to test exhaustively
- costly to rework late
- certification-sensitive
- delivered by a supplier
- central to system safety or mission behavior

In those cases, proof can reduce uncertainty on the specific components that drive the most risk.

## Get in touch

If you are working on critical software and want to discuss whether formal verification can help on a concrete subsystem, contact us at [contact@formal.land](mailto:contact@formal.land) or book a call on [Calendly](https://calendly.com/guillaume-claret).
