---
id: introduction
title: What is coq-of-rust
---

[**coq-of-rust**](https://github.com/formal-land/coq-of-rust) is a transpiler from the [🦀&nbsp;Rust](https://www.rust-lang.org/) programming language to the [🐓&nbsp;Coq](https://coq.inria.fr/) proof language. It allows **formal verification** on Rust programs. The sources are on [Github](https://github.com/formal-land/coq-of-rust).

`coq-of-rust` generates a [shallow embedding](https://cstheory.stackexchange.com/questions/1370/shallow-versus-deep-embeddings) of Rust into Coq. We run the translation from the [THIR](https://rustc-dev-guide.rust-lang.org/thir.html) level of the Rust compiler. The generated Coq code is more verbose than the source Rust as we explicit all the low-level details, such as the sequencing of effects or the implicit borrowing/dereferencing.

:::tip Purchase

If you want to formally verify Rust programs, contact us at&nbsp;[&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!

:::

## Example

`coq-of-rust` translates the Rust code:

```rust
fn balance_of(&self, owner: AccountId) -> Balance {
    self.balance_of_impl(&owner)
}
```

to the Coq code:

```coq
(* Generated by coq-of-rust *)
Definition balance_of
    (self : ref ltac:(Self))
    (owner : erc20.AccountId.t)
    : M ltac:(erc20.Balance) :=
  let* self : M.Val (ref ltac:(Self)) := M.alloc self in
  let* owner : M.Val erc20.AccountId.t := M.alloc owner in
  let* α0 : ref erc20.Erc20.t := M.read self in
  erc20.Erc20.t::["balance_of_impl"] α0 (borrow owner).
```

## Workflow

To formally verify a Rust project using `coq-of-rust` we work as follows:

1. translate the Rust code to Coq using `coq-of-rust`
2. define the memory of the program (how the values will be allocated)
3. write simulation functions for each function of the Rust code, to give a simpler and more functional definition of the code
4. verify that these simulations are equivalent to the source code
5. prove properties over these simulations

As some of the work is very verbose and repetitive, such as the definition of the simulation functions, we make a heavy use of LLM tools such as [Github Copilot](https://github.com/features/copilot).