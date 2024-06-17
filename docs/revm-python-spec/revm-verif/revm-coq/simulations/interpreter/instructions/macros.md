# 🐓 macros.v

[🐙 GitHub source](https://github.com/formal-land/coq-of-rust/tree/main/CoqOfRust/revm/simulations/interpreter/instructions/macros.v)

```coq
Require Import CoqOfRust.CoqOfRust.
Require Import CoqOfRust.links.M.
Require Import CoqOfRust.simulations.M.
Import simulations.M.Notations.
Require Import CoqOfRust.revm.links.interpreter.interpreter.
Require Import CoqOfRust.revm.links.interpreter.interpreter.gas.
Require Import CoqOfRust.revm.links.interpreter.interpreter.instruction_result.
Require Import CoqOfRust.revm.simulations.interpreter.interpreter.
Require Import CoqOfRust.revm.simulations.interpreter.interpreter.gas.


(*
  /// Records a `gas` cost and fails the instruction if it would exceed the available gas.
  #[macro_export]
  macro_rules! gas {
      ($interp:expr, $gas:expr) => {
          $crate::gas!($interp, $gas, ())
      };
      ($interp:expr, $gas:expr, $ret:expr) => {
          if !$interp.gas.record_cost($gas) {
              $interp.instruction_result = $crate::InstructionResult::OutOfGas;
              return $ret;
          }
      };
  }
*)

Definition gas_macro (gas : Z) :
    MS? Interpreter.t string unit :=
  letS? interp := readS? in
  letS? success := liftS? Interpreter.Lens.gas (Gas.record_cost gas) in
  if negb success
  then
    letS? _ := writeS? (interp <|
      Interpreter.instruction_result := InstructionResult.OutOfGas
    |>) in
    returnS? tt
  else
    returnS? tt.
```
