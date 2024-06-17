# 🐓 __init__.v

[🐙 GitHub source](https://github.com/formal-land/coq-of-python/tree/main/CoqOfPython/ethereum/paris/vm/simulations/proofs/__init__.v)

```coq
Require Import CoqOfPython.CoqOfPython.
Require Import simulations.CoqOfPython.
Require Import simulations.proofs.CoqOfPython.
Require Import simulations.proofs.heap.

Require Import ethereum.paris.vm.simulations.__init__.

Require ethereum.simulations.proofs.base_types.
Module Uint := base_types.Uint.
Module U256 := base_types.U256.

Definition globals : Globals.t := "ethereum.paris.vm".

Module Evm.
  Definition stack_to_value : Value.t :=
    Value.Make "builtins" "list" (Pointer.heap
      Address.stack
      (fun (stack : list U256.t) =>
        Object.wrapper (Data.List (List.map U256.to_value stack))
      )
    ).

  Definition to_value : Value.t :=
    Value.Make globals "Evm" (Pointer.heap
      Address.evm
      (fun (evm : Heap.Evm.t) =>
        Object.make [
          ("pc", Uint.to_value evm.(Heap.Evm.pc));
          ("stack", stack_to_value);
          ("gas_left", Uint.to_value evm.(Heap.Evm.gas_left))
        ]
      )
    ).
End Evm.
```
