---
title: 🦄 Short introduction to Rocq
tags: [Rocq, formal verification, introduction]
authors: []
---

In this blog post, we present a short introduction to [Rocq](https://rocq-prover.org/), a formal verification system, as a summary of the guide [Rocq in a Hurry](https://cel.hal.science/inria-00001173v6/document) from [Yves Bertot](https://www-sop.inria.fr/members/Yves.Bertot/research.html) of the Rocq team.

Rocq is the formal system that we use exclusively, but other interactive theorem provers work the same way. From this introduction, you can get a sense of how the verification of mathematical statements or security properties of programs works.

<!-- truncate -->

<figure>
  ![Green forest](2025-08-11/forest.png)
</figure>

## 🧩 Definitions

There are propositions for logical formulas, which can be `True`, `False`, `/\` (and), `\/` (or), `->` (implies), `~` (not), using quantifiers `forall` and `exists`, and operators like `=` for equality. These can be proven to be correct. There are expressions like `3 * x` that can be computed. We can define these as in a purely functional programming language.

Basic data types for computations are booleans (not to be confused with propositions, on which you cannot compute), natural numbers defined as being either `0` or `n + 1` for some other `n` a natural number, and lists which are either `[]` or `x :: l` like in many functional languages. You can define functions on those data types by pattern-matching (`match` operator) with recursive calls restricted to sub-elements of the patterns, to make sure all functions terminate.

Here is an example of a recursive function combining booleans, natural numbers, and lists:

```coq
Fixpoint insert n l :=
  match l with
  | [] => n :: []
  | a :: tl =>
    if n <=? a then
      n :: l
    else
      a :: insert n tl
  end.
```

## 📝 Proofs

For propositions, like `forall (n : nat), n < n + 1`, the goal is to find a proof of it, as we cannot simply evaluate a proposition to know if it is true or false. To write the proof, we use the interactive mode of Rocq, where we will step through the proof to construct it while being checked as correct. There are also automation primitives to go faster, but we will not see them here.

An example of proposition to verify is the commutativity of the "and" operator `/\`:

```coq
forall (A B : Prop), A /\ B -> B /\ A
```

In proof mode, we see what the hypotheses are and what the goal is, separated by a horizontal bar. Originally, the whole proposition is the goal, and there are no hypotheses. Then with `intros` command, we move everything we can (in the `forall` or before the `->`) to the hypotheses:

```coq
A, B : Prop
H : A /\ B

----

B /\ A
```

Now the goal is `B /\ A`. We can use `split` to split the goal into two, first `B` and then `A`:

```coq
A, B : Prop
H : A /\ B

---- (1/2)

B
```

To solve the first goal, we can use `destruct H` to split `H` it into two hypotheses `H1` and `H2`. We obtain:

```coq
A, B : Prop
H1 : A
H2 : B

---- (1/2)

B
```

Now we have in the hypotheses exactly what we want to prove, that is to say, `B`. We can now conclude the proof with `apply H2`, and do similarly for the other goal `A`. We have completed our first formal proof!

For all the propositional operators, there is a command to use them when they are in a hypothesis, and a command to build them when they are in the goal. The most frequent commands, also named tactics, are: `intros`, `apply`, `split`, `destruct`, `rewrite`, `exists`, `reflexivity`, `unfold`. As an exercise, you can try to prove the commutativity of the "or" operator `\/`.

Proofs are generally organized into a lot of sub-steps called lemmas. These are intermediate properties used to prove the main goal. This is similar to how we would split a large function into smaller ones to better organize a program. The standard library or other packages provide a lot of lemmas. You can find them using the `Search` command.

## 🧮 Reasoning on expressions

To reason on propositions over expressions, and in particular programs, we can use the same tactics. The `destruct` tactic enables reasoning by cases. For example, on booleans this means reasoning on the two cases `false` and `true` to verify that a property is correct for any boolean. On infinite data structures, like natural numbers, we reason by induction using the tactic `induction`. For a given `n`, a natural number in the hypotheses, it will generate two sub-goals, one with `n` replaced by `0`, and one with `n` replaced by `n + 1`, assuming an additional hypothesis which is the goal assumed correct for `n`. An example of property is that the length of the concatenation of two lists is the sum of the lengths of the two lists, for any possible lists.

We can compose the reasoning by cases, yielding an arbitrary number of sub-goals. In practice, we will often get stuck in the wrong direction, like we would be stuck on paper, probably even more so than on paper.

The reasoning by induction works on arbitrary infinite data structures. For example, on lists it generates a sub-goal for the empty list, and one for the list `x :: l`, assuming an additional hypothesis which is the goal assumed correct for `l`.

We can define new data types with several constructors together with potential parameters, and the possibility to reference itself in the parameters of the constructors. This is similar to the definition of `enum` in Rust. For example, for binary trees with empty leaves:

```coq
Inductive bin : Set :=
| Leaf : bin
| Node : bin -> bin -> bin.
```

It is then possible to define functions by pattern-matching and recursing on this new data type, like we were doing on natural numbers or lists, as well as prove properties by induction.

There are additional common data types. An important one is `Z` which represents unbounded integers in binary encoding. It is more efficient than `nat` for computations that use an unary encoding, but sometimes less convenient for proofs.

Finally, we can also define new propositions using the `Inductive` keyword to define complex and recursive propositions. This is, for example, useful when defining the execution rules of programming languages.

## ✒️ Conclusion

We have seen a quick introduction to understand to state and formally verify properties in a system like Rocq. In practice, to formally verify the security of a program, we will wrap these primitives in automation layers, and connect the definitions to the actual source code with translation tools such as [coq-of-rust](https://github.com/formal-land/coq-of-rust).

> You want to secure your code? Contact us! ⇨ [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
