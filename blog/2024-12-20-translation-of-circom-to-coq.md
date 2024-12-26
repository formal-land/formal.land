---
title: 👻 Translation of Circom to Coq
tags: [Circom, zero-knowledge]
authors: []
---

In this post, we present the beginning of our work to translate programs written in the [Circom](https://iden3.io/circom) circuit language to the [🐓&nbsp;Coq](https://coq.inria.fr/) proof assistant. This work is part of our research on the formal verification of zero-knowledge systems.

We will aim to write more regularly about what we are doing, even if the posts are then shorter. Here, we focus on the translation part for a simple example without defining a semantics for the generated Coq code.

<!-- truncate -->

:::success Ask for the highest security!

To ensure your code is fully secure today, contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

We exclusively focus on formal verification to offer you the highest degree of security for your application.

We are already working with some of the leading blockchain entities, such as:

- The [Ethereum Foundation](https://ethereum.foundation/)
- The [Sui Foundation](https://sui.io/about)
- Previously, the [Aleph Zero](https://alephzero.org/) and [Tezos](https://tezos.com/) foundations

:::

<figure>
  ![Forest](2024-12-20/ghost-forest.webp)
</figure>

## 👻 The Circom language

This is a language to write composable and optimized zero-knowledge circuits. It has been in use for quite some time, and there are a lot of examples of Circom programs implementing common cryptographic primitives, such as hash functions. See, for example, the [github.com/iden3/circomlib](https://github.com/iden3/circomlib) repository. It is quoted by many projects, see for example this blog post [How zkLogin Made Cryptography Faster and More Secure](https://www.mystenlabs.com/blog/how-zklogin-made-cryptography-faster-and-more-secure) of the development team of [Sui](How zkLogin Made Cryptography Faster and More Secure) mentioning Circom.

Here is the example which we consider to add `ops` numbers of `n` bits:

```circom
function nbits(a) {
    var n = 1;
    var r = 0;
    while (n-1<a) {
        r++;
        n *= 2;
    }
    return r;
}


template BinSum(n, ops) {
    var nout = nbits((2**n -1)*ops);
    signal input in[ops][n];
    signal output out[nout];

    var lin = 0;
    var lout = 0;

    var k;
    var j;

    var e2;

    e2 = 1;
    for (k=0; k<n; k++) {
        for (j=0; j<ops; j++) {
            lin += in[j][k] * e2;
        }
        e2 = e2 + e2;
    }

    e2 = 1;
    for (k=0; k<nout; k++) {
        out[k] <-- (lin >> k) & 1;

        // Ensure out is binary
        out[k] * (out[k] - 1) === 0;

        lout += out[k] * e2;

        e2 = e2+e2;
    }

    // Ensure the sum;

    lin === lout;
}
```

You can find this example in [github.com/iden3/circomlib/blob/master/circuits/binsum.circom](https://github.com/iden3/circomlib/blob/master/circuits/binsum.circom).

It contains a function `nbits` to compute the number of bits needed to represent a number, and a template `BinSum` to add `ops` numbers of `n` bits. The function `bits` does not make any operations related to zero-knowledge. It is a simple imperative function with a loop and mutable variables `n` and `r`.

The template `BinSum` defines what is required to instantiate a new component, with input signals `in` and output signals `out`. With the equality assertion `===` it ensures that the output signals must be the bits of the sum of the input signals, and cannot be anything else. This is the property that we will want to formally verify to ensure that it is not possible to provide a proof of this circuit which does not compute the addition. This is called verifying that the circuit is not _underconstrained_.

## 🐓 The Coq proof assistant

The [Coq proof assistant](https://coq.inria.fr/), which we use exclusively at [Formal Land](https://formal.land), is a generic formal verification system. You can use it to verify any kind of maths or programs. You can never be stuck in the verification of a property, thanks to its interactive mode to refine proofs step by step. You can express almost any kind of property as it is based on the very expressive [Calculus Of Constructions](https://en.wikipedia.org/wiki/Calculus_of_constructions) logic.

Its community focuses a lot on the verification of programs, the most notable example being the full verification of the C compiler [CompCert](https://compcert.org/).

Our strategy is always the same: finding a nice embedding of a language in Coq, so that we can formally verify programs written in this language and reuse all the existing Coq tools and libraries.

## 🚀 Translation of Circom to Coq

The Circom compiler is written in [🦀&nbsp;Rust](https://www.rust-lang.org/). Generally, a compiler is composed of many intermediate languages, starting from a language that is essentially a representation of what the parser returns, down to some form of assembly or circuit language.

If you translate a high-level intermediate language to a proof system, you retain a lot of information from the original program and the specifications/proofs tend to be simpler. If you translate a low-level language, the translation itself will be simpler and more trustworthy, but the verification part will be harder. As Circom is a rather small language (compared to a full programming language), we choose to translate its high-level representation to Coq.

### To JSON

We write our translation tool in 🐍&nbsp;Python for simplicity, reading a JSON export of the [abstract syntax tree](https://github.com/iden3/circom/blob/master/program_structure/src/abstract_syntax_tree/ast.rs) of Circom. The quickest way to export data from Rust is to use the [Serde](https://serde.rs/) to generate pretty-printing functions to JSON. We have done it in this [pull request](https://github.com/formal-land/circom/pull/1) from a fork of the Circom compiler.

Here is, for example, the beginning of the JSON version of the `nbits` function above:

```json
"Function": {
  "meta": {},
  "name": "nbits",
  "args": [
    "a"
  ],
  "arg_location": {
    "start": 1571,
    "end": 1572
  },
  "body": {
    "Block": {
      "meta": {},
      "stmts": [
        {
          "InitializationBlock": {
            "meta": {},
            "xtype": "Var",
            "initializations": [
              {
                "Declaration": {
                  "meta": {},
                  "xtype": "Var",
                  "name": "n",
                  "dimensions": [],
                  "is_constant": true
                }
              },
              {
                "Substitution": {
                  "meta": {},
                  "var": "n",
                  "access": [],
                  "op": "AssignVar",
                  "rhe": {
                    "Number": [
                      {},
                      [
                        1,
                        [
                          1
                        ]
                      ]
```

### To Coq

We iterate over each nodes of this JSON file to produce a corresponding Coq file with the Python script [scipts/coq_of_circom.py](https://github.com/formal-land/garden/blob/main/scripts/coq_of_circom.py). Here is a short extract from this script:

```python
"""
pub enum Access {
    ComponentAccess(String),
    ArrayAccess(Expression),
}
"""
def to_coq_access(node) -> str:
    if "ComponentAccess" in node:
        return f"Access.Component ({node['ComponentAccess']})"
    if "ArrayAccess" in node:
        return f"Access.Array ({to_coq_expression(node['ArrayAccess'])})"
    return f"Unknown access: {node}"
```

For every node type in the Circom AST, we copy its Rust type in triple quotes in Python and let GitHub Copilot write a conversion function, which we complete and fix by hand. That way, we quickly cover all syntax with a reasonable Coq output.

We put all the code of our translation in a monad in Coq to represent the side effects, which are mainly here:

- imperative effects such as mutations and potentially non-terminating loops,
- the instantiation of components with signals, and the enforcement of the equality constraints.

Here is the Coq translation for the Circom example above, given in [Garden/Circom/Example/binsum.v](https://github.com/formal-land/garden/blob/main/Garden/Circom/Example/binsum.v):

```coq
(* Function *)
Definition nbits (a : F.t) : M.t F.t :=
  M.function_body (
    (* Var *)
    do~ M.declare_var "n" [[ ([] : list F.t) ]] in
    do~ M.substitute_var "n" [[ 1 ]] in
    (* Var *)
    do~ M.declare_var "r" [[ ([] : list F.t) ]] in
    do~ M.substitute_var "r" [[ 0 ]] in
    do~ M.while [[ InfixOp.lesser ~(| InfixOp.sub ~(| M.var ~(| "n" |), 1 |), M.var ~(| "a" |) |) ]] (
      do~ M.substitute_var "r" [[ InfixOp.add ~(| M.var ~(| "r" |), 1 |) ]] in
      do~ M.substitute_var "n" [[ InfixOp.mul ~(| M.var ~(| "n" |), 1 |) ]] in
      M.pure BlockUnit.Tt
    ) in
    do~ M.return_ [[ M.var ~(| "r" |) ]] in
    M.pure BlockUnit.Tt
  ).

(* Template *)
Definition BinSum (n ops : F.t) : M.t BlockUnit.t :=
  (* Var *)
  do~ M.declare_var "nout" [[ ([] : list F.t) ]] in
  do~ M.substitute_var "nout" [[ nbits ~(| InfixOp.mul ~(| InfixOp.sub ~(| InfixOp.pow ~(| 1, M.var ~(| "n" |) |), 1 |), M.var ~(| "ops" |) |) |) ]] in
  (* Signal Input *)
  do~ M.declare_signal "in" [[ [M.var ~(| "ops" |); M.var ~(| "n" |)] ]] in
  (* Signal Output *)
  do~ M.declare_signal "out" [[ [M.var ~(| "nout" |)] ]] in
  (* Var *)
  do~ M.declare_var "lin" [[ ([] : list F.t) ]] in
  do~ M.substitute_var "lin" [[ 0 ]] in
  (* Var *)
  do~ M.declare_var "lout" [[ ([] : list F.t) ]] in
  do~ M.substitute_var "lout" [[ 0 ]] in
  (* Var *)
  do~ M.declare_var "k" [[ ([] : list F.t) ]] in
  do~ M.substitute_var "k" [[ 0 ]] in
  (* Var *)
  do~ M.declare_var "j" [[ ([] : list F.t) ]] in
  do~ M.substitute_var "j" [[ 0 ]] in
  (* Var *)
  do~ M.declare_var "e2" [[ ([] : list F.t) ]] in
  do~ M.substitute_var "e2" [[ 0 ]] in
  do~ M.substitute_var "e2" [[ 1 ]] in
  do~ M.substitute_var "k" [[ 0 ]] in
  do~ M.while [[ InfixOp.lesser ~(| M.var ~(| "k" |), M.var ~(| "n" |) |) ]] (
    do~ M.substitute_var "j" [[ 0 ]] in
    do~ M.while [[ InfixOp.lesser ~(| M.var ~(| "j" |), M.var ~(| "ops" |) |) ]] (
      do~ M.substitute_var "lin" [[ InfixOp.add ~(| M.var ~(| "lin" |), InfixOp.mul ~(| M.var_access ~(| "in", [Access.Array (M.var ~(| "j" |)); Access.Array (M.var ~(| "k" |))] |), M.var ~(| "e2" |) |) |) ]] in
      do~ M.substitute_var "j" [[ InfixOp.add ~(| M.var ~(| "j" |), 1 |) ]] in
      M.pure BlockUnit.Tt
    ) in
    do~ M.substitute_var "e2" [[ InfixOp.add ~(| M.var ~(| "e2" |), M.var ~(| "e2" |) |) ]] in
    do~ M.substitute_var "k" [[ InfixOp.add ~(| M.var ~(| "k" |), 1 |) ]] in
    M.pure BlockUnit.Tt
  ) in
  do~ M.substitute_var "e2" [[ 1 ]] in
  do~ M.substitute_var "k" [[ 0 ]] in
  do~ M.while [[ InfixOp.lesser ~(| M.var ~(| "k" |), M.var ~(| "nout" |) |) ]] (
    do~ M.substitute_var "out" [[ InfixOp.bitand ~(| InfixOp.shiftr ~(| M.var ~(| "lin" |), M.var ~(| "k" |) |), 1 |) ]] in
    do~ M.equality_constraint
      [[ InfixOp.mul ~(| M.var_access ~(| "out", [Access.Array (M.var ~(| "k" |))] |), InfixOp.sub ~(| M.var_access ~(| "out", [Access.Array (M.var ~(| "k" |))] |), 1 |) |) ]]
      [[ 0 ]]
    in
    do~ M.substitute_var "lout" [[ InfixOp.add ~(| M.var ~(| "lout" |), InfixOp.mul ~(| M.var_access ~(| "out", [Access.Array (M.var ~(| "k" |))] |), M.var ~(| "e2" |) |) |) ]] in
    do~ M.substitute_var "e2" [[ InfixOp.add ~(| M.var ~(| "e2" |), M.var ~(| "e2" |) |) ]] in
    do~ M.substitute_var "k" [[ InfixOp.add ~(| M.var ~(| "k" |), 1 |) ]] in
    M.pure BlockUnit.Tt
  ) in
  do~ M.equality_constraint
    [[ M.var ~(| "lin" |) ]]
    [[ M.var ~(| "lout" |) ]]
  in
  M.pure BlockUnit.Tt.
```

If you compare the translated code to the original Circom code, you will see that the two are very similar, up to a more verbose syntax in Coq. This is because we translate the high-level representation of Circom to Coq.

### Free monad

Even if we do not define the Circom semantics for now, we need to write a few Coq definitions so that the code above can be type-checked. As in the translations we make for other languages, we use a free-monad to represent side effects. This is convenient, as we can first express which are the various "special" operators of the language (declaring a signal, instantiating a template, ...) and define their behavior in a second step. The behavior might be defined in a computational or relational way later.

The definitions of the monad are in [Garden/Garden.v](https://github.com/formal-land/garden/blob/main/Garden/Garden.v). Here is an extract:

```coq
Module Primitive.
  (** We group together primitives that share being impure functions operating over the state. *)
  Inductive t : Set -> Set :=
  | OpenScope : t unit
  | CloseScope : t unit
  | DeclareVar (name : string) (value : F.t) : t unit
  | DeclareSignal (name : string) (dimensions : list F.t) : t unit
  | SubstituteVar (name : string) (value : F.t) : t unit
  | GetVarAccess (name : string) (access : list Access.t) : t F.t
  | GetPrime : t F.t
  | EqualityConstraint (value1 value2 : F.t) : t unit.
End Primitive.
```

These are some of the primitives from the Circom language, which we needed for our example (we will add more as we cover more of the language). For example:

```coq
| DeclareVar (name : string) (value : F.t) : t unit
```

corresponds to the Circom construction:

```circom
var n = 1;
```

with `name` the string `"n"` and value the field element `1` in this case. We will use a scope of local variables for each function, as a dictionary from the name of the variable to its value. All local variables might be mutated. Compared to more complex languages, such as Rust, we do not need to handle the notion of pointer, simplifying many things.

Note that with the free monad, we only give the list of primitive operations with their signatures, but we have not yet defined how to evaluate them.

## ✒️ Conclusion

We have seen to define a first translation from the Circom language to Coq, for one example, with the goal of having a translation that is well-typed.

In the following article, we will explore the definition of a meaning to the primitive operations of Circom, such as signals and constraints, in order to formally verify that the `BinSum` is correct.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::
