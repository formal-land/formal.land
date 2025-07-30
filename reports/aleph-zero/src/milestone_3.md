# Milestone 3

> Finishing the Tool and the Smart Contract

This report details what we have done at [🌲 Formal Land](https://formal.land/) for the third milestone of the formal verification project for the [ink!](https://use.ink/) language of smart contracts for the [Aleph Zero](https://alephzero.org/) blockchain, developing the formal verification tool [coq-of-rust](https://github.com/formal-land/coq-of-rust).

The goal of this milestone is, to quote the grant agreement:

> The tool which works in 95% of cases. Amount of cases is counted by examples from the
> [Rust by Example](https://doc.rust-lang.org/rust-by-example/) book. The tool should be
> able to translate 95% of examples from the book. - Translate one smart contract mainly
> with the created tool. Finish translation manually if needed. Postulate statements for
> top-level functions of the translated contract. Prove 90% of statements. - One blog post
> with clarifications of ongoing work. - Report. **Duration 4 weeks**

In this step, we take the analysis work that we have done for the previous milestone, and implement it to have a more reliable translation from the Rust language to Coq. This translation now covers a big part of the language, and is able to translate most of the standard library of Rust without modifications, for example.

## Blog posts

We have written four blog posts explaining what we have done:

- [Improvements in the Rust translation to Coq, part 2](https://formal.land/blog/2024/03/08/improvements-rust-translation-part-2)
- [Improvements in the Rust translation to Coq, part 3](https://formal.land/blog/3024/03/08/improvements-rust-translation-part-3)
- [Monadic notation for the Rust translation](https://formal.land/blog/2024/04/03/monadic-notation-for-rust-translation)
- [Translation of the Rust's core and alloc crates](https://formal.land/blog/2024/04/26/translation-core-alloc-crates)

In these blog posts, we explain what we have done to make the translation from Rust to Coq of `coq-of-rust` smoother. In a summary:

- We removed the types from the translation, as well as the requirement on the ordering of the definitions.
- We added a better notation for the monadic code that we generate.
- We integrated the translation of large parts of the Rust's standard library.

Additionally, we presented the `coq-of-rust` project for the Ink! smart contracts in a lightning talk at the [Rust Verification Workshop 2024](https://sites.google.com/view/rustverify2024) co-located with the ETAPS conference.

## Changes to the translation

The new translation of `coq-of-rust` integrates the changes that we proposed in the previous milestone, which was about "analyzing what to improve". The goal is to be able to translate almost any Rust projects, with minimal or no modifications. Here is an example of input Rust code:

```rs
fn main() {
    println!("Hello World!");
}
```

We now translate it to:

```coq
Definition main (τ : list Ty.t) (α : list Value.t) : M :=
  match τ, α with
  | [], [] =>
    ltac:(M.monadic
      (M.read (|
        let _ :=
          let _ :=
            M.alloc (|
              M.call_closure (|
                M.get_function (| "std::io::stdio::_print", [] |),
                [
                  M.call_closure (|
                    M.get_associated_function (| Ty.path "core::fmt::Arguments", "new_const", [] |),
                    [
                      (* Unsize *)
                      M.pointer_coercion
                        (M.alloc (| Value.Array [ M.read (| M.mk_str "Hello World!
" |) ] |))
                    ]
                  |)
                ]
              |)
            |) in
          M.alloc (| Value.Tuple [] |) in
        M.alloc (| Value.Tuple [] |)
      |)))
  | _, _ => M.impossible
  end.
```

This translation is much more verbose, but also more reliable, than the translation that we used to have:

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

We now quickly detail the changes, that were also presented in the previous milestone report as ongoing work.

### Removal of the types

We now translate all the Rust values to a single Coq type `Value.t` representing all Rust values that we have encountered:

```coq
Module Value.
  Inductive t : Set :=
  | Bool : bool -> t
  | Integer : Z -> t
  | Float : string -> t
  | UnicodeChar : Z -> t
  | String : string -> t
  | Tuple : list t -> t
  | Array : list t -> t
  | StructRecord : string -> list (string * t) -> t
  | StructTuple : string -> list t -> t
  | Pointer : Pointer.t t -> t
  | Closure : {'(t, M) : Set * Set @ list t -> M} -> t
  | Error (message : string)
  | DeclaredButUndefined.
End Value.
```

Even if we then lose information in the translation process, this is actually helpful as:

- We have no type-checking errors anymore on the Coq side, as all values have the same type `Value.t`. The type inference mechanism of Coq was sometimes not working for some corner cases in the generated code, even when adding a lot of annotations. This was due, in particular, to the use of type-classes to represent traits.
- We can represent arbitrarily complex recursive types as we now inject all the values to a single `Value.t` type. Mutually recursive types are generally complex to represent in Coq.
- We do not need to order the definitions so that the types always appear before the values that use them. This was a big issue in the previous translation, as Rust does not require the definitions to be ordered. In addition, for some cases with interactions with traits combining methods and associated types, it was not even clear how to order the definitions.

### Removal of the trait constraints

We removed the trait constraints on the parameters of the functions. This was a big issue in the previous translation, as we did not achieve a trait translation reliable enough to handle big examples. We now put the trait constraints in the rules of our semantics to evaluate Rust expressions. When calling a trait method, we check that there is a trait instance for a marker of the type of the `self` value. If there is no trait instance, the evaluation is stuck. These code examples should, anyway, not be reachable, as the type checker of Rust verifies that trait constraints are satisfied.

We add back the trait constraints as pre-conditions in the proofs, making sure that we do not reason about code that gets stuck. We will not be able to make progress in the proofs if we forget about one of the constraints.

### No ordering of definitions

When we call a function, whether it is a trait method or a plain function, we now use a special construct of our monad that is purely descriptive. The call of a function is its absolute name as a string. We also bind each function definition to its absolute string name.

We cannot evaluate the calls to the functions anymore using the native Coq evaluation. Instead, we use the semantics rules on our monad to state that a function named by its unique string can be replaced by its definition.

### Translation of Rust's "Book By Examples"

We now translate all the examples of the book to valid Coq code, even if for some features, such inlined assembly code, we generate a dummy term.

## Changes to the proofs

All the changes above made the translation of the code simpler, but our proofs more complicated. We summarize here what changes it implied.

### Removal of the types

Removing the type information from the generated code is probably the main change that made the proofs more complex. We use injection functions to translate the Coq types that we use in our specifications or simulations (`bool`, `Z`, `string`, `list`, ...) to their corresponding `Value.t` values.

This makes the specification about the validity of the simulations (simplified implementation of the code that we use to make our proofs) more verbose. In addition, it can sometimes be hard in the proofs to remember from which "high-level" type a value comes from. We are still working on this issue to find better automation, even if this is currently manageable.

The main change that we necessary to keep the complexity low was in the representation of pointers. We now keep track in each pointer of the injection used to go from the high-level type to the `Value.t` type. Thanks to this tracking, we can reason on a memory only composed of high-level types instead of `Value.t` values.

### Removal of the trait constraints

We now need an additional pre-condition on lemma talking about functions with trait constraints for the types. This constraint says that a certain type implements a trait, together with a proof linking it to a Coq typeclass instance. We give more details in the last section [Traits](https://formal.land/blog/2024/03/22/improvements-rust-translation-part-3#traits) of one of our blog posts.

### No ordering of definitions

Each time there is a call to a function, an associated function for a type, or a trait method, we need to find at proof time which is the original definition. This is, for now, done manually by explicitly giving the Coq's name of the needed definition. We plan to automate this part as this is very repetitive, even if simple to do.

## Support of the standard library

Ink! smart contracts often make use of primitives from the standard library of Rust, like primitives to manipulate `Option` values. We were previously axiomatizing these primitives by hand in Coq. However, this is error-prone and time-consuming.

Instead, we are now able to leverage `coq-of-rust` to translate enough of the Rust standard library to use these definitions instead. This should represent less work for us in the long run, and we can be more confident that the definitions are correct.

We updated our current [verification of the ERC-20 smart contract](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/examples/default/examples/ink_contracts/proofs/erc20.v) to integrate all the changes above so that the specifications that we wrote are still verified.

## Conclusion

We have presented what we have implemented to improve the translation of `coq-of-rust` and make the tool much more reliable to translate Rust code to Coq without failing. We have also presented an update to our verification methodology to handle the new translation, as well as ported our verification of the ERC-20 smart contract to the new translation.

For the next milestone, we will verify four additional Ink! smart contracts using `coq-of-rust`, and continue to improve our proof methodology.
