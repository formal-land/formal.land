---
id: introduction
title: 🐫 coq-of-ocaml
---

import Link from '@docusaurus/Link';

:::note

This project was funded by the French Government&nbsp;🇫🇷 and the [Tezos Foundation](https://tezos.foundation/).

:::

[**coq-of-ocaml**](https://github.com/formal-land/coq-of-ocaml) is a **formal verification** tool with **interactive theorem proving&nbsp;💫** for the **[🐫&nbsp;OCaml](https://ocaml.org/) programming language**.

[**coq-of-ocaml**](https://github.com/formal-land/coq-of-ocaml) is a transpiler from the OCaml programming language to the [🐓&nbsp;Coq](https://coq.inria.fr/) proof language. It allows **formal verification** on OCaml programs. We developed it for the [Tezos](https://tezos.com/) crypto-currency, verifying more that 100K lines of OCaml code in [Coq Tezos of OCaml&nbsp;💫](https://formal-land.gitlab.io/coq-tezos-of-ocaml/). The sources are on [Github](https://github.com/formal-land/coq-of-ocaml).

`coq-of-ocaml` generates idiomatic and human readable Coq code. Technically speaking, this is a [shallow embedding](https://cstheory.stackexchange.com/questions/1370/shallow-versus-deep-embeddings) of OCaml into Coq. We supports the purely functional parts of OCaml, including advanced features such as functors, first-class modules, and GADTs. Side-effects in an OCaml program can be translated when represented by a monad.

:::tip Services

We apply `coq-of-ocaml` to **formally verify your 🐫&nbsp;OCaml programs** for **&#36;10 per line of verified code** (excluding comments). Formal verification with interactive theorem provers provides the highest level of security so it would be a big miss not to use it. This is the only way to ensure full protection even against state-level actors&nbsp;🦸.

<Link
  className="button button--secondary button--lg custom-not-underlined"
  href="mailto:&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;"
>
  <span>🦸&nbsp;Contact us!&nbsp;&nbsp;&nbsp; <small>&#36;10/loc</small></span>
</Link>
<br /><br />
We always verify the first 100 lines for free&nbsp;🎁.

:::

## Example

`coq-of-ocaml` translates the OCaml code:

```ocaml
type 'a tree =
  | Leaf of 'a
  | Node of 'a tree * 'a tree

let rec sum tree =
  match tree with
  | Leaf n -> n
  | Node (tree1, tree2) -> sum tree1 + sum tree2
```

to the Coq code:

```coq
(* Generated by coq-of-ocaml *)
Inductive tree (a : Set) : Set :=
| Leaf : a -> tree a
| Node : tree a -> tree a -> tree a.

Arguments Leaf {_}.
Arguments Node {_}.

Fixpoint sum (tree : tree int) : int :=
  match tree with
  | Leaf n => n
  | Node tree1 tree2 => Z.add (sum tree1) (sum tree2)
  end.
```

We map the algebraic datatype `tree` to an equivalent inductive type `tree` in Coq. With the `Arguments` command, we ask Coq to be able to infer the type parameter `a`, as it is done in OCaml. We translate the recursive function `sum` using the command `Fixpoint` of Coq. Here, we represent the `int` type of OCaml by `Z` in Coq, but this can be parametrized.

## Workflow

`coq-of-ocaml` works by compiling the OCaml files one by one. Thanks to Merlin, we get access to the typing environment of each file. Thus names referencing external definitions are properly interpreted.

In a typical project, we may want to translate some of the `.ml` files and keep the rest as axioms (for the libraries or non-critical files). To generate the axioms, we can run `coq-of-ocaml` on the `.mli` files for the parts we want to abstract. When something is not properly handled, `coq-of-ocaml` generates an error message. These errors do not necessarily need to be fixed. However, they are good warnings to help having a more extensive and reliable Coq formalization.

Generally, the generated Coq code for a project does not compile as it is. This can be due to unsupported OCaml features, or various small errors such as name collisions. In this case, you can:

- modify the OCaml input code, so that it fits what `coq-of-ocaml` handles or avoids Coq errors (follow the error messages);
- use the [attributes](options/attributes) or [configuration](options/configuration) mechanism to customize the translation of `coq-of-ocaml`;
- fork `coq-of-ocaml` to modify the code translation;
- post-process the output with a script;
- post-process the output by hand.

## Concepts

We can import to Coq the OCaml programs which are either purely functional or whose side-effects are in a [monad](https://caml.inria.fr/pub/docs/manual-ocaml/bindingops.html). We translate the primitive side-effects (references, exceptions, ...) to axioms. We have no proofs that we preserve the semantics of the source code. One should do manual reviews to assert that the generated Coq code is a correct formalization of the source code. We produce a dummy Coq term and an explicit message in case of error. In particular, we always generate something and no errors are fatal.

We compile OCaml projects by pluging into the [LSP](https://microsoft.github.io/language-server-protocol/) of OCaml [Merlin](https://github.com/ocaml/merlin). This means that if you are using Merlin then you can run `coq-of-ocaml` with no additional configurations.

We do not do special treatments for the termination of fixpoints. If needed, you can disable termination checks using the Coq's flag [Guard Checking](https://coq.inria.fr/refman/proof-engine/vernacular-commands.html#coq:flag.Guard-Checking). We erase the type parameters for the [GADTs](https://ocaml.org/manual/gadts.html). This makes sure that the type definitions are accepted, but can make the pattern matchings incomplete. In this case we offer the possibility to introduce dynamic casts guided by annotations in the OCaml code. We did not find a way to nicely represent GADTs in Coq yet. We think that this is hard because the dependent pattern matching works well on type indicies which are values, but does not with types.

We support modules, module types, functors and first-class modules. For OCaml modules, we generate either Coq modules or polymorphic records depending on the case. We generate axioms for `.mli` files to help formalizations, but importing `.mli` files should not be necessary for a project to compile in Coq.

## Related

In the OCaml community:

- [Cameleer](https://github.com/mariojppereira/cameleer) (verify OCaml programs leveraging the [Why3](http://why3.lri.fr/)'s infrastructure)
- [CFML](http://chargueraud.org/softs/cfml/) (import OCaml to Coq using characteristic formulae)
- [coq-of-ocaml-mrmr1993](https://github.com/mrmr1993/coq-of-ocaml) (fork of `coq-of-ocaml` including side-effects, focusing on the compilation of the OCaml's stdlib)

In the JavaScript community:

- [coq-of-js](https://github.com/clarus/coq-of-js) (sister project; _currently on halt to support `coq-of-ocaml`_)

In the Haskell community:

- [hs-to-coq](https://github.com/antalsz/hs-to-coq) (import Haskell to Coq)
- [hs-to-gallina](https://github.com/gdijkstra/hs-to-gallina) (2012, by Gabe Dijkstra, first known project to do a shallow embedding of a mainstream functional programming language to Coq)

In the Go community;

- [goose](https://github.com/tchajed/goose) (import Go to Coq)

In the Rust community:

- [electrolysis](https://github.com/Kha/electrolysis) (import Rust to Lean)

## Credits

The `coq-of-ocaml` project started as part of a PhD directed by [Yann Regis-Gianas](https://yrg.gitlab.io/homepage/) and [Hugo Herbelin
](http://pauillac.inria.fr/~herbelin/) as the university of [Paris 7](https://u-paris.fr/). Originally, the goal was to formalize real OCaml programs in Coq to study side-effects inference and proof techniques on functional programs. This project was then financed by [Nomadic Labs](https://www.nomadic-labs.com/) and then the [Tezos Foundation](https://tezos.foundation/), with the aim to be able to reason about the implementation of the crypto-currency [Tezos](https://tezos.com/). See this [blog post](http://coq-blog.clarus.me/beginning-of-verification-for-the-parsing-of-smart-contracts.html) to get an example about what we can prove.
