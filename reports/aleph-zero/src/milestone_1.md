# Milestone 1

Here, we detail what we have done at [Formal Land](https://formal.land/) for the first step of the project of formal verification for the [ink!](https://use.ink/) language of smart contracts for the [Aleph Zero](https://alephzero.org/) blockchain.

## Blog posts

We describe our work in the following blog posts that cover the main parts of our development efforts:

- [Trait representation in Coq](https://formal.land/blog/2023/08/25/trait-representation-in-coq) (2023-08-25)
- [Optimizing Rust translation to Coq with THIR and bundled traits](https://formal.land/blog/2023/11/08/rust-thir-and-bundled-traits) (2023-11-08)
- [Translation of function bodies from Rust to Coq](https://formal.land/blog/2023/11/26/rust-function-body) (2023-11-26)
- [Verifying an ERC-20 smart contract in Rust](https://formal.land/blog/2023/12/13/rust-verify-erc-20-smart-contract) (2023-12-13)
- [Translating Rust match patterns to Coq with coq-of-rust](https://formal.land/blog/2024/01/04/rust-translating-match) (2021-01-04)

## The `coq-of-rust` tool

We continued the development of our tool `coq-of-rust` (hosted on [github.com/formal-land/coq-of-rust](https://github.com/formal-land/coq-of-rust)) to verify Rust programs using the proof system Coq.

This tool automatically translates Rust programs to an equivalent program in the proof system Coq. Then, using the existing capabilities of Coq, we can formally specify and prove properties about Rust programs. We try to generate Coq programs that are as readable as possible so that the proofs are easy to write and understand. The generated programs are more verbose than the original ones, mainly because we make explicit in Coq some pointer manipulations that are left implicit in Rust.

We support enough of the Rust language so that most of the smart contracts from the integration test folder of Ink! [github.com/paritytech/ink/tree/master/integration-tests](https://github.com/formal-land/ink/tree/master/integration-tests) can be translated to Coq.

We successfully translated 80% of the examples from the [Rust by Example](https://doc.rust-lang.org/rust-by-example/) book to Coq files that type-check. We extracted these examples in individual Rust files in the folder [examples/rust_book/](https://github.com/formal-land/coq-of-rust/tree/main/examples/rust_book). The translation to Coq files is in [CoqOfRust/examples/default/examples/rust_book/](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/examples/default/examples/rust_book). The ones that type-check are those that are not in the [CoqOfRust/blacklist.txt](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/blacklist.txt) file.

Here are the main language features of Rust that we support:

- basic control structures (like&nbsp;`if` and&nbsp;`match`)
- loops (`while` and&nbsp;`for`)
- references and mutability (`&` and&nbsp;`&mut`)
- closures
- panics
- the definition of user types (with&nbsp;`struct` and&nbsp;`enum`)
- the definition of traits
- the implementation keyword&nbsp;`impl` for traits or user types

The code of&nbsp;`coq-of-rust` is around 8,000 lines of Rust long, excluding comments.

### Example

Here is a short example of Rust program, taken from the [Ink! examples](https://github.com/paritytech/ink/tree/master/integration-tests):

```rust
pub fn flip(&mut self) {
    self.value = !self.value;
}
```

The tool `coq-of-rust` translates this code to Coq as:

```coq
Definition flip (self : mut_ref Self) : M unit :=
  let* self := M.alloc self in
  let* _ : M.Val unit :=
    let* α0 : mut_ref flipper.Flipper.t := M.read self in
    let* α1 : mut_ref flipper.Flipper.t := M.read self in
    let* α2 : bool.t := M.read (deref α1).["value"] in
    assign (deref α0).["value"] (UnOp.not α2) in
  let* α0 : M.Val unit := M.alloc tt in
  M.read α0.
```

In this translated code, we explicit pointer manipulations on the variable&nbsp;`self`. We dereference&nbsp;`self` with&nbsp;`deref α0` (or&nbsp;`deref α1`) to access to its field&nbsp;`value`.

We allocate all the intermediate values with&nbsp;`M.alloc` to have an address to return in case the user uses the operator&nbsp;`&`. We remove some of these allocations when it is obvious that the address is never needed. At the end of the definition&nbsp;`flip`, we return the unit value noted&nbsp;`tt` in Coq.

### Usage

We can run&nbsp;`coq-of-rust` either on a single Rust file or on a whole Rust crate.

#### On a file

From the root folder of the&nbsp;`coq-of-rust` project you can run:

```sh
cargo run  --bin coq-of-rust -- translate --path my_file.rs
```

It will translate the single Rust file&nbsp;`my_file.rs` and generate a corresponding Coq file with an extension&nbsp;`.v`. We use this file-by-file mode to translate the Ink! smart contracts, which are generally all in a single file.

#### On a project

You can install&nbsp;`coq-of-rust` as a Cargo command with:

```sh
cargo install --path lib/
```

from the root folder of&nbsp;`coq-of-rust`. Then, in any Rust project, you can run:

```sh
cargo coq-of-rust
```

to generate a Coq translation of the whole current crate. Note that:

- If the project is already compiled the&nbsp;`coq-of-rust` command might not trigger. In this case, you can do&nbsp;`cargo clean; cargo coq-of-rust`.
- You need to use the exact same version of Rust as&nbsp;`coq-of-rust`. You can enforce it by copying the&nbsp;`rust-toolchain` file of&nbsp;`coq-of-rust` into your project.

### Standard library of Rust

To support the translation of Rust files to Coq, we needed to define or axiomatize parts of the Rust standard library in Coq. We have done that in the folder&nbsp;[CoqOfRust/](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust), mainly in the three sub-folders:

- [alloc/](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/alloc)
- [core/](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/core)
- [std/](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/std)

defining the corresponding parts of the standard library of Rust in Coq. These definitions are around 6,000 lines of Coq long, excluding comments.

## How `coq-of-rust` works

We detail in this section how our tool&nbsp;`coq-of-rust` works.

### Translation

We translate the Rust code by plugging in the Rust compiler's API. Thus, we re-use the parser and type-checker of `rustc` and are sure to support the Rust syntax correctly. Thanks to this API, we can also provide our tool as a `cargo` command.

We start the translation from the [THIR](https://rustc-dev-guide.rust-lang.org/thir.html) intermediate representation of the Rust compiler. This representation includes the syntax and the type-checking information. We have not used the [MIR](https://rustc-dev-guide.rust-lang.org/mir/index.html) representation, which is more low-level and explicit, as it is more verbose. The THIR representation has some weaknesses; for example, it does not include information about the lifetime of references. We do not use this information and translate the Rust code as if the borrow checker was disabled; we treat all references as mutable pointers.

We proceed into three steps:

1. We translate the THIR representation to our internal representation with exactly all the information we need to generate the Coq code.
2. We apply a [monadic transformation](https://xavierleroy.org/mpri/2-4/monads.pdf) on the whole program. The idea of the monad is to represent the side effects of Rust programs (memory allocations, panic errors, etc.) in the Coq language that is purely functional. We propagate the use of this monad to all sub-expressions, as most of the sub-expressions might have side effects.
3. We pretty-print the Coq code from our internal representation using the library&nbsp;[pretty](https://docs.rs/pretty/latest/pretty/). The goal is to have a readable Coq code as output, with a maximum width for the lines and indentation.

### Semantics

The generated Coq code is a shallow embedding of Rust in Coq, meaning that we re-use Coq keywords when we can. For example, we re-use the&nbsp;`let` syntax to bind names or the syntax to call functions to not re-implement a call stack for Rust.

For features that do not exist in Coq, mainly side-effects, we use a monad&nbsp;`M`. Its definition is the following (slightly simplified for the presentation):

```coq
Inductive M (A : Set) : Set :=
| Pure : A -> M A
| CallPrimitive {B : Set} : Primitive B -> (B -> M A) -> M A
| Cast {B1 B2 : Set} : B1 -> (B2 -> M A) -> M A
| Impossible : M A.
```

A monadic expression is either a `Pure` value, an `Impossible` branch for unreachable code, a dynamic `Cast` for typing we cannot represent in Coq in a simple way, or the call&nbsp;`CallPrimitive` to an effectful primitive.

This monad follows a style by continuation: except for the final constructors&nbsp;`Pure` and&nbsp;`Impossible`, we expect a continuation of type&nbsp;`B -> M A`. We define this monad with an inductive type rather than with function primitives so that this definition is purely descriptive. We will later give a semantics with inductive predicates.

The possible primitives are:

```coq
Inductive Primitive : Set -> Set :=
| StateAlloc {A : Set} : A -> Primitive (Ref.t A)
| StateRead {Address A : Set} : Address -> Primitive A
| StateWrite {Address A : Set} : Address -> A -> Primitive unit
| EnvRead {A : Set} : Primitive A.
```

We can alloc, read, and write a new variable in the memory. We have a special operation&nbsp;`EnvRead` to access special global values in the environment.

We then define the semantics of this monad with an inductive predicate with the following cases:

```coq
(* Return a pure value *)
| Pure :
  {{ env, state' | LowM.Pure result ⇓ result | state' }}

(* Dynamic cast, when two values actually have the same type *)
| Cast {B : Set} (state : State) (v : B) (k : B -> LowM A) :
  {{ env, state | k v ⇓ result | state' }} ->
  {{ env, state | LowM.Cast v k ⇓ result | state' }}

(* Read a value at an address in the memory *)
| CallPrimitiveStateRead
    (address : Address) (v : State.get_Set address)
    (state : State)
    (k : State.get_Set address -> LowM A) :
  State.read address state = Some v ->
  {{ env, state | k v ⇓ result | state' }} ->
  {{ env, state |
    LowM.CallPrimitive (Primitive.StateRead address) k ⇓ result
  | state' }}

(* Update a value in the memory *)
| CallPrimitiveStateWrite
    (address : Address) (v : State.get_Set address)
    (state state_inter : State)
    (k : unit -> LowM A) :
  State.alloc_write address state v = Some state_inter ->
  {{ env, state_inter | k tt ⇓ result | state' }} ->
  {{ env, state |
    LowM.CallPrimitive (Primitive.StateWrite address v) k ⇓ result
  | state' }}

(* Special allocation of an immediate value when we know a value will not be
   updated. In this case, we do not write in the global memory. *)
| CallPrimitiveStateAllocNone {B : Set}
    (state : State) (v : B)
    (k : Ref B -> LowM A) :
  {{ env, state | k (Ref.Imm v) ⇓ result | state' }} ->
  {{ env, state |
    LowM.CallPrimitive (Primitive.StateAlloc v) k ⇓ result
  | state' }}

(* Allocate a value in the memory and return a new address *)
| CallPrimitiveStateAllocSome
    (address : Address) (v : State.get_Set address)
    (state : State)
    (k : Ref (State.get_Set address) -> LowM A) :
  let r :=
    Ref.MutRef (A := State.get_Set address) (B := State.get_Set address)
      address (fun full_v => full_v) (fun v _full_v => v) in
  State.read address state = None ->
  State.alloc_write address state v = Some state' ->
  {{ env, state | k r ⇓ result | state' }} ->
  {{ env, state |
    LowM.CallPrimitive (Primitive.StateAlloc v) k ⇓ result
  | state' }}

(* Read a value from the environment *)
| CallPrimitiveEnvRead
    (state : State) (k : Env -> LowM A) :
  {{ env, state | k env ⇓ result | state' }} ->
  {{ env, state |
    LowM.CallPrimitive Primitive.EnvRead k ⇓ result
  | state' }}
```

The most important bit is that, to simplify the proof, one can choose at proof-time how to allocate the values and which values need to be allocated to be updated in order. In case of wrong allocations, we reach the&nbsp;`M.Impossible` case for which no semantics is defined. This case is ruled out when we specify a function, as a valid specification implies that there exists a way to evaluate the function until the end.

## Verification strategy

To verify Rust programs after translation to Coq, we use the following strategy:

1. We write a simplified simulation of the generated Coq code. The idea is to write a version of the code that will be more amenable to formal verification, by removing all the code related to memory allocations for example.
2. We show that this simulation is equivalent to the translated Rust code, using the semantics defined above.
3. We express and prove the properties we want over the simulation. At this point, we are essentially verifying a purely functional code. We still have to handle a lot of error cases, in case of integer overflows for example.

## Verification of the ERC-20 smart contract

We have verified the ERC-20 smart contract from the Ink! integration tests folder. We used the verification strategy stated above. The relevant files are:

- the source contract&nbsp;[erc20.rs](https://github.com/formal-land/coq-of-rust/blob/main/examples/ink_contracts/erc20.rs)
- the translated code&nbsp;[erc20.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/examples/default/examples/ink_contracts/erc20.v) (generated by&nbsp;`coq-of-rust`)
- the simulations&nbsp;[Simulations/erc20.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/examples/default/examples/ink_contracts/Simulations/erc20.v)
- the specifications and proofs&nbsp;[Proofs/erc20.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/examples/default/examples/ink_contracts/Proofs/erc20.v)

We now describe these files and detail the specifications we have verified.

### Source contract

We slightly modified this file compared to the original one in [erc20/lib.rs](https://github.com/formal-land/ink/blob/master/integration-tests/erc20/lib.rs). We made the following changes:

- We removed the macro attributes for Ink!.
- We added a mock definition for the parts of the Ink! library that it uses, so that the contract is a self-contained valid Rust file.
- We re-ordered the definitions, as Coq requires having all the definitions written in the order of dependencies, and `coq-of-rust` does not handle automatic ordering yet.

### Translated code

The translated code works as it is. We just replaced the mock definitions for the Ink! libraries (mainly the&nbsp;`Map` data structure) by actual definitions we use in the proofs.

### Simulations

We wrote a simulation in a functional style for each of the translated functions of the ERC-20 smart contract. We use a monad combining:

- a state for the state of the contract and the list of emitted events
- an error in case of panic (integer overflow)

The code for the simulations is very similar in size to the original code in Rust, without all the memory addresses (references) manipulations.

### Specifications and proofs

#### Equivalence of the simulations

First of all, we have verified that the simulations are equivalent to the translated code. We have done that using our definition of the semantics for the Rust monad. Most of these proof steps are automated or easy to do.

#### Messages

For the rest of the specifications, we first define what messages we can send to the contract to read or modify its state:

```coq
Module ReadMessage.
  (** The type parameter is the type of result of the call. *)
  Inductive t : Set -> Set :=
  | total_supply :
    t ltac:(erc20.Balance)
  | balance_of
    (owner : erc20.AccountId.t) :
    t ltac:(erc20.Balance)
  | allowance
    (owner : erc20.AccountId.t)
    (spender : erc20.AccountId.t) :
    t ltac:(erc20.Balance).
End ReadMessage.

Module WriteMessage.
  Inductive t : Set :=
  | transfer
    (to : erc20.AccountId.t)
    (value : ltac:(erc20.Balance)) :
    t
  | approve
    (spender : erc20.AccountId.t)
    (value : ltac:(erc20.Balance)) :
    t
  | transfer_from
    (from : erc20.AccountId.t)
    (to : erc20.AccountId.t)
    (value : ltac:(erc20.Balance)) :
    t.
End WriteMessage.
```

From these message types, we can express specifications covering all kinds of message interactions.

#### No panics on read messages

We show that the contract never panics when receiving a read message:

```coq
Lemma read_message_no_panic
    (env : erc20.Env.t)
    (message : ReadMessage.t ltac:(erc20.Balance))
    (storage : erc20.Erc20.t) :
  let state := State.of_storage storage in
  exists result,
  {{ Environment.of_env env, state |
    ReadMessage.dispatch message ⇓
    (* [inl] means success (no panics) *)
    inl result
  | state }}.
```

Note that there can be panics on write messages, in case of integer overflow, for example.

#### Invariants

With the following definition:

```coq
Definition sum_of_money (storage : erc20.Erc20.t) : Z :=
  Lib.Mapping.sum Integer.to_Z storage.(erc20.Erc20.balances).

Module Valid.
  Definition t (storage : erc20.Erc20.t) : Prop :=
    Integer.to_Z storage.(erc20.Erc20.total_supply) =
    sum_of_money storage.
End Valid.
```

we express that the state of the contract is valid when its&nbsp;`total_supply` field is equal to the sum of all the&nbsp;`balances` of the accounts. We show that for any write messages, if the initial state is valid and the contract call is successful, then the final state is valid too.

#### The total supply is constant

We verify that the field&nbsp;`total_supply` is constant, meaning that we cannot create or destroy tokens. We express this property as:

```coq
Lemma write_dispatch_is_constant
    (env : erc20.Env.t)
    (storage : erc20.Erc20.t)
    (write_message : WriteMessage.t) :
  let state := State.of_storage storage in
  let '(result, (storage', _)) :=
    WriteMessage.simulation_dispatch env write_message (storage, []) in
  match result with
  | inl _ =>
    storage.(erc20.Erc20.total_supply) =
    storage'.(erc20.Erc20.total_supply)
  | _ => True
  end.
```

stating that for any&nbsp;`write_message`, if the contract call succeeds (no panic), then the&nbsp;`total_supply` field is constant:

```coq
storage.(erc20.Erc20.total_supply) =
storage'.(erc20.Erc20.total_supply)
```

where&nbsp;`storage` is the state of the contract before the call, and&nbsp;`storage'` is the state after the call.

#### Action from the logs

Here we express what information a user can extract from the logs of the contract. We define an action as a function from the storage to a set of new possible storages:

```coq
Module Action.
  Definition t : Type := erc20.Erc20.t -> erc20.Erc20.t -> Prop.
End Action.
```

We define what action we can infer from an event emitted by the contract:

```coq
Definition action_of_event (event : erc20.Event.t) : Action.t :=
  fun storage storage' =>
  match event with
  | erc20.Event.Transfer (erc20.Transfer.Build_t
      (option.Option.Some from)
      (option.Option.Some to)
      value
    ) =>
    (* In case of transfer event, we do not know how the allowances are
       updated. *)
    exists allowances',
    storage' =
    storage <|
      erc20.Erc20.balances := balances_of_transfer storage from to value
    |> <|
      erc20.Erc20.allowances := allowances'
    |>
  | erc20.Event.Transfer (erc20.Transfer.Build_t _ _ _) => False
  | erc20.Event.Approval (erc20.Approval.Build_t owner spender value) =>
    storage' =
    storage <|
      erc20.Erc20.allowances :=
        Lib.Mapping.insert (owner, spender) value
          storage.(erc20.Erc20.allowances)
    |>
  end.
```

and show that for any write message, the actions implied by the logs of the contract correspond to the effect of the write message on the contract's state.

#### Approve is only on the caller

Our last verified specification says that we can only modify our own allowances using the function&nbps;`approve`:

```coq
Lemma approve_only_changes_owner_allowance
    (env : erc20.Env.t)
    (storage : erc20.Erc20.t)
    (spender : erc20.AccountId.t)
    (value : ltac:(erc20.Balance)) :
  let '(result, (storage', _)) :=
    Simulations.erc20.approve env spender value (storage, []) in
  match result with
  | inl (result.Result.Ok tt) =>
    forall owner spender,
    Integer.to_Z (Simulations.erc20.allowance storage' owner spender) <>
      Integer.to_Z (Simulations.erc20.allowance storage owner spender) ->
    owner = Simulations.erc20.Env.caller env
  | _ => True
  end.
```

## Translation of the other contracts

We aimed to translate 80% of the smart contracts from the integration test folder of Ink! to Coq. We have done that with the translated contracts in the folder&nbsp;[examples/ink_contracts](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/examples/default/examples/ink_contracts) (the Coq&nbsp;`.v` files).

Here is the list of contracts that are in the integration test folder of Ink! and the ones we have translated:

- `basic-contract-caller` ✅
- `call-runtime` ✅
- `conditional-compilation` ✅
- `contract-terminate` ✅
- `contract-transfer` ✅
- `custom-allocator` ✅
- `custom-environment` ✅
- `dns` ✅
- `e2e-call-runtime` ✅
- `erc1155` ✅
- `erc20` ✅
- `erc721` 🟠
- `flipper` ✅
- `incrementer` ✅
- `lang-err-integration-tests/call-builder-delegate` ✅
- `lang-err-integration-tests/call-builder` ✅
- `lang-err-integration-tests/constructors-return-value` ✅
- `lang-err-integration-tests/contract-ref` ✅
- `lang-err-integration-tests/integration-flipper` ✅
- `mapping-integration-tests` ✅
- `mother` ✅
- `multi-contract-caller` ❌
- `multisig` 🟠
- `payment-channel` ✅
- `psp22-extension` ❌
- `rand-extension` ❌
- `set-code-hash` ✅
- `set-code-hash/updated-incrementer` ✅
- `trait-dyn-cross-contract-calls` ❌
- `trait-erc20` ✅
- `trait-flipper` ✅
- `trait-incrementer` ✅
- `wildcard-selector` ✅

For the contracts in&nbsp;🟠 (`erc721` and&nbsp;`multisig`) we have axiomatized some of the functions that we do not translate yet with our custom attrite&nbsp;`coq_axiom`. We believe we can translate these functions after further updates to&nbsp;`coq-of-rust`.

For all the contracts, we have done some manual changes as for&nbsp;`erc20.rs`:

- re-ordering the definitions
- removing the macro attributes for Ink!
- adding a mock definition for the parts of the Ink! library that are used

We plan to automate these steps for the next steps of the project.

## Limitations

The main limitation we see with our tool right now is that we do not take into account the special macros from the Ink! language. These are thus part of the [trusted computing base](https://en.wikipedia.org/wiki/Trusted_computing_base). We tried to translate the code generated by these macros, as well as the implementation of the Ink! standard library, but we cannot yet handle this kind of code (too long and too complex, especially regarding the use of the traits).

## Conclusion

The tool&nbsp;`coq-of-rust` that we developed successfully translates realistic Ink! smart contracts to the proof system Coq, such as the&nbsp;`erc-20` and&nbsp;`erc-1155` smart contracts. In addition, we have shown that it is possible to formally specify and prove properties about these contracts in Coq, as we illustrated with the&nbsp;`erc-20` smart contract.

Next, we hope to improve the tool&nbsp;`coq-of-rust` to better automate the translation of Ink! contracts and support some Rust features that we are missing. We also plan to formally verify other smart contracts that are in the integration test folder of Ink!.
