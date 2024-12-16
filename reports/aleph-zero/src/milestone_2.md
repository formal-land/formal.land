# Milestone 2

This report details what we have done at [🌲 Formal Land](https://formal.land/) for the second milestone of the formal verification project for the [ink!](https://use.ink/) language of smart contracts for the [Aleph Zero](https://alephzero.org/) blockchain, developing the formal verification tool [coq-of-rust](https://github.com/formal-land/coq-of-rust).

The goal of this milestone is, quoting the grant agreement:

> During this step, we will analyze the results of our work and the ways to move forward.

So this is mainly a step where we analyze the current limitations of our tool, and start providing solutions.

## Blog posts

We have written one blog post explaining part of the work we are doing to improve the support of the Rust language in `coq-of-rust`:

- [Improvements in the Rust translation to Coq, part 1](https://formal.land/blog/2024/02/29/improvements-rust-translation)

In this blog post, we present small improvements we made to `coq-of-rust` to support, for example, pattern matching on tuples with holes. We also present how we plan to increase the amount of code we can translate from Rust to Coq by designing a single type `Value.t` to which we collapse all Rust types, and by removing the trait constraints in the generated code.

## Analysis of our work

The tool `coq-of-rust` that we made to formally verify Rust programs works by translating Rust programs to the proof system Coq. It supports enough of the Rust language to translate small smart contracts such as the [ERC-20 example in ink!](https://github.com/paritytech/ink/blob/master/integration-tests/erc20/lib.rs) or 80% of the code snippets from the [Rust by Example book](https://doc.rust-lang.org/rust-by-example/). But for larger examples, we still need to do a lot of manual modifications, and some Rust features are not or are very hard to support.

The main issues we have are:

1. **The ordering of definitions.** The Coq definitions must be in their order of dependencies, but in Rust, they can be in any order, and people are generally not ordering these definitions. There can even be some mutual dependencies sometimes that are very hard to represent in Coq.
2. **The inference of trait instances.** We re-use the typeclasses mechanism of Coq to infer the trait instances in the Coq translation, as typeclasses and traits are very similar. However, even when trying various changes in our translation, there are always cases where the inference on the Coq side fails. We also have issues with associated types in traits, as well as traits with a large number of elements or dependencies due to a non-linear compilation time in Coq.
3. **The verbosity of the monadic translation.** We make the side effects explicit in the translated Coq code (mainly mutations and panics), but this also makes the code much more verbose. In particular, we have to define a new variable for each sub-expression.

Here is what we have online to address these issues or explain how we want to address them:

- A solution for points 1. and 2. is explained in our blog post [Improvements in the Rust translation to Coq, part 1](https://formal.land/blog/2024/02/29/improvements-rust-translation). This is currently the object of the pull request [coq-of-rust#472](https://github.com/formal-land/coq-of-rust/pull/472).
- We have an ongoing pull request [coq-of-rust#469](https://github.com/formal-land/coq-of-rust/pull/469) to improve the notation for monadic expression using a Coq tactic.

We will now present in more details how we are planning to fix these issues.

## Ordering of definitions

Errors from the ordering of definitions can happen anytime a function, a method, or a type is referenced in a file before being defined. This is not an error in Rust, so many crates are defined in an order incompatible with the Coq order. For now, we propose to either:

- modify the original Rust code to follow the Coq ordering of definition, or
- use a special configuration file that makes explicit the order of definitions that we want in the generated Coq code.

Both of these solutions are manual and do not apply in some cases with mutual dependencies. Instead, what we plan to do is to make each reference to another definition lazy so that we can separate:

1. referencing another definition,
2. using the content of that definition (which requires Coq to already have access to that definition).

We can add special primitives in our monad to reference another definition in the following cases:

- top-level function (or constant),
- associated function (methods defined with the `impl` keyword),
- trait methods (methods defined with the `impl ... for` keyword).

We can use these primitives at any point in the generated code, even if the definition is not yet there. It is only when we define the semantics of the code that we can unfold the actual definitions. This is not a problem as we define the semantics using our simulation predicate `Run.t`, whish is defined in [CoqOfRust/Proofs/M.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/Proofs/M.v) and has access to all the definitions since it is built during proof time.

## Inference of trait instances

Another change we are beginning to do is to remove the type information in the generated code:

- We remove the trait constraints (the `where` clauses in Rust) in the generated code.
- We use a single `Value.t` type to represent all Rust values in the generated code, collapsing all the types into a single one. We still generate the types as values of type `Ty.t`, which we provide as parameters to polymorphic functions. The types are useful in order to decide which trait instance to use.

This should simplify a lot of cases where the error on the Coq side is due to type inference errors. These should not occur anymore as we would have only one type `Value.t`.

By removing the trait constraints, we should also simplify the type checking in Coq and break some mutual dependencies between traits and function definitions. The idea is to add back these constraints at proof time, and block the evaluation when a trait instance is used but not provided. Providing the trait instances at proof time is safe to do as, thanks to the Rust type checker, we know that there is only a single possible instance for a given trait type `Self` and type parameters.

We provide the traits type parameters when calling methods by having a type `Ty.t` representing all the Rust types in a way that can disambiguate them. Typically, each type is defined by its unique global name. For example, if one makes a type definition like:

```rust
mod foo {
    pub struct Bar {
        pub x: u32,
        pub y: u32,
    }
}
```

in a crate `crate`, the type `crate::foo::Bar` will be represented in `Ty.t` with `Ty.path "crate.foo.Bar"`. We also have primitives to combine the types, for example:

```coq
Ty.tuple [Ty.path "u32"; Ty.path "u32"]
```

for the type `(u32, u32)`. We introduce type aliases as equations. For example, we translate:

```rust
type Point = (u32, u32);
```

as:

```coq
Axiom Point : Ty.path "crate::Point" = Ty.tuple [Ty.path "u32"; Ty.path "u32"].
```

The definition of the type `Ty.t` is opaque, and in the proofs, we only try to prove equalities over elements of `Ty.t` in order to find the right trait instances. Values of type `Ty.t` can also be parts of trait instances in order to track the use of associated types.

## Monadic notation

We have to make a [monadic translation](https://xavierleroy.org/mpri/2-4/monads.pdf) of all Rust sub-expressions as most of them might have side effects, mainly a memory mutation, allocation, or panic. This makes the generated code much more verbose than the original Rust code. For example, the "Hello World!" program in Rust:

```rust
fn main() {
    // Statements here are executed when the compiled binary is called

    // Print text to the console
    println!("Hello World!");
}
```

is currently translated to:

```coq
Definition main : M unit :=
  let* _ : M.Val unit :=
    let* _ : M.Val unit :=
      let* α0 : ref str.t := M.read (mk_str "Hello World!
") in
      let* α1 : M.Val (array (ref str.t)) := M.alloc [ α0 ] in
      let* α2 : core.fmt.Arguments.t :=
        M.call
          (core.fmt.Arguments.t::["new_const"]
            (pointer_coercion "Unsize" (borrow α1))) in
      let* α3 : unit := M.call (std.io.stdio._print α2) in
      M.alloc α3 in
    M.alloc tt in
  let* α0 : M.Val unit := M.alloc tt in
  M.read α0.
```

with a lot of intermediate variables `α0`, `α1`, `α2`, `α3` that are not present in the original code. They are introduced by the monadic translation to name the result of all sub-expressions but clutter the generated code. Using a Coq tactic that we are finalizing, we generate the following code:

```coq
Definition main : M unit :=
  ltac:(M.monadic ((
    let _ : unit :=
      let _ : M.Val unit :=
        M.alloc (|
          M.call (|(std.io.stdio._print
            (M.call (|(core.fmt.Arguments.t::["new_const"]
              (pointer_coercion
                "Unsize"
                (borrow
                  (M.alloc (| [ M.read (| mk_str "Hello World!
" |) ] |)))))
            |)))
          |)
        |) in
      M.alloc (| tt |) in
    tt
  ) : unit)).
```

The monadic translation is done in the tactic&nbsp;`M.monadic`. The result should be more similar to the original source code, by nesting sub-expressions instead of naming intermediate results.

## Conclusion

We have presented the main limitations of `coq-of-rust`, the formal verification tool that we are developing to verify `ink!` smart contracts, and how we are planning to fix them.

Next month, we will finish implementing the required changes with the target of translating 95% of the examples of the [Rust by Example](https://doc.rust-lang.org/rust-by-example/) book.