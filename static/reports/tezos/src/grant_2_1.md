# Milestone 1

Here we present what we have completed for the first milestone of this grant.

## Skip-lists
We have already specified what the skip-lists data structure should do in [Skip_list_repr.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/skip_list_repr). Without condidering the properties that were trivial, we verified:
- [x] `S.Valid.equal` the fact that the equality check of two skip-lists is valid;
- [x] `S.Valid.encoding` the fact that the data-encoding function on skip-lists is valid

We missed the verification of the following two properties (the most important ones):
- [ ] `S.Valid.back_path_is_valid` the fact that the check of a path generated by `back_path` always returns `true`;
- [ ] `S.Valid.back_path_is_uniq` the fact that the path generated by `back_path` is indeed minimal.

We plan to complete the proofs of the skip-lists for the second milestone of the grant, but this was not completed for this first milestone.

## Carbonated maps
We have already specified what the carbonated maps should do. We verified all of these specifications in [Carbonated_map.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/carbonated_map). We verify that:
* the carbonated maps behave as normal maps, up to the gas cost calculation;
* the size of the maps is correctly pre-calculated.

## Classification of errors
We have classified all the errors appearing in the protocol in the following three reports:
* [Asserts](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/reports/asserts/)
* [Errors](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/reports/errors/)
* [Exceptions](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/reports/exceptions/)

In the file [Error.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/proofs/error) we give a predicate to specify what are the internal errors for the extensible `error` type. Our plan to verify the exceptions and asserts is to write proven equal definitions without using exceptions or assertions. We already have many of such simulations for the interpreter and translator of Michelson in the files:
* [Simulations/Script_interpreter.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/script_interpreter)
* [Simulations/Script_ir_translator.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/script_ir_translator)

## Translation of the protocol J
We have a full translation of the protocol J available in https://gitlab.com/nomadic-labs/coq-tezos-of-ocaml/-/tree/master/src/Proto_alpha and browsable online starting from [Alpha_context.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/alpha_context).

We have done this translation running `coq-of-ocaml` on our fork https://gitlab.com/clarus1/tezos/-/commits/guillaume-claret@proto_alpha-coq-of-ocaml-proto-j that include some changes added in our fork, mainly to make it compile once translated to Coq. The only functions for which we use the [`@coq_axiom_with_reason`](https://formal.land/docs/coq-of-ocaml/attributes#coq_axiom_with_reason) attribute of `coq-of-ocaml` (disabling the translation and replacing the corresponding definition by an axiom) are the followings:
* [`Script_interpreter.log`](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/script_interpreter#log) because we ignore the logging feature of Michelson in our formalization of the interpreter. Indeed, this feature is only used in debug mode and would accidentally complexify a lot our dependent type definitions for Michelson.
* [`Script_interpreter.klog`](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/script_interpreter#klog) Disabled for the same reasons as `log`.
* The top-level initialization calls in [Storage_functors.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/storage_functors/) with code such as `let () = ...` The reasons are that:
    * These code elements are only doing side-effects so cannot study them in Coq as it is;
    * These code examples are creating a stack-overflow error in Coq for an unknown reason.

In addition to the translation of the Tezos code using `coq-of-ocaml`, we spent a lot of time writing simulations for the Michelson interpreter. These are proven-equivalent definitions using dependent types instead of GADTs. The issue with definitions with GADTs in our Coq translation is that they use dynamic cast axioms in the `match`, what makes the proofs on them more complex in our experience. Our main files with simulations are the followings:
* [Script_typed_ir.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/script_typed_ir) with a dependently-typed definition of the abstract syntax tree of Michelson;
* [Script_interpreter.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/script_interpreter) with a dependently-typed definition of the interpreter (the case for the instruction `IView` is missing);
* [Script_ir_translator.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/simulations/script_ir_translator) with simulations for some of the functions of the [translator.ml](https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/script_ir_translator.ml) file of the protocol of Tezos.

## Additional proofs
We have continued to maintain our existing proofs and verified most of the compare functions as presented on this page: [Status compare](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/status/compare/). We have also continued our verification effort on the property-based tests. We have a Coq translation and at least a part of the proofs for the following test files:
* [Saturation_fuzzing.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt/saturation_fuzzing)
* [Test_bitset.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt/test_bitset)
* [Test_carbonated_map.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt/test_carbonated_map)
* [Test_sc_rollup_tick_repr.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt/test_sc_rollup_tick_repr)
* [Test_tez_repr.v](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/docs/tests/pbt/test_tez_repr)

## Communication
Our communication was mainly in the form of blog posts. We published the following posts:
* [Handling fold_left in proofs](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/05/21/fold-left/)
* [Plan for backward compatibility verification](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/06/02/plan-backward-compatibility/)
* [Formal verification of property based tests](https://nomadic-labs.gitlab.io/coq-tezos-of-ocaml/blog/2022/06/07/formal-verification-of-property-based-tests/)
* [Status update on the verification of Tezos](https://formal.land/blog/2022/06/15/status%20update-tezos)
* [Upgrade coq-of-ocaml to OCaml 4.14](https://formal.land/blog/2022/06/23/upgrade-coq-of-ocaml-4.14)
