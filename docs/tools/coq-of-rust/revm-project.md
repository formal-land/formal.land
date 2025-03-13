---
id: revm-project
title: Revm Project
---

:::tip The source

All the code of this project is available on [github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/revm](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/revm)

:::

The goal of this project is to apply the formal verification tool for Rust [**coq-of-rust**](https://github.com/formal-land/coq-of-rust) to formally verify a functional specification of [Revm](https://github.com/bluealloy/revm) that is a Rust implementation of the Ethereum Virtual Machine (EVM).

:::note

This project is funded by the [Ethereum Foundation](https://ethereum.foundation/), to whom we are grateful.

:::

The general mechanism we take to verify Rust code with [Rocq](https://rocq-prover.org/) is as follows:

1. Make an automated translation of the Rust source code of Revm to Rocq using `coq-of-rust`. This translation is as straightforward as possible 🏎️.
2. Make a refinement of the translated code that we code a "link" 🔗, that is equivalent to the original code but with type information and name resolution added back. There information are lost during the translation, as it is hard to come up with a general way to keep them.
3. Make a second refinement to a purely functional or monadic code, that we call a "simulation". This is the step in which we handle the memory 🐘.

Why don't we use other existing tools? We want to verify the code of Revm without modifications. As it uses many advanced Rust features (traits with associated types, a bit of unsafe code, and more generally a large code base), we needed to design a process that can handle all this complexity. As this space is constantly evolving, we are happy to hear about alternative tooling to handle the Revm project!

## 🎁 What we have

Currently, we have a translation in Rocq of the Revm that compiles. We mainly focused on the "link" step, with the definition of a link for the `ADD` instruction implementation:

```rust
pub fn add<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    _host: &mut H,
) {
    gas!(interpreter, gas::VERYLOW);
    popn_top!([op1], op2, interpreter);
    *op2 = op1.wrapping_add(*op2);
}
```

You can find this code in the [arithmetic.rs](https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/arithmetic.rs) file from the Revm project. Note the use of the macros `gas!` and `popn_top!` which generate a bit more code than it seems. Our link is in [arithmetic.v](https://github.com/formal-land/coq-of-rust/blob/main/CoqOfRust/revm/revm_interpreter/instructions/links/arithmetic.v) with:

```coq
Definition run_add
    {WIRE H : Set} `{Link WIRE} `{Link H}
    {WIRE_types : InterpreterTypes.Types.t} `{InterpreterTypes.Types.AreLinks WIRE_types}
    (run_InterpreterTypes_for_WIRE : InterpreterTypes.Run WIRE WIRE_types)
    (interpreter : Ref.t Pointer.Kind.MutRef (Interpreter.t WIRE WIRE_types))
    (_host : Ref.t Pointer.Kind.MutRef H) :
  {{
    instructions.arithmetic.add [] [ Φ WIRE; Φ H ] [ φ interpreter; φ _host ] 🔽
    unit
  }}.
```

followed by a proof script that is mostly about calling automated tactics. It states that the function `instructions.arithmetic.add`, that is translated by `coq-of-rust` from the source of Revm, reduces to some value of type `unit` given parameters of the right type.

One difficulty to type this function was the use of the `InterpreterTypes` trait that is essentially a container holding other types, through the use of associated types in traits. Here is its definition in Rust:

```rust
pub trait InterpreterTypes {
    type Stack: StackTr;
    type Memory: MemoryTr;
    type Bytecode: Jumps + Immediates + LegacyBytecode + EofData + EofContainer + EofCodeInfo;
    type ReturnData: ReturnData;
    type Input: InputsTr;
    type SubRoutineStack: SubRoutineStack;
    type Control: LoopControl;
    type RuntimeFlag: RuntimeFlag;
    type Extend;
}
```

Thanks to the flexibility of the type system of Rocq, we still found a way to represent this kind of construct we the above.

## 🎯 Next target

Our next target is to fully handle a simplified version of Revm with only three instructions (the actual total is around 150) to make the code more manageable.
