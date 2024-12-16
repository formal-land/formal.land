# Milestone 2

We take the milestone description from the "milestone review" and complete it with our results for this milestone report. In all this document, we will use the pills:
* 🟢 for "done",
* 🟠 for "partially done",
* 🔴 for "not done".

Our results are for the `proto_alpha` version of the protocol in the branch `master`. Given the date of this document, this protocol version is close to the version `J` of the protocol. 

## Verification
### Storage system
> Verify the storage system: show a simulation with a simpler data structure made of records, sets, and maps.

We wrote a specification of the [storage.ml](https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/storage.ml) file in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/storage/ . This specification is composed of two parts:
* The definition of a simulation _state_ and _change_ types 🟢;
* An axiomatization that this simulation is equivalent to the various sub-stores defined in OCaml. This is axiomatized for now but should have been proven 🔴.

To prove that the store simulations are correct, we need to verify the storage functors defined in [storage_functors.ml](https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/storage_functors.ml). We wrote these proofs in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/storage_functors/ The functors are the followings:

* `Make_subcontext` 🟢
* `Make_single_data_storage` 🟠
* `Pair` 🟢
* `Make_data_set_storage` 🟠
* `Make_carbonated_data_set_storage` 🔴
* `Make_indexed_data_storage` 🟢
* `Make_indexed_carbonated_data_storage` 🟠
* `Make_indexed_data_snapshotable_storage` 🔴
* `Make_indexed_subcontext.Raw_context` 🟢
* `Make_indexed_subcontext.Make_set` 🟠
* `Make_indexed_subcontext.Make_map` 🟠
* `Make_indexed_subcontext.Make_carbonated_map` 🔴
* `Wrap_indexed_data_storage` 🔴

We also need to check that the sub-storages do not interfere with each other (so that we store the data at different sub-trees in the context). This is not done 🔴.

### `*_storage.ml` files
> Verify the [*_storage.ml files:] verify the high-level behavior of these functions and specify the invariants on the storage which these files expect.

For most of the files named `*_storage.ml` in the protocol, we wrote a specification of some of the functions together with corresponding proofs. In addition to validating parts of the code, we believe this also validates our approach to verify the storage interactions using a simulation. The proofs are in the following files:
* [bootstrap_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/bootstrap_storage/)
* [commitment_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/commitment_storage/)
* [constants_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/constants_storage/)
* [contract_manager_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/contract_manager_storage/)
* [contract_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/contract_storage/)
* [delegate_activation_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/delegate_activation_storage/)
* [delegate_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/delegate_storage/)
* [fees_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/fees_storage/)
* [frozen_deposits_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/frozen_deposits_storage/)
* [global_constants_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/global_constants_storage/)
* [level_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/level_storage/)
* [nonce_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/nonce_storage/)
* [sapling_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/sapling_storage/)
* [sc_rollup_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/sc_rollup_storage/)
* [seed_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/seed_storage/)
* [stake_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/stake_storage/)
* [ticket_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/ticket_storage/)
* [vote_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/vote_storage/)
* [voting_period_storage](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/voting_period_storage/)

There are still some properties that are axioms or using axioms because the storage system is not entirely specified. Thus we consider this verification effort to be between 🟠 and 🟢.

### Michelson interpreter
> Verify the Michelson interpreter, according to the semantics given in Mi-Cho-Coq.

We have done the following steps to verify the Michelson interpreter:
* The definition of a dependently-typed abstract syntax tree for Michelson in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/script_typed_ir 🟢
* The definition of a dependent-typed interpreter following the definition of the OCaml interpreter in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/script_interpreter 🟠
* A proof of equivalence between the dependent interpreter and the OCaml version (translated to Coq) in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/script_interpreter 🟠
* A proof of inclusion of the semantics on Mi-Cho-Coq into the dependently-typed interpreter in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/micho_to_dep 🟠 The proof is mainly for the individual instructions. What is missing are the control structures or some more complex instructions, primarily related to contract calls or set and map data structures.
* We found a few changes to make in Mi-Cho-Coq to keep the semantics similar to the one in OCaml, like the change in the order of parameters for one of the instructions (this instruction was not used in the verification of existing smart contracts).

### Michelson type-checker
> Verify the script translator, in particular for the compatibility of the parsing and unparsing operators.

To verify the Michelson type-checker in [script_ir_translator.ml](https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/script_ir_translator.ml), we have done the following steps:
* The definition of a dependently-typed version of the various `parse` and `unparse` functions in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/script_ir_translator/ 🟠
* A proof of equality between the dependently-typed functions and translated OCaml ones in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/script_ir_translator/ 🟠
* We have not done a proof that each kind of `parse` and `unparse` functions are inverses 🔴, although we had partial proofs for previous versions of the protocol that we need to update.

Among the difficulies we had with the type-checker are that:
* There were a lot of changes in the OCaml code requiring us to change our proofs, like the removal of the annotations. We did not anticipate this difficulty enough.
* The function definitions are large and slow to evaluate in Coq.

We hope to complete these proofs at some point, especially in the hope of having a proof for the pair's case of the parsing functions.

### Gas system
> Verify the gas system: check that the saturated arithmetic implementation is valid, and check that the expected computational complexity is coherent with the gas cost for important functions.

* We checked that the saturation arithmetic functions defined in [saturation_repr.ml](https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/saturation_repr.ml) are correct in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/saturation_repr For each primitive, we check that is it coherent to the equivalent version in `Z` when we stay in the bounds, and that the output is always in bounds 🟢.
* We also verified the existing property-based tests for the saturation arithmetic defined in [saturation_fuzzing.ml](https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/test/pbt/saturation_fuzzing.ml) with corresponding lemmas in https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt/saturation_repr These lemmas verify that the tests succeed for any possible inputs 🟢.
* We did not verify the complexity cost of functions using the gas 🔴.

## Link with the Tests
For the tests, we are working with four students of the Rug Nl University for a part-time internship to:
* translate the tests to Coq;
* verify that they are correct in the general case.

This is ongoing work that will last two more months with the students. The students are not being paid, and this is part of a class, so there is no need for funding.

> Better communicate with the OCaml developers and share code, therefore it is important to link the verification and testing effort.

* We made two small presentations are the tests meeting to present:
    * The test of side-effects with free-monads. That can make the integration tests more amenable to formal verification, in addition of being a clean solution to fake the inputs-outputs of a tested code.
    * The translation of property-based tests in Coq.
* We recently started a changelog file, accessible on https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/changelog/ to give better visibility to what we are doing. This was suggested by one of the developers (Mehdi Bouaziz) and has already helped us to have some good remarks.
* We wrote the following blog articles to advertise our work and published them on our [Twitter account](https://twitter.com/LandFoobar):
    1. [Integer arithmetic verification](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/02/08/integer-verification/)
    2. [Formalization of code in Coq - tactics](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/02/10/using-tactics/)
    3. [Simulations - dependently-typed version](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/02/26/simulations-dependently-typed-version/)
    4. [Some refactoring, some profiling and some optimization](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/03/28/profiling-refactoring-optimization/)
    5. [Verifying the compare functions of OCaml](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/04/04/verifying-the-compare-functions/)
    6. [Fuel - quiet escape from the halting problem](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/04/04/fuel/)

We think we need to do more presentations, especially at the proto-call 🟠.

> Translate the code in the test folder to Coq.
> Verify the generalized version of the OCaml tests. We want to make sure that there are no bugs related to properties that are already tested.
* We have translated and verified two test files by hand:
    * Saturation arithmetic: https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt/saturation_repr
    * Tez arithmetic: https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt/tez_repr
* We began to automate the translation with `coq-of-ocaml` of two test files in Coq:
    * Saturation arithmetic: https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt_generated/saturation_fuzzing
    * Sc rollup ticks: https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt_generated/test_sc_rollup_tick_repr

With our technique, we can only cover the tests in the `pbt/` folder of the [`test/` folder](https://gitlab.com/tezos/tezos/-/tree/master/src/proto_alpha/lib_protocol/test) of the protocol, and we verified only a few files. So we consider that we are between 🔴 and 🟠 for this task.

## Broader support of the Tezos code
> Make coq-of-ocaml usable as a library rather than as a configurable executable. This way, the recipient is able to customize the behavior of coq-of-ocaml depending on the kind of code.

We have not done this task 🔴.

> Translate and verify the data-encoding library. A challenge in verifying this library in Coq is that it contains optimized code using side-effects such as global references, exceptions, or mutable bytes buffers.

We have not done this task 🔴.

> Optimizing the execution of `coq-of-ocaml`. The translation of the protocol currently takes around one minute on a typical machine, this should be reduced ten fold in order to iterate more rapidly on the code.

We have made some optimizations decreasing the time to translate the protocol by two to three times 🟠.

## Deliverables
> A) Formally verify more critical parts of the code and reach a significant volume of verified code.

Since the last milestone (end of January 2022), we wrote around 20,000 lines of Coq proofs on the protocol. In addition to verifying properties for this milestone, we also verified utility functions (encoding, comparisons, ...). An example of such verification effort is the file [Indexable.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/indexable), where we verify the encodings, the comparisons, and the `Make` functor of the [indexable.ml](https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/indexable.ml) file of the protocol.

> B) Improve coq-of-ocaml , reducing the use of unsafe axioms and supporting more OCaml code. In addition to the protocol, we want to support the Tezos libraries and the shell.

We have made incremental changes to `coq-of-ocaml` to support the recently added code in the protocol. We continue to use unsafe axioms, for example to support the GADTs. We still support most of the protocol code. We do not yet support code in the shell or libraries. We are beginning to support the tests of the protocol. So this is between 🟠 and 🔴.

> C) Maintain the existing infrastructure, that is to say the translation pipeline from OCaml to Coq and the existing proofs on the protocol.

We have continued to maintain the translation of the protocol code to Coq, and the existing proofs. The code size increased by more than 50% since the beginning of the grant (four months ago), mainly due to the rollup projects, but we still translate most of the protocol code to Coq 🟢.

## Additional remarks
We have not found bugs in the OCaml code of the protocol.
