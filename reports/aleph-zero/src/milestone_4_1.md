# Milestone 4 - 1

In this grant report we present our work about the tool `coq-of-solidity` to formally verify smart contracts written in Solidity with the Coq proof assistant.

The idea of the tool is to automatically translate any smart contract written in Solidity to the proof system Coq. Then, in Coq, we can add a formal specification of the properties we want to verify and prove that they hold for all possible inputs given to the contract.

That way we can bring more security to the code audits by ensuring that all possible input cases are covered.

The `coq-of-solidity` tool is available on [https://github.com/formal-land/solidity](https://github.com/formal-land/solidity) and is based on a fork of the Solidity compiler that generates Coq code instead of EVM bytecode. The code is open-source with a GPL-3 license for the translation from Solidity to Coq (as the code of the Solidity compiler is already with a GPL-3 license), and as MIT license for the Coq developments.

In the past we worked on a similar tool [gitlab.com/formal-land/coq-of-solidity](https://gitlab.com/formal-land/coq-of-solidity) but this project was stopped as getting too complex, and we decided to restart from scratch with a different approach.

## Blog post

We made a first blog post presenting our tool on:

- [https://formal.land/blog/2024/06/28/coq-of-solidity-1](https://formal.land/blog/2024/06/28/coq-of-solidity-1)

This post presents the architecture of the tool and how the semantics of the Solidity's primitives is defined in Coq, and is the first of a coming series of blog posts.

## The tool

We developed our translation from Solidity to Coq by forking the official Solidity compiler `solc`. The main advantage of this approach is that we can:

- share a maximum of the existing code from the Solidity compiler (parser, type-checker, testing, ...),
- be synchronized with the evolutions of the Solidity language, when keeping our fork synchronized with the official Solidity compiler.

We add to the `solc` compiler an option `--ir-coq` that prints on the terminal a corresponding Coq code of the compiled contract.

We translate the Solidity code to Coq going through the [Yul](https://docs.soliditylang.org/en/latest/yul.html) intermediate language. This is the language used by the Solidity compiler to go from the Solidity code to the EVM bytecode. It is simpler to translate that Solidity since it is a smaller language, but still more high-level than the EVM bytecode to simplify the proofs.

The main code, in C++, to make the translation is in [libyul/AsmCoqConverter.cpp](https://github.com/formal-land/solidity/blob/guillaume-claret%40experiments-with-yul/libyul/AsmCoqConverter.cpp). Examples of output are in [CoqOfSolidity/test/libsolidity/](https://github.com/formal-land/solidity/tree/guillaume-claret%40experiments-with-yul/CoqOfSolidity/test/libsolidity).

## Coq semantics

We define the Coq semantics of the Yul language in two Coq files:

- [CoqOfSolidity/CoqOfSolidity.v](https://github.com/formal-land/solidity/blob/guillaume-claret%40experiments-with-yul/CoqOfSolidity/CoqOfSolidity.v) for the primitives of the language (`if` keyword, `:=` assignment, ...),
- [CoqOfSolidity/simulations/CoqOfSolidity.v](https://github.com/formal-land/solidity/blob/guillaume-claret%40experiments-with-yul/CoqOfSolidity/simulations/CoqOfSolidity.v) for the primitives related to the EVM (`add`, `call`, `create`, ...).

There are 92 primitives related to the EVM, plus a few pre-compiled contracts that act as additional primitives. We defined most of them and plan to complete these definitions by the end of the milestone.

## Testing

To test that our translation to Coq is correct we took all the examples from the Solidity compiler in the two folders:

- [test/libsolidity/syntaxTests](https://github.com/ethereum/solidity/tree/develop/test/libsolidity/syntaxTests)
- [test/libsolidity/semanticTests](https://github.com/ethereum/solidity/tree/develop/test/libsolidity/semanticTests)

We convert them to Coq using our tool. The output is in [CoqOfSolidity/test/libsolidity](https://github.com/formal-land/solidity/tree/guillaume-claret%40experiments-with-yul/CoqOfSolidity/test/libsolidity). There are about four thousand tests.

Then we check two things:

1. The Coq outputs are valid Coq codes. This is the case for all the tests.
2. That the Coq outputs give the same execution trace as the Solidity compiler. This is the case for about 90% of the semantic tests, that are the ones given with an execution trace.

Making sure that the translated smart contracts execute with the same results is what took most of our time during this milestone. We still have a few primitives to define to reach a 100% in the tests, but the most important ones are covered.

## What remains to be done for the next part

There are two main tasks that remain to be done for the next part of the milestone:

1. Making sure that we execute 100% of the semantic tests with the same outputs in the Coq side as the Solidity compiler.
2. Verifying an example of a smart contract, namely an ERC-20 contract, using the semantics and translation that we have done.
