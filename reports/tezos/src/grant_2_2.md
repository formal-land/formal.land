# Milestone 2

In this report, we summarize the work we have done in July and August 2022. Thanks for the reading of the report, and the opportunity given to us to work on the verification of Tezos.

Here are some general remarks on our code:
* We have all our developments in the Git repository [https://gitlab.com/formal-land/coq-tezos-of-ocaml](https://gitlab.com/formal-land/coq-tezos-of-ocaml) with its associated website [https://formal-land.gitlab.io/coq-tezos-of-ocaml/](https://formal-land.gitlab.io/coq-tezos-of-ocaml/), as well as some proofs in [https://gitlab.com/formal-land/json-data-encoding](https://gitlab.com/formal-land/json-data-encoding) for the `json-data-encoding` library. 
* The website presents a better view of the proofs, with hyperlinks to access the definitions. It also includes a blog and a [Guides](https://formal-land.gitlab.io/coq-tezos-of-ocaml/docs/guides/translation-of-the-protocol) section with a higher-level presentation of the repository.
* What we name `Proto_alpha` is actually the protocol version J. We kept this name to preserve the links, but are planning to change it once we have a proper translation of the development version alpha of the protocol.
* Instead of making a comparison for the backward compatibility between the protocol version J and alpha (as claimed in the grant proposal), we are making a comparison of versions J and K. This is because the version K was released by the time of the end of this grant.
* The branch from which we translate the folders of the protocols version J and K of Tezos is in [this merge request](https://gitlab.com/formal-land/tezos/-/merge_requests/7). It includes some changes so that the translated code compiles in Coq.

## Skip-list data structure
We verified the validity of the skip-list data structure in [https://gitlab.com/formal-land/coq-tezos-of-ocaml/-/blob/master/src/Proto_K/Proofs/Skip_list_repr.v](https://gitlab.com/formal-land/coq-tezos-of-ocaml/-/blob/master/src/Proto_K/Proofs/Skip_list_repr.v) Our final proof is in the lemma `back_path_is_valid`. We verify that when the `back_path` primitive returns some value `path` then this path is considered as correct for the function `valid_back_path`. 

For our proof of the validity of the `back_path` function, we added a few hypotheses regarding the way we handle the pointers on the client side of the algorithm. For example, we assume that the cells are all created by a `genesis` or `next` operation. To verify the usage of the back-path data structure, we will need to check these hypotheses where the back-path functions are used. We believe these hypotheses to be reasonable and necessary. The whole validity statement is the following:

```coq
Lemma back_path_is_valid `{FArgs} {content_type ptr_type : Set}
    (equal_ptr : ptr_type → ptr_type → bool)
    (cell_ptr target_ptr : ptr_type)
    (target_cell : cell content_type ptr_type) (path : list ptr_type)
    (deref : ptr_type → option (cell content_type ptr_type)) (fuel : nat)
    (cell_index_spec : Helper_valid.Cell_Index.Valid.t deref)
    (path_valid : ∀ p x,
                    In p path → deref p = Some x → Cell.Valid.t x)
    (array_len_valid :
       ∀ cptr cval,
         In cptr path →
         deref cptr = Some cval →
           Z.of_nat (Datatypes.length cval.(cell.back_pointers).(t.items))
           < Pervasives.max_int) :
    Compare.Equal.Valid.t (fun _ ⇒ True) equal_ptr →
    deref target_ptr = Some target_cell →
    let target_index := index_value target_cell in
    back_path deref cell_ptr target_index = Some path →
    valid_back_path equal_ptr deref cell_ptr target_ptr path = true.
```

We do not verify the `back_path_is_uniq` property that states that the path validated by the boolean function `valid_back_path` is unique. This property was also claimed in the grant proposal.

## Backward compatibility
We verify the backward compatibility over the Michelson interpreter between the versions J and K of the protocol. We put all these developments into the folder [`src/Proto_K_alpha`](https://gitlab.com/formal-land/coq-tezos-of-ocaml/-/tree/master/src/Proto_K_alpha), following our naming where we use `alpha` for the protocol J.

We organize our development into several files. In the `src/Proto_K_alpha` and `src/Proto_K_alpha/Simulations` folders we put the migrations of the datatypes defined in the corresponding files in `src/Proto_alpha`. A migration is a function from a datatype defined in the old protocol to the new one. For example, for the mutez values:

```coq
Module Old := TezosOfOCaml.Proto_alpha.Tez_repr.
Module New := TezosOfOCaml.Proto_K.Tez_repr.

(** Migrate [Tez_repr.t]. *)
Definition migrate (x : Old.t) : New.t :=
  match x with
  | Old.Tez_tag n => New.Tez_tag n
  end.
```

we map the old constructor `Tez_tag` to the new one. We also have such a migration function for the abstract syntax tree of Michelson.

In the folder `src/Proto_K_alpha/Proofs` we add the proofs of backward compatibility of various functions of the protocol. The main file is [`src/Proto_K_alpha/Proofs/Script_interpreter.v`](https://gitlab.com/formal-land/coq-tezos-of-ocaml/-/blob/master/src/Proto_K_alpha/Proofs/Script_interpreter.v) where we state the backward compatibility of the interpreter:

```coq
Error.migrate_monad (Old.dep_step fuel (ctxt, sc) gas i_value ks accu_stack)
  (fun '(output, ctxt, gas) => (
    Script_typed_ir.With_family.migrate_stack_value output,
    Local_gas_counter.migrate_outdated_context ctxt,
    Local_gas_counter.migrate_local_gas_counter gas
  )) =
New.dep_step
  fuel
  (
    Local_gas_counter.migrate_outdated_context ctxt,
    Script_typed_ir.migrate_step_constants sc
  )
  (Local_gas_counter.migrate_local_gas_counter gas)
  (Script_typed_ir.With_family.migrate_kinstr i_value)
  (Script_typed_ir.With_family.migrate_continuation ks)
  (Script_typed_ir.With_family.migrate_stack_value accu_stack)
```

We say that the two following computations give the same result:
* taking the `dep_step` function from the protocol J, running it on an instruction `i_value` and a stack `accu_value`, and applying the migration function on the results;
* taking the `dep_step` function from the protocol K, and running it on the migrations of an instruction `i_value` and a stack `accu_stack`.

At the time of writing, we have verified the backward compatibility of the interpreter on 80% of the instructions. We did not verify the backward compatibility of the parser and type-checker of Michelson. In order to simplify the proofs, we axiomatize that the gas cost is the same for the two protocols. We check that both the success and the error cases of the interpreter are the same for the protocols J and K.

We write our proofs on a dependently typed implementation of the interpreter that we name `dep_step` in the file [src/Proto_K/Simulations/Script_interpreter.v](https://gitlab.com/formal-land/coq-tezos-of-ocaml/-/blob/master/src/Proto_K/Simulations/Script_interpreter.v) instead of the usual `step` function from [src/Proto_K/Script_interpreter.v](https://gitlab.com/formal-land/coq-tezos-of-ocaml/-/blob/master/src/Proto_K/Script_interpreter.v). We do so to simplify the reasoning on the code that is originally written using GADTs in OCaml.

For the two protocols J and K, we have a complete definition of a dependent abstract syntax tree, an almost complete definition of the interpreter, and the definition for most of the `script_ir_translator.ml` file. To these dependent definitions, we attach proofs of equivalence between the dependent implementation and the original translated code. The translated code from OCaml contains `cast` axioms to implement the `match` on GADT values. We mostly verified the equivalence for the interpreter and some parts of the `script_ir_translator.ml` file.

Most of our time was allocated to writing or verifying these dependent implementations for both protocols J and K. A good optimization in our work would be to automatically generate these dependent implementations from the OCaml code.

## Absence of internal errors
We did not have time to do more than our [initial reports](https://gitlab.com/formal-land/coq-tezos-of-ocaml/-/tree/master/src/Reports) classifying the errors in the Tezos protocol (submitted for the previous half of the grant). With the dependent implementation that we write for Michelson, we verify the absence of `assert false`, exceptions and non-termination effect for all the parts of the code for which we have a dependent version. For the absence of `assert false` or exceptions, at a meta-level, our proof relies on the fact that:
* we axiomatize the `assert` or exception operators;
* unless we ignore these values, if they appear in a reachable branch of the translated OCaml code then it would not be able to prove our dependent purely functional implementation equal to the translated code.

We are aware that we did not achieve to do what we planned for the verification of the absence of internal errors.

## JSON data encoding
Additionally, we worked on the verification of the [JSON data-encoding](https://gitlab.com/nomadic-labs/json-data-encoding) library used in the protocol for serialization. We verified the implementation of the optimized version of `List.map` given in [src/list_map.ml](https://gitlab.com/nomadic-labs/json-data-encoding/-/blob/master/src/list_map.ml) in the file [coq-src/proofs/List_map.v](https://gitlab.com/formal-land/json-data-encoding/-/blob/master/coq-src/proofs/List_map.v) of our fork of the project.

We also began the translation to Coq of the other files of this project. However, we faced some difficulties including:
* The use of polymorphic variants; for that we refactored the code to avoid using polymorphic variants.
* A missing definition of the standard library of OCaml in Coq. We have started to complete these definitions in [this pull request](https://github.com/formal-land/coq-of-ocaml/pull/221).

## Communication
We published two blog posts:
* [Fixing reused proofs](https://formal-land.gitlab.io/coq-tezos-of-ocaml/blog/2022/07/19/fixing-proofs) to explain how we typically proceed to port and fix proofs for a version of the protocol to another. In particular, we had to do this work from the protocol version J to K, and complete the proofs for the verification of new data-encodings for example.
* [Verifying json-data-encoding](https://formal-land.gitlab.io/coq-tezos-of-ocaml/blog/2022/08/15/verify-json-data-encoding/) to explain the work we did on the [JSON data-encoding](https://gitlab.com/nomadic-labs/json-data-encoding) library, in particular to translate parts of the code to Coq and verify the optimized [List.map](https://gitlab.com/nomadic-labs/json-data-encoding/-/blob/master/src/list_map.ml) implementation.
