---
title: 🌲 What we do at Formal Land
tags: [security, formal verification, interactive theorem proving, Rust, Solidity]
authors: []
---

In this blog post, we present what we do at Formal Land&nbsp;🌲, what tools and services we are developing to provide more security for our customers&nbsp;🦸. We believe that for critical applications such as blockchains (L1, L2, dApps) you should always **use the most advanced technologies to find bugs, otherwise bad actors will do** and overtake you in the never-ending race for security&nbsp;🏎️.

**Formal verification** is one of the best techniques to ensure that your code is correct, as it **checks every possible input&nbsp;✨** of your program. For a long, formal verification was reserved for specific fields, such as the space industry&nbsp;🧑‍🚀. We are making this technology accessible for the blockchain industry and general programming thanks to tools and services we develop, like [coq-of-solidity](https://github.com/formal-land/rocq-of-solidity) and [coq-of-rust](https://github.com/formal-land/coq-of-rust).

<!-- truncate -->

:::success Get started

To ensure your code is secure today, contact us at&nbsp;[&nbsp;📧&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

Formal verification goes further than traditional audits to make 100% sure you cannot lose your funds. It can be integrated into your CI pipeline to make sure that every commit is correct without running a full audit again.

We make bugs such as the [DAO hack](https://www.gemini.com/fr-fr/cryptopedia/the-dao-hack-makerdao) ($60 million stolen) virtually impossible to happen again.

:::

<figure>
  ![Forge in forest](2024-10-13/forge.webp)
</figure>

## Company

We have existed for **three years**, focusing on formal verification for the web3 industry to validate software&nbsp;🛡️ where safety is of paramount importance. **Formal verification** is a technique to analyze the code of a program, which relies on making a **mathematical proof that the code is correct**, proof that is furthermore checked by a computer&nbsp;🤓 to make sure there are absolutely no missing cases! As programs are made of 0 and 1 and fully deterministic, obtaining perfect programs is something we can reach.

We need to rely on a proof system. We exclusively use the [🐓&nbsp;Coq](https://coq.inria.fr/) proof system as it is both:

- **🌌&nbsp;A generic proof system** We can represent any programming languages and security properties in Coq.
- **💕&nbsp;A well known system** Coq is taught in many universities and has a large community of users, with complex software such as the C compiler [CompCert](https://en.wikipedia.org/wiki/CompCert) fully implemented and verified in it.

We choose to verify **existing&nbsp;🗿** code rather than to develop new code written in a style simplifying formal verification. This is generally harder, but it is also more useful for many of our customers who have already written code and want to ensure it is correct without rewriting it. Verifying the existing code also enables the verification of the optimizations, which generally involve low-level operations that would be forbidden when rewriting the code in a formal verification language.

We verify the actual **🌍&nbsp;implementation** of programs rather than a **🗺️&nbsp;model** of them. This is to capture all the implementation details, such as integer overflows or the use of specific data structures or libraries. We believe that a lot of bugs are hidden in the details (the devil is in the details), in addition to the high-level bugs of design. Verifying the implementation also helps to **follow code updates&nbsp;🪜** as we are able to say that we verified the code for a precise commit hash.

## Tools

### 🐫&nbsp;coq-of-ocaml

The tool [coq-of-ocaml](https://github.com/formal-land/coq-of-ocaml) was our first product to analyze [🐫&nbsp;OCaml](https://ocaml.org/) programs by translating the code to Coq. The translation is almost one-to-one in terms of size, for a verification work simplified at a maximum. It was initially developed as part of a PhD at [Inria](https://inria.fr/) and then at the [&nbsp;Nomadic Labs](https://www.nomadic-labs.com/) company.

We use it to verify properties of the code of the Layer 1 of [Tezos](https://tezos.com/) with the project [Coq Tezos of OCaml](https://formal-land.gitlab.io/coq-tezos-of-ocaml/). We analyzed a code base of more than 100,000 lines of OCaml code, for which we made a full and automatic translation to the proof system Coq that can be maintained as the code evolves. We verified various properties, including:

- The compatibility of the serialization/deserialization functions.
- The adequacy of the smart contract interpreter with the existing smart contract semantics.
- The preservation of various invariants on the data structures.

Many more properties are yet to be verified, but the project is currently on hold. You can have more information by looking at the [project blog](https://formal-land.gitlab.io/coq-tezos-of-ocaml/blog)!

### 🦀&nbsp;coq-of-rust

Our second project is [coq-of-rust](https://github.com/formal-land/coq-of-rust) to verify Rust programs. Rust is an interesting target as more and more programs are getting written in it, especially for projects where the security is critical. Even if Rust offers a strong type system, with memory safe programs by design, there are still many bugs that can happen, like logical bugs or code making a panic (sudden stop of the program) in production due to an out-of-bound access in an array.

The project `coq-of-rust` was funded by [Aleph Zero](https://alephzero.org/) to verify the code of their smart contracts.

We achieve to translate most Rust programs to the Coq proof system, including the `core` library&nbsp;🎉, which is the standard library of Rust. To our knowledge, we are the only ones who have achieved such a translation of the standard library. The generated Coq code is about ten times the size of the initial Rust code. This is quite verbose and related in particular to:

- the expansion of macros,
- the expansion of referencing/dereferencing operations that are often implicit in the source code,
- the expansion of `match` patterns to primitive patterns.

We have a semantics for the translated code, and are working on reasoning principles to show that this translated code is equivalent to a much simpler version (simulations) on which to reason.

As an example, here is the Coq translation of one of the functions of the [revm](https://github.com/bluealloy/revm), a Rust implementation of the Ethereum Virtual Machine:

```rust
(*
pub fn add<H: Host + ?Sized>(interpreter: &mut Interpreter, _host: &mut H) {
    gas!(interpreter, gas::VERYLOW);
    pop_top!(interpreter, op1, op2);
    *op2 = op1.wrapping_add( *op2);
}
*)
Definition add (ε : list Value.t) (τ : list Ty.t) (α : list Value.t) : M :=
  match ε, τ, α with
  | [], [ H ], [ interpreter; _host ] =>
    ltac:(M.monadic
      (let interpreter := M.alloc (| interpreter |) in
      let _host := M.alloc (| _host |) in
      M.catch_return (|
        ltac:(M.monadic
          (M.read (|
            let~ _ :=
              M.match_operator (|
                M.alloc (| Value.Tuple [] |),
                [
                  fun γ =>
                    ltac:(M.monadic
                      (let γ :=
                        M.use
                          (M.alloc (|
                            UnOp.not (|
                              M.call_closure (|
                                M.get_associated_function (|
                                  Ty.path "revm_interpreter::gas::Gas",
                                  "record_cost",
                                  []
                                |),
                                [
                                  M.SubPointer.get_struct_record_field (|
                                    M.read (| interpreter |),
                                    "revm_interpreter::interpreter::Interpreter",
                                    "gas"
                                  |);
                                  M.read (|
                                    M.get_constant (|
                                      "revm_interpreter::gas::constants::VERYLOW"
                                    |)
                                  |)
                                ]
                              |)
                            |)
                          |)) in
                      let _ :=
                        M.is_constant_or_break_match (| M.read (| γ |), Value.Bool true |) in
                      (* ... more code ... *)
```

### 🪁&nbsp;coq-of-solidity

Last but not least, the tool [coq-of-solidity](https://github.com/formal-land/rocq-of-solidity) to translate [Solidity](https://soliditylang.org/) smart contracts to Coq. We use the Yul intermediate language of the Solidity compiler to do our translation, with roughly a three times size increase in the translated code.

We support most of the Solidity instructions, passing 90% of tests of the Solidity compiler. We recently developed a new translation mode that can represent arbitrary Solidity code, or Yul written by hand, in a nice monad, even in case of complex control flow like nested loops with `break` and `continue` instructions and variable mutations. This is done thanks to our new effect inference engine in `coq-of-solidity` to always give a purely functional representation of imperative code.

Compared to other formal analysis tools for Solidity, the strength is to be able to **verify arbitrary complex properties**. This is crucial for the verification of cryptographic operations (**elliptic curve** implementations, **zero-knowledge verifiers** linking the L1 to the L2s, ...) that are out of reach of standard verification tools. For example, we are currently verifying a [hand-optimized Yul implementation](https://github.com/get-smooth/crypto-lib/blob/main/src/elliptic/SCL_mulmuladdX_fullgen_b4.sol) of elliptic curve operations.

## Conclusion

We have seen what we are proposing at Formal Land to enhance the security of your applications to the best possible level&nbsp;🌟, with security of mathematical certainty. Next time, we will see how to use the Coq proof system to verify simple properties by following the [Coq in a Hurry](https://cel.hal.science/inria-00001173v6/file/coq-hurry.pdf) tutorial&nbsp;🚀.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land), or comment on this post below! Feel free to DM us for any services you need._

:::
