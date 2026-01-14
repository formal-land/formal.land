---
id: rocq-of-llzk
title: rocq-of-llzk
---

:::info

This is a tool to translate the [LLZK](https://github.com/Veridise/llzk-lib) universal zero-knowledge circuit language to the [Rocq](https://rocq-prover.org/) formal verification language, to be used together with our [🌱&nbsp;Garden](https://github.com/formal-land/garden) framework to formally verify the security of such circuits.

:::

## Source code

This tool, open source, is composed of:

- A pull request [🐓 Translation of LLZK to Rocq](https://github.com/formal-land/llzk-lib/pull/1) with an added LLZK compilation pass to emit the Rocq code corresponding to a `.llzk` file.
- A set of semantic and reasoning rules in Rocq, together with examples, in the folder [🌱 Garden/Garden/LLZK](https://github.com/formal-land/garden/tree/main/Garden/LLZK) of the Garden project.

## Documentation

There are three blog posts presenting the project:

- [🥷 Beginning of a formal verification tool for LLZK](/blog/2025/07/28/llzk-to-rocq-beginning)
- [🥷 Semantics for LLZK in Rocq](/blog/2025/07/30/llzk-to-rocq-semantics)
- [🥷 Formal verification of LLZK circuits in Rocq](/blog/2025/07/31/llzk-to-rocq-verification)

To translate an LLZK file to Rocq, Git checkout the C++ code of [our pull request](https://github.com/formal-land/llzk-lib/pull/1) with our fork of the LLZK library and compile it following the standard instructions of the LLZK project. It will typically conclude with:

```sh
cd build/
cmake --build .
```

Then, from the `build/` folder, run:

```sh
./bin/llzk-opt ../test/my_llzk_file.llzk --llzk-rocq-pass
```

It will pretty-print on the standard output the Rocq translation of the file. For now, the translation can be slow as there are some inefficiencies in the way we compute variable names from the MLIR API.

You can save the generated Rocq file as `my_llzk_file.v` in the `Garden/LLZK/` folder of the [🌱&nbsp;Garden](https://github.com/formal-land/garden) project, and then compile Garden following its documentation. It will compile the translated LLZK file along the way.

## Example

You can look at the `Garden/LLZK/` folder to see examples of translation, together with specifications and proofs.

## Contact

If you need to secure your ZK circuits, or need help with this project, please contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!
