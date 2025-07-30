# Milestone 1

Here we quickly describe what we have completed for the first milestone of this grant.

* Verification: significantly increase the coverage of the proofs in the protocol code:
  * Verify the `*_hash.ml` files: short files with very few properties to verify.
  * Verify the `*_repr.ml` files: check the definitions of data-encodings.
  * Verify the `*_services.ml` files: check the encodings in the RPCs.
* Translation: add annotations on the Ocaml sources or improve the way `coq-of-ocaml` translates the code in order for some of the files to translate to Coq. Due to various changes in the protocol, some of the files are currently not translating to Coq. The main difficulty in these files is that they include a lot of pattern-matching on GADTs.
  * Translate the Michelson interpreter `script_interpreter.ml` (around 2,000 OCaml lines).
  * Translate the Michelson translator `script_ir_translator.ml` (around 6,000 OCaml lines).
