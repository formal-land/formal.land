---
title: Upgrade the Rust version of coq-of-rust
tags: [coq-of-rust, Rust, Coq, Aleph-Zero]
authors: []
---

We continue our work on the [coq-of-rust](https://github.com/formal-land/coq-of-rust) tool to formally verify Rust programs with the [Coq proof assistant](https://coq.inria.fr/). We have upgraded the Rust version that we support, simplified the translation of the traits, and are adding better support for the standard library of Rust.

Overall, we are now able to translate **about 80%** of the Rust examples from the [Rust by Example](https://doc.rust-lang.org/stable/rust-by-example/) book into valid Coq files. This means we support a large subset of the Rust language.

<!-- truncate -->

:::tip Purchase

To formally verify your Rust codebase and improve the security of your application, email us at&nbsp;[&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)! Formal verification is the only way to prevent all bugs by exploring all possible executions of your programs&nbsp;🎯.

:::

:::info Thanks

This work and the development of [coq-of-rust](https://github.com/formal-land/coq-of-rust) is made possible thanks to the [Aleph Zero](https://alephzero.org/)'s Foundation, to develop an extra safe platform to build decentralized applications with formally verified smart contracts.

:::

![Rust rooster](2024-01-18/rooster.png)

## Upgrade of the Rust version

The tool&nbsp;`coq-of-rust` is tied to a particular version of the Rust compiler that we use to parse and type-check a `cargo` project. We now support the&nbsp;`nightly-2023-12-15` version of Rust, up from&nbsp;`nightly-2023-04-30`. Most of the changes were minor, but it is good to handle these regularly to have smooth upgrades. The corresponding pull request is [coq-of-rust/pull/445](https://github.com/formal-land/coq-of-rust/pull/445). We also got more [Clippy](https://github.com/rust-lang/rust-clippy) warnings thanks to the new version of Rust.

## Simplify the translation of traits

The traits of Rust are similar to the [type-classes of Coq](https://coq.inria.fr/refman/addendum/type-classes.html). This is how we translate traits to Coq.

But there are a lot of subtle differences between the two languages. The type-class inference mechanism of Coq does not work all the time on generated Rust code, even when adding a lot of code annotations. We think that the only reliable way to translate Rust traits would be to explicit the implementations inferred by the Rust compiler, but the Rust compiler currently throws away this information.

Instead, our new solution is to use a Coq tactic:

```coq
(** Try first to infer the trait instance, and if unsuccessful, delegate it at
    proof time. *)
Ltac get_method method :=
  exact (M.pure (method _)) ||
  exact (M.get_method method).
```

that first tries to infer the trait instance for a particular method, and if it fails, delegates its definition to the user at proof time. This is a bit unsafe, as a user could provide invalid instances at proof time, by giving some custom instance definitions instead of the ones generated by&nbsp;`coq-of-rust`. So, one should be careful to only apply generated instances to fill the hole made by this tactic in case of failure. We believe this to be a reasonable assumption that we could enforce someday if needed.

We are also starting to remove the trait constraints on polymorphic functions (the&nbsp;`where` clauses). We start by doing it in our manual definition of the standard library of Rust. The rationale is that we can provide the actual trait instances at proof time by having the right hypothesis replicating the constraints of the&nbsp;`where` clauses. Having fewer&nbsp;`where` clauses reduces the complexity of the type inference of Coq on the generated code. There are still some cases that we need to clarify, for example, the handling of [associated types](https://doc.rust-lang.org/rust-by-example/generics/assoc_items/types.html) in the absence of traits.

## Handling more of the standard library

We have a definition of the standard library of Rust, mainly composed of axiomatized[^1] definitions, in these three folders:

- [CoqOfRust/alloc](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/alloc)
- [CoqOfRust/core](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/core)
- [CoqOfRust/std](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/std)

By adding more of these axioms, as well as with some small changes to the&nbsp;`coq-of-rust` tool, we are now able to successfully translate around 80% of the examples of the [Rust by Example](https://doc.rust-lang.org/stable/rust-by-example/) book. There can still be some challenges on larger programs, but this showcases the good support of&nbsp;`coq-of-rust` for the Rust language.

## Conclusion

We are continuing to improve our tool&nbsp;`coq-of-rust` to support more of the Rust language and are making good progress. If you need to improve the security of critical applications written in Rust, contact us at&nbsp;[&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to start formally verifying your code!

[^1]: An axiom in Coq is either a theorem whose proof is admitted, or a function/constant definition left for latter. This is the equivalent in Rust of the&nbsp;`todo!` macro.