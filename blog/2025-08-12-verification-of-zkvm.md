---
title: 🦄 What to verify in a zkVM
tags: [zkVM, zero-knowledge, specification]
authors: []
---

We present in this blog post the main properties that need to be formally verified in the circuits of a zkVM to consider it as secure.

The formal verification of zero-knowledge applications is considered a priority by [Vitalik Buterin](https://x.com/VitalikButerin), the founder of [Ethereum](https://ethereum.org/), among others. The website [ethproofs.org](https://ethproofs.org/) lists zkVMs ready to run Ethereum, with formal verification of the code being one of the criteria to appear as 🟩 green.

<!-- truncate -->

<figure>
  ![Green forest](2025-08-12/forest.jpeg)
</figure>

## 🧭 Determinism

Zero-knowledge circuits are a set of equations whose solutions are the execution trace of a certain VM, for example, a RISC-V implementation or directly an EVM. A zero-knowledge proof shows that a user knows a solution to those equations.

Given the initial state of the virtual machine, there must be at most one solution, as most VMs are deterministic. If someone submits another solution that is still validated by the equations, it will correspond to an execution trace that is not supposed to be possible. This can represent an attack, if someone is able to forge a solution corresponding to an execution by-passing the check of signatures in transactions, essentially allowing them to steal the funds of other users.

A simple equation is this one:

$$
  \begin{aligned}
    x(x - 1) &= 0 \\
  \end{aligned}
$$

enforcing that $x$ is either $0$ or $1$, that is to say, a boolean value, generally a requirement for all the variables of a zkVM.

As the set of equations is generally very long (typically thousands of cases), with a code implementation evolving over time, it is not possible to verify all the cases manually, and it is very easy to make at least one mistake. This is where _formal verification_ comes in, with the capability to verify the correctness of the equations for all possible initial values using a proof assistant such as [Rocq](https://rocq-prover.org/).

In a circuit $\mathcal{C}$, we will separate the variables into a few categories:

- The **input** variables, which are the variables that are initially known, typically represent the initial state of the VM at each execution step.
- The **output** variables represent what is computed by the VM at each iteration.
- The **internal** variables represent intermediate values computed by the VM to compute the output. We can also consider these variables as part of the output.
- The **oracle** variables, which are variables with potentially many right answers, are used to help in intermediate steps of computations. This part is rarely present.

We will say that a circuit holds if and only if all its equations are satisfied, what we note:

$$
  \mathcal{C}(\text{input}, \text{output}, \text{oracle})
$$

We will say that the circuit $\mathcal{C}$ is deterministic if there exists a function $f$ such that:

$$
  \forall\ \text{input}, \text{output}, \text{oracle},\\
  \mathcal{C}(\text{input}, \text{output}, \text{oracle}) \implies \text{output} = f(\text{input})
$$

This is often what people mean when they say that they are "formally verifying a zkVM". Note that it does not mean there exists a solution; a circuit with no solution is also deterministic. It does not mean that the solution is the expected behavior for the VM a circuit is representing. We will see how to state those properties next.

:::warning Security

- **Severity: CRITICAL** Someone can steal all the funds if it is possible to forge an incorrect transaction.
- **Discoverability: Formal verification only** Testing cannot find if there are other solutions to the equations, as the space of possible solutions is too large.

:::

## 🧮 Functional correctness

The functional correctness of a zkVM is the property that the output of the VM is the expected behavior for the VM that a circuit represents. Assuming we have a VM represented by a state transition function:

$$
  \mathcal{M} : \text{State} \to \text{State}
$$

with a deterministic circuit $\mathcal{C}$ for the function:

$$
  f : \text{Input} \to \text{Output}
$$

and conversion functions:

$$
  \begin{aligned}
    \varphi_{\text{Input}} &: \text{State} \to \text{Input} \\
    \varphi_{\text{Output}} &: \text{State} \to \text{Output} \\
  \end{aligned}
$$

We say that the circuit $\mathcal{C}$ is functionally correct if:

$$
  \forall\ \text{state}, \\
  f(\varphi_{\text{Input}}(\text{state})) = \varphi_{\text{Output}}(\mathcal{M}(\text{state}))
$$

that is to say that the functions $f$ and $\mathcal{M}$ are the same, up to the conversion functions $\varphi_{\text{Input}}$ and $\varphi_{\text{Output}}$.

:::warning Security

- **Severity: CRITICAL** If the functional correctness is not verified, it means that the VM is not behaving as expected, creating bugs in user applications expecting a certain behavior of the VM, like full EVM compatibility for example.
- **Discoverability: Testing can help** but formal verification is **necessary to cover all corner cases**, as people do when designing physical chips.

:::

## 🎄 Completeness

The completeness property says that for every input, there must exist an output solution.

Indeed, up to this point, we have said nothing about the existence of a solution, and a circuit without a solution is considered deterministic and functionally correct for any VM. We state this property as follows:

$$
  \forall\ \text{input}, \\
  \exists\ \text{output}, \text{oracle},\\
  \mathcal{C}(\text{input}, \text{output}, \text{oracle})
$$

This is generally the simplest property to verify, as it amounts to writing a function expressing a valid oracle value from the input, and to check that the function&nbsp;$f$ representing the output is indeed accepted by the set of equations of the circuit.

Another related security property is verifying that the code generating the execution trace for a circuit, that is to say, the solutions for the equations for a given VM execution, does succeed for any possible initial state of the VM. This is not critical as this code is not part of the circuit, so it can be updated and fixed if, for a given input, the generated trace does not fulfill the equations, although some transactions will be blocked in the meantime.

:::warning Security

- **Severity: HIGH** If the circuit is not complete, some transactions will be wrongly rejected, potentially blocking some smart contracts until a circuit upgrade, but no invalid transactions will be accepted.
- **Discoverability: Formal verification is efficient** so it is recommended, as here we are already starting from a solution and checking that it is valid.

:::

## ✒️ Conclusion

We have seen what we consider to be the three main properties to formally verify in a zkVM and ensure it is secure enough to hold user funds at scale. We recommend first starting with determinism, and then verifying the functional correctness and completeness.

Verifying a zkVM is necessary to appear as fully validated on [Ethproofs](https://ethproofs.org/), and we work hard to make sure it can be the case for everyone!

> You want to discuss security? Contact us! ⇨ [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
