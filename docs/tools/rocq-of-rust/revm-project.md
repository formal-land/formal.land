---
id: revm-project
title: Revm Project
---

import ProgressChart from '@site/src/components/ProgressChart';

<!-- <ProgressChart data={[
  {
    "date": "2025-06-15",
    "linkPct": 10,
    "simulatePct": 0,
  },
  {
    "date": "2025-07-01",
    "linkPct": 28,
    "simulatePct": 5,
  },
  {
    "date": "2025-08-01",
    "linkPct": 55,
    "simulatePct": 22,
  },
  {
    "date": "2025-09-05",
    "linkPct": 72,
    "simulatePct": 41,
  }
]} /> -->

Our goal is to formally specify the implementation of [Revm](https://github.com/bluealloy/revm), a Rust implementation of the EVM (the Ethereum Virtual Machine).

This is the critical first step to enable:

- The verification of full backward compatibility between Revm releases, lowering the rist of incorrect block handling ✅.
- The verification of full absence of runtime errors, so that no blocks can halt the node ✅.
- The verification of full compatibility with [Geth](https://github.com/ethereum/go-ethereum), the most popular Ethereum client ✅.
- The verification of full correctness of the RISC-V binary of Revm, a necessary step to make the zkVMs running Revm to be ready for the L1 ✅. See more details on [Ethproofs.org](https://ethproofs.org/).

If you want to discuss about this project, contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!

:::note Ethereum Foundation

This project is funded by the [🪁&nbsp;Ethereum Foundation](https://ethereum.foundation/), to whom we are grateful.

:::

:::tip The source code

The source code is on [github.com/formal-land/rocq-of-rust/tree/main/RocqOfRust/revm](https://github.com/formal-land/rocq-of-rust/tree/main/RocqOfRust/revm)

:::

## Status

This project is under development. We represent the Rust code in the formal language [Rocq](https://rocq-prover.org/).

The translation goes through three steps:

1. Make an automated translation of the Rust source code of Revm to Rocq using [rocq-of-rust](https://github.com/formal-land/rocq-of-rust). The generated code is a direct copy of the original Rust code, with all the macros and implicit operations expanded. It behaves as the original Rust code but it is about ten times more verbose.
2. Make a refinement of the translated code that we call a "link", which is equivalent to the original code but with type information and name resolution added back. There information are lost during the translation, as it is hard to come up with a general way to keep them.
3. Make a second refinement to a purely functional or monadic code, that we call a "simulation". This is the step in which we handle the Rust memory, by representing it as a state monad instead of a pointer-based memory.

## What we have

The current completion of the three translation steps is as follows:

1. Rust to Rocq with `rocq-of-rust`: **100%**
2. Link: **95%**
3. Simulation: **2.5%**

We continue working on the _simulation_ step, where we need to improve our method to make it more scalable.

## Example

Let us look at the three translation steps for the `ADD` instruction, for which the translation is complete.

0. The original Rust code for the addition in [revm/revm_interpreter/instructions/arithmetic.rs](https://github.com/formal-land/rocq-of-rust/blob/main/RocqOfRust/revm/revm_interpreter/instructions/arithmetic.rs) is:
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
    Note the use of the macros `gas!` and `popn_top!` which generate a bit more code than it seems.
1. The generated translation from `rocq-of-rust` is in [arithmetic.v](https://github.com/formal-land/rocq-of-rust/blob/main/RocqOfRust/revm/revm_interpreter/instructions/arithmetic.v) and is a 334 lines long code, with the following beginning:
    ```coq showLineNumbers
    Definition add (ε : list Value.t) (τ : list Ty.t) (α : list Value.t) : M :=
      match ε, τ, α with
      | [], [ WIRE; H ], [ interpreter; _host ] =>
        ltac:(M.monadic
          (let interpreter :=
            M.alloc (|
              Ty.apply
                (Ty.path "&mut")
                []
                [ Ty.apply (Ty.path "revm_interpreter::interpreter::Interpreter") [] [ WIRE ] ],
              interpreter
            |) in
          let _host := M.alloc (| Ty.apply (Ty.path "&mut") [] [ H ], _host |) in
          M.catch_return (Ty.tuple []) (|
            ltac:(M.monadic
              (M.read (|
                let~ _ : Ty.tuple [] :=
                  M.match_operator (|
                    Ty.tuple [],
                    M.alloc (| Ty.tuple [], Value.Tuple [] |),
                    [
                      fun γ =>
                        ltac:(M.monadic
                          (let γ :=
                            M.use
                              (M.alloc (|
                                Ty.path "bool",
                                UnOp.not (|
                                  M.call_closure (|
                                    Ty.path "bool",
                                    M.get_associated_function (|
                                      Ty.path "revm_interpreter::gas::Gas",
                                      "record_cost",
                                      [],
                                      []
                                    |),
                                    [
                                      M.borrow (|
                                        Pointer.Kind.MutRef,
                                        M.deref (|
                                          M.call_closure (|
                                            Ty.apply
                                              (Ty.path "&mut")
                                              []
                                              [ Ty.path "revm_interpreter::gas::Gas" ],
                                            M.get_trait_method (|
                                              "revm_interpreter::interpreter_types::LoopControl",
                                              Ty.associated_in_trait
                                                "revm_interpreter::interpreter_types::InterpreterTypes"
                                                []
                                                []
                                                WIRE
                                                "Control",
                                              [],
                                              [],
                                              "gas",
                                              [],
                                              []
                                            |),
    ```
2. The link is in [arithmetic.v](https://github.com/formal-land/rocq-of-rust/blob/main/RocqOfRust/revm/revm_interpreter/instructions/links/arithmetic.v). It is a proof that the generated code above can be well-typed, with existing trait instances:
    ```coq
    Instance run_add
        {WIRE H : Set} `{Link WIRE} `{Link H}
        {WIRE_types : InterpreterTypes.Types.t} `{InterpreterTypes.Types.AreLinks WIRE_types}
        {H_types : Host.Types.t} `{Host.Types.AreLinks H_types}
        (run_InterpreterTypes_for_WIRE : InterpreterTypes.Run WIRE WIRE_types)
        (interpreter : Ref.t Pointer.Kind.MutRef (Interpreter.t WIRE WIRE_types))
        (_host : Ref.t Pointer.Kind.MutRef H) :
      Run.Trait
        instructions.arithmetic.add [] [ Φ WIRE; Φ H ] [ φ interpreter; φ _host ]
        unit.
    Proof.
      constructor.
      destruct run_InterpreterTypes_for_WIRE.
      destruct run_LoopControl_for_Control.
      destruct run_StackTrait_for_Stack.
      run_symbolic.
    Defined.
    ```
3. Finally, the simulation is in [arithmetic.v](https://github.com/formal-land/rocq-of-rust/blob/main/RocqOfRust/revm/revm_interpreter/instructions/simulate/arithmetic.v) and is:
    ```coq
    Lemma add_eq
        {WIRE H : Set} `{Link WIRE} `{Link H}
        {WIRE_types : InterpreterTypes.Types.t} `{InterpreterTypes.Types.AreLinks WIRE_types}
        {H_types : Host.Types.t} `{Host.Types.AreLinks H_types}
        (run_InterpreterTypes_for_WIRE : InterpreterTypes.Run WIRE WIRE_types)
        (IInterpreterTypes : InterpreterTypes.C WIRE_types)
        (InterpreterTypesEq :
          InterpreterTypes.Eq.t WIRE WIRE_types run_InterpreterTypes_for_WIRE IInterpreterTypes)
        (interpreter : Interpreter.t WIRE WIRE_types)
        (_host : H) :
      let ref_interpreter := make_ref 0 in
      let ref_host := make_ref 1 in
      {{
        SimulateM.eval_f (Stack := [_; _])
          (run_add run_InterpreterTypes_for_WIRE ref_interpreter ref_host)
          (interpreter, (_host, tt)) 🌲
        (
          Output.Success tt,
          (
            gas_macro interpreter constants.VERYLOW (fun interpreter =>
            popn_top_macro interpreter {| Integer.value := 1 |} (fun arr top interpreter =>
              let '{| ArrayPair.x := op1 |} := arr.(array.value) in
              let op2 := top.(RefStub.projection) interpreter.(Interpreter.stack) in
              let stack :=
                top.(RefStub.injection)
                  interpreter.(Interpreter.stack) (Impl_Uint.wrapping_add op1 op2) in
              interpreter
                <| Interpreter.stack := stack |>
            )),
            (_host, tt)
          )
        )
      }}.
    ```
    Note that this is a lemma presenting the definition of the simulation and a statement stating that it is equivalent to the original Rust code.
