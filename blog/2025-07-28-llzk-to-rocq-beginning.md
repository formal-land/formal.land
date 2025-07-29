---
title: 🥷 Beginning of a formal verification tool for LLZK
tags: [LLZK, translation, zero-knowledge]
authors: []
---

Here we present the beginning of our work to develop a formal verification tool for [LLZK](https://github.com/Veridise/llzk-lib) from [Veridise](https://veridise.com/), a new language designed to implement zero-knowledge circuits. The zero-knowledge technology is how future versions of Ethereum are planned to be implemented.

As usual, our technique is to work by translation to the [Rocq](https://rocq-prover.org/) formal verification language, using a representation as similar as possible to the source code to simplify reasoning. Then, we will be able to verify that:

- For any possible inputs, a circuit correctly computes a functional specification (no over-constraint).
- There are no possible invalid witness that can be accepted by the circuit (no under-constraint).

<!-- truncate -->

:::success Discuss with us!

The cost of a bug is extremely high in some industries (loss of life, loss of money, etc.), while there exist technologies like formal verification to make sure programs are correct for all cases.

Many companies and institutions like [Ethereum](https://ethereum.org/) are already using formal verification to secure their operations.

**Contact us** at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to discuss!&nbsp;👋

:::

<figure>
  ![Green forest](2025-07-28/green_forest.png)
</figure>

## 🥷 LLZK language

LLZK is a language made to define [zero-knowledge](https://en.wikipedia.org/wiki/Zero-knowledge_proof) circuits, a cryptographic primitive to state that you know about the execution of a program without revealing any information about it. LLZK is defined as a dialect of [MLIR](https://mlir.llvm.org/), which is a general purpose intermediate representation to build compilers, itself built on top of [LLVM](https://llvm.org/).

In MLIR, you have access to a set of [pre-defined operations](https://github.com/llvm/llvm-project/tree/main/mlir/include/mlir/Dialect) that you can extend with new dialects. Each dialect is a set of types or primitive functions and notations that you can add. These are generally defined in C++ or using the custom language `.td` like in [Dialect/SCF/IR/SCFOps.td](https://github.com/llvm/llvm-project/blob/main/mlir/include/mlir/Dialect/SCF/IR/SCFOps.td). Here is an example of LLZK circuit:

```mlir
function.def @global_add(%a: !felt.type, %b: !felt.type) -> !felt.type {
  %c = felt.add %a, %b
  function.return %c : !felt.type
}

struct.def @Adder {
  struct.field @sum : !felt.type {llzk.pub}

  function.def @compute(%a: !felt.type, %b: !felt.type) -> !struct.type<@Adder> {
    %self = struct.new : !struct.type<@Adder>
    %sum = function.call @global_add(%a, %b) : (!felt.type, !felt.type) -> (!felt.type)
    struct.writef %self[@sum] = %sum : !struct.type<@Adder>, !felt.type
    function.return %self : !struct.type<@Adder>
  }

  function.def @constrain(%self: !struct.type<@Adder>, %a: !felt.type, %b: !felt.type) {
    %sum = struct.readf %self[@sum] : !struct.type<@Adder>, !felt.type
    %c = function.call @global_add(%a, %b) : (!felt.type, !felt.type) -> (!felt.type)
    constrain.eq %sum, %c : !felt.type
    function.return
  }
}
```

The code is rather verbose, with type annotations on every line, but this is built as an intermediate language to be used for analyses or compilation to zero-knowledge constraints. The two main functions are:

- `compute` that computes a witness for the circuit, given the inputs.
- `constrain` that constrains the witness to the circuit specification.

For the constraints, we have access to a special operator:

```mlir
constrain.eq %sum, %c : !felt.type
```

It checks that two values are equal and aborts the execution if they are not. The security property we will need to show is that the witness computed by the `compute` function is the only possible parameter `self` for the function `constrain` in order to execute it without aborting. This will ensure that our circuit correctly and safely represent the `compute` function acting as a specification and a way to generate the zero-knowledge witness.

:::info Note

Zero-knowledge circuits are ultimately compiled down to a set of equations on polynomials using integers modulo&nbsp;$p$ a large prime number. This is why the main type appearing in the code is `!felt.type`, which is a type for integers modulo&nbsp;$p$. This differs from most programming languages where the main type is computed modulo&nbsp;$2^{32}$ or&nbsp;$2^{64}$.

:::

## 🔌 LLZK API

To parse LLZK code, we wrote an MLIR pass as part of the LLZK code base that we extend in [this pull request](https://github.com/formal-land/llzk-lib/pull/1). All the code is in C++. This is in our experience the simplest way to connect to the MLIR infrastructure, after trying a few other alternatives. That way you get access to all of MLIR facilities, as most of the project is written in C++.

We use the C++ primitives of MLIR to iterate over the whole syntax tree of a given LLZK file. Our translation works by directly pretty-printing the corresponding Rocq file on the standard output: we try not to do additional translation passes to keep the translation simple and predictable. Here is an example of the code where we parse and pretty-print the operations of LLZK (the functions that you can call on each line of the SSA form):

```cpp
} else if (auto addFeltOp = dyn_cast<AddFeltOp>(operation)) {
  llvm::outs() << "BinOp.add ";
  printOperand(topLevelOperation, addFeltOp.getLhs());
  llvm::outs() << " ";
  printOperand(topLevelOperation, addFeltOp.getRhs());
} else if (auto subFeltOp = dyn_cast<SubFeltOp>(operation)) {
  llvm::outs() << "BinOp.sub ";
  printOperand(topLevelOperation, subFeltOp.getLhs());
  llvm::outs() << " ";
  printOperand(topLevelOperation, subFeltOp.getRhs());
} else if (auto mulFeltOp = dyn_cast<MulFeltOp>(operation)) {
  // ...
```

We use a dynamic cast to check the type of the operation and print the corresponding Rocq code. There the operations are either addition or substraction. The payload differs for each of the operation, with two operands `lhs` and `rhs` that we retrieve with the methods `getLhs` and `getRhs` in this case. These felt operations are defined in the `.td` file [llzk/Dialect/Felt/IR/Ops.td](https://github.com/Veridise/llzk-lib/blob/main/include/llzk/Dialect/Felt/IR/Ops.td).

## 🐓 Rocq output

We obain the following output in Rocq for the LLZK example above:

```coq
Definition global_add {p} `{Prime p} (arg_fun_0 : Felt.t) (arg_fun_1 : Felt.t) : M.t Felt.t :=
  let var_0 : Felt.t := BinOp.add arg_fun_0 arg_fun_1 in
  M.Pure var_0.

Module Adder.
  Record t : Set := {
    sum : Felt.t;
  }.

  Global Instance IsMapMop {ρ} `{Prime ρ} : MapMod t := {
    map_mod α := {|
      sum := map_mod α.(sum);
    |};
  }.

  Definition constrain {p} `{Prime p} (arg_fun_0 : Adder.t) (arg_fun_1 : Felt.t) (arg_fun_2 : Felt.t) : M.t unit :=
    let var_0 : Felt.t := arg_fun_0.(Adder.sum) in
    let* var_1 : Felt.t := global_add arg_fun_1 arg_fun_2 in
    let* _ : unit := M.AssertEqual var_0 var_1 in
    M.Pure tt.

  Definition compute {p} `{Prime p} (arg_fun_0 : Felt.t) (arg_fun_1 : Felt.t) : M.t Adder.t :=
    let* var_self : Adder.t := M.CreateStruct in
    let* var_0 : Felt.t := global_add arg_fun_0 arg_fun_1 in
    let* _ : unit := M.FieldWrite var_self.(Adder.sum) var_0 in
    M.Pure var_self.
```

This code should be fairly similar to the original LLZK code, with the addition of the `M.t` monad all the potential side effects. We add an implicit parameter&nbsp;`p` to all the functions for the prime number with which we are working for the modulo operation. The type-class instance `IsMapMop` is a helper that we generate to help for the proofs: it applies a modulo operation to all the integer fields of a data structure.

In the function `constrain`, we have one side effect: `M.AssertEqual` to check for the equality of `var_0` and `var_1`. In the function `compute`, we have two side effects: `M.CreateStruct` to create an arbitrary value of type `Adder.t` and `M.FieldWrite` to write the result of the addition to the `sum` field.

The function `global_add` is defined as effectful even if it is actually purely functional. This is because we do not make an effect analysis for simplicity, so we suppose by default that all the functions are effectful.

## ✒️ Conclusion

We have had an overview of how to parse example of zero-knowledge circuits written in LLZK to pretty-print them in the formal verification language Rocq.

In the upcoming blog posts, we will show how to give a semantics to the Rocq translation in order to formally verify properties on this example.

> You want to secure your code? Contact us! ⇨ [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions!_

:::
