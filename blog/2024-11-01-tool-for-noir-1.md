---
title: ◼️ A formal verification tool for Noir – 1
tags: [Noir, smart contract, circuits]
authors: []
---

In this series of blog posts, we present our development of a formal verification tool for the [◼️&nbsp;Noir](https://noir-lang.org/) smart contract language. It is particularly suited to writing zero-knowledge applications, providing primitive constructs such as a `Field` type to write programs that run efficiently as circuits. Having a formal verification for Noir enables the development of applications holding a large amount of money in this language, as it ensures that the code is correct with a mathematical level of certainty.

In this first post, we present how we translate Noir code to the [🐓&nbsp;Coq](https://coq.inria.fr/) proof system. We explore a translation after monomorphization and then at the HIR level. Note that we are interested in verifying programs _written in Noir_. The verification of the Noir compiler itself is a separated topic.

All our code is available as open-source on [github.com/formal-land/coq-of-noir](https://github.com/formal-land/coq-of-noir), and you are welcome to use it. We also provide all-included audit services to formally verify your smart contracts using `coq-of-noir`.

<!-- truncate -->

:::success Get started

To ensure your code is secure today, contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

Formal verification goes further than traditional audits to make 100% sure you cannot lose your funds, thanks to **mathematical reasoning on the code**. It can be integrated into your CI pipeline to check that every commit is fully correct **without doing a whole audit again**.

We make bugs such as the [DAO hack](https://www.gemini.com/fr-fr/cryptopedia/the-dao-hack-makerdao) ($60 million stolen) virtually **impossible to happen again**.

:::

<figure>
  ![Noir](2024-11-01/noir.webp)
</figure>

## ◼️ Quick presentation of Noir

Noir is designed as a small version of [🦀&nbsp;Rust](https://www.rust-lang.org/) with many built-in constructs to make it more amenable to efficient compilation to zero-knowledge circuits. Being a smaller version of Rust, this simplifies the development of tooling as the surface of the language is reduced. In addition, as it shares similarities with Rust, we can reuse our knowledge from [coq-of-rust](https://github.com/formal-land/coq-of-rust), a formal verification tool for Rust, to propose an equivalent tool for Noir.

A notable difference between Rust and Noir is that Noir has a much simpler memory management model: nothing is ever deallocated! As a result, the various kinds of pointers that exist in Rust (`Rc`, `RefCell`, ...) are not present in Noir. Most of the data is immutable, and mutations are encouraged to be done only on local variables.

The loops are restricted to `for` loops with bounds known at compile time, which simplifies the reasoning about them. For example, we are sure that all the loops terminate, which is required for the verification of the code.

Here is an example of Noir program that we will use in this series of blog posts. It showcases the use of mutable variables in a loop, as well as generic values such as `InputElements` that are known at compile time and specialized during the monomorphization phase to compile the code down to a circuit. It is part of the [noir_base64](https://github.com/noir-lang/noir_base64) library to encode an array of ASCII values into base64 values using finite field operations to stay efficient.

```rust
/**
 * @brief Take an array of ASCII values and convert into base64 values
 **/
pub fn base64_encode_elements<let InputElements: u32>(
    input: [u8; InputElements]
) -> [u8; InputElements] {
    let mut Base64Encoder = Base64EncodeBE::new();
    let mut result: [u8; InputElements] = [0; InputElements];

    for i in 0..InputElements {
        result[i] = Base64Encoder.get(input[i] as Field);
    }

    result
}
```

## 1️⃣ Monomorphization

In this phase of compilation, all generic types and values are instantiated with their concrete values, as well as trait instances. The resulting code is much simpler as it only contains functions and types. If we translate the code to an untyped representation in Coq, we can even consider that the monomorphized code only contains functions. Thus, for convenience, we started doing our translation from the monomorphized level.

The [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) for this level is in the Rust file [compiler/noirc_frontend/src/monomorphization/ast.rs](https://github.com/formal-land/coq-of-noir/blob/master/compiler/noirc_frontend/src/monomorphization/ast.rs) from the Noir's compiler. As an example, here is how the expressions are represented:

```rust
pub enum Expression {
    Ident(Ident),
    Literal(Literal),
    Block(Vec<Expression>),
    Unary(Unary),
    Binary(Binary),
    Index(Index),
    Cast(Cast),
    For(For),
    If(If),
    Tuple(Vec<Expression>),
    ExtractTupleField(Box<Expression>, usize),
    Call(Call),
    Let(Let),
    Constrain(Box<Expression>, Location, Option<Box<(Expression, HirType)>>),
    Assign(Assign),
    Semi(Box<Expression>),
    Break,
    Continue,
}
```

If you look at the various constructors of this enum they correspond to the language's primitives presented in the reference manual of Noir. Expressions (`Ident`, `Binary`, `Call`, ...) and statements (`If`, `Let`, `Break`, ...) are mixed together. If we look at the definition of `Ident`:

```rust
pub struct Ident {
    pub location: Option<Location>,
    pub definition: Definition,
    pub mutable: bool,
    pub name: String,
    pub typ: Type,
}
```

and then at the definition of `Definition`:

```rust
pub enum Definition {
    Local(LocalId),
    Function(FuncId),
    Builtin(String),
    LowLevel(String),
    // used as a foreign/externally defined unconstrained function
    Oracle(String),
}
```

we get that most of the names have an associated _id_ that is a unique number. This is because in the monomorphization phase, we duplicate a lot of the definitions (once for each instantiation of a generic type), so we have to give them a unique id to distinguish them.

### Translation

We translate the monomorphized code to Coq by doing:

1. An extraction to JSON thanks to the `serde` serialization library in Rust.
2. Pretty-printing the resulting JSON to a Coq file with a Python script.

We find this development process to be rather efficient as the Python language is quite flexible and allows us to manipulate the JSON data easily. Compared to the work of a full compiler, which can be rather expensive computationally, what we do is mostly a translation from one syntax to another, and Python is a good fit.

Our Noir example is monomorphized to the following code, which can be shown by the development option `--show-monomorphized` of `nargo`:

```rust
fn base64_encode_elements$f4(input$l26: [u8; 36]) -> [u8; 36] {
    let Base64Encoder$27 = new$f6();
    let result$28 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for i$29 in 0 .. 36 {
        result$l28[i$l29] = get$f7(Base64Encoder$l27, (input$l26[i$l29] as Field))
    };
    result$l28
}
```

We see that the generic variable&nbsp;`InputElements` is replaced by the constant value&nbsp;`36` as this is the value we use in the example we translate. All the identifiers have an additional `$...` suffix to make them unique. Thanks to the serialization library `serde`, we automatically get the JSON representation of this code that starts with:

```json
{
  "id": 4,
  "name": "base64_encode_elements",
  "parameters": [
    [
      49,
      false,
      "input",
      {
        "Array": [
          118,
          {
            "Integer": [
              "Unsigned",
              "Eight"
            ]
          }
        ]
      }
    ]
  ],
  "body": {
    "Block": [
      {
        "Let": {
          "id": 27,
          "mutable": true,
          "name": "Base64Encoder",
          "expression": {
            "Call": {
              "func": {
                "Ident": {
                  "location": {
                    "span": {
                      "start": 5312,
                      "end": 5315
                    },
                    "file": 70
                  },
                  "definition": {
                    "Function": 6
                  },
                  "mutable": false,
                  "name": "new",
                  "typ": {
                    "Function": [
                      [],
                      {
                        "Tuple": [
                          {
                            "Array": [
                              64,
                              {
                                "Integer": [
                                  "Unsigned",
                                  "Eight"
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      // much more JSON code
```

This is extremely verbose, and there is some information that we do not need, such as the locations of some of the items in the source. The advantage of JSON is that it is easy to parse and handle in most programming languages. In our case, here is an extract of the Python script that translates this JSON to Coq:

```python
'''
pub enum Expression {
    Ident(Ident),
    Literal(Literal),
    Block(Vec<Expression>),
    Unary(Unary),
    Binary(Binary),
    Index(Index),
    Cast(Cast),
    For(For),
    If(If),
    Tuple(Vec<Expression>),
    ExtractTupleField(Box<Expression>, usize),
    Call(Call),
    Let(Let),
    Constrain(Box<Expression>, Location, Option<Box<(Expression, HirType)>>),
    Assign(Assign),
    Semi(Box<Expression>),
    Break,
    Continue,
}
'''
def expression_to_coq(node) -> str:
    node_type: str = list(node.keys())[0]

    if node_type == "Ident":
        node = node["Ident"]
        return ident_to_coq(node)

    if node_type == "Literal":
        node = node["Literal"]
        return alloc(literal_to_coq(node))

    if node_type == "Block":
        node = node["Block"]
        return \
            "\n".join(
                expression_inside_block_to_coq(expression, index == len(node) - 1)
                for index, expression in enumerate(node)
            )

    if node_type == "Unary":
        node = node["Unary"]
        return unary_to_coq(node)

    if node_type == "Binary":
        node = node["Binary"]
        return binary_to_coq(node)

    # more cases...
```

For each kind of node in the AST, we write the original Rust type in comments, then let GitHub Copilot write the Python code and refine it. Here is the final Coq code that we get for this example:

```coq
Definition base64_encode_elements₄ (α : list Value.t) : M.t :=
  match α with
  | [input] =>
    let input := M.alloc input in
    let* result :=
      let~ Base64Encoder := [[ M.copy_mutable (|
        M.alloc (M.call_closure (|
          M.read (| M.get_function (| "new", 6 |) |),
          []
        |))
      |) ]] in
      let~ result := [[ M.copy_mutable (|
        M.alloc (Value.Array [
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |);
          M.read (| M.alloc (Value.Integer IntegerKind.U8 0) |)
        ])
      |) ]] in
      do~ [[
        M.for_ (|
          M.read (| M.alloc (Value.Integer IntegerKind.U32 0) |),
          M.read (| M.alloc (Value.Integer IntegerKind.U32 36) |),
          fun (i : Value.t) =>
          [[
            M.alloc (M.assign (|
              M.read (| M.alloc (M.index (|
                M.read (| M.alloc (result) |),
                M.read (| i |)
              |)) |),
              M.read (| M.alloc (M.call_closure (|
                M.read (| M.get_function (| "get", 7 |) |),
                [
                  M.read (| Base64Encoder |);
                  M.read (| M.alloc (M.cast (|
                    M.read (| M.alloc (M.index (|
                      M.read (| input |),
                      M.read (| i |)
                    |)) |),
                    IntegerKind.Field
                  |)) |)
                ]
              |)) |)
            |))
          ]]
        |)
      ]] in
      [[
        result
      ]] in
    M.read result
  | _ => M.impossible "wrong number of arguments"re
  end.
```

If you attentively compare this Coq code to the original Noir version, you will see that the two are similar, although the Coq version is much more verbose with all the explicit memory allocations and reads. You might be wondering why we are choosing this specific representation. How did we know we had to use `M.for_`, for example, to represent the loops?

### Semantics

This is where the semantics comes in. In the semantics phase, we define the meaning of each construct of the language in Coq. We reused our experience in building the [coq-of-rust](https://github.com/formal-land/coq-of-rust) and [coq-of-solidity](https://github.com/formal-land/coq-of-solidity), where we also had to define the semantics of imperative languages in Coq.

We remove all the type information to avoid the differences between the Coq's type system and the type system of Noir. All the values have the same type `Value.t`:

```coq
Module Value.
  Inductive t : Set :=
  | Bool (b : bool)
  | Integer (kind : IntegerKind.t) (integer : Z)
  | String (s : string)
  | FmtStr : string -> Z -> t -> t
  | Pointer (pointer : Pointer.t t)
  | Array (values : list t)
  | Slice (values : list t)
  | Tuple (values : list t)
  | Closure : {'(Value, M) : (Set * Set) @ list Value -> M} -> t.
End Value.
```

We have a monad `M.t` to represent the side-effects of Noir in Coq (memory mutation, non-termination for recursive calls, ...). We define this monad from the composition of two monads:

- A free monad `LowM.t` that contains all the effects we cannot directly represent in Coq.
- An error monad `Result.t` to represent special control-flow operations, such as `break` and `continue`, which have to interrupt the execution of the current loop prematurely, and a panic value in case of assert failure, which must propagate up to the main function.

The definition of these types is as follows:

- The free monad:
  ```coq
  Module LowM.
    Inductive t (A : Set) : Set :=
    | Pure (value : A)
    | CallPrimitive {B : Set} (primitive : Primitive.t B) (k : B -> t A)
    | CallClosure (closure : Value.t) (args : list Value.t) (k : A -> t A)
    | Let (e : t A) (k : A -> t A)
    | Loop (body : t A) (k : A -> t A)
    | Impossible (message : string).
  End LowM.
  ```
- The error monad:
  ```coq
  Module Result.
    Inductive t : Set :=
    | Ok (value : Value.t)
    | Break
    | Continue
    | Panic {A : Set} (payload : A).
  End Result.
  ```
- The composition of the two monads:
  ```coq
  Module M.
    Definition t : Set :=
      LowM.t Result.t.
  End M.
  ```

Note that since our type of values is always `Value.t`, we do not parameterize the monad `M.t` by the type of values.

## ✒️ Conclusion

Thanks to all the work above, we obtain a translation for a large subset of the Noir language to the Coq proof system, which type-checks and has a semantics. A difficulty with handling the code we produce from monomorphization is the unique identifier added after each name to make them unique. These identifiers are generated in a rather non-deterministic way that can depend on the machine that runs the compiler. In addition, they change every time we make changes to the source code.

In the next blog post, we will see how we prevent the identifiers from appearing in the generated code by working at a higher level than the monomorphization phase.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::
