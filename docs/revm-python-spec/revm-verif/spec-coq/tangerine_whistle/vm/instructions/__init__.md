# 🐓 __init__.v

[🐙 GitHub source](https://github.com/formal-land/coq-of-python/tree/main/CoqOfPython/ethereum/tangerine_whistle/vm/instructions/__init__.v)

```coq
Require Import CoqOfPython.CoqOfPython.

Definition globals : Globals.t := "ethereum.tangerine_whistle.vm.instructions.__init__".

Definition locals_stack : list Locals.t := [].

Definition expr_1 : Value.t :=
  Constant.str "
EVM Instruction Encoding (Opcodes)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Machine readable representations of EVM instructions, and a mapping to their
implementations.
".

(* At top_level_stmt: unsupported node type: Import *)

Axiom typing_imports_Callable :
  IsImported globals "typing" "Callable".
Axiom typing_imports_Dict :
  IsImported globals "typing" "Dict".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_arithmetic :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "arithmetic".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_bitwise :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "bitwise".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_block :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "block".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_comparison :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "comparison".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_control_flow :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "control_flow".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_environment :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "environment".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_keccak :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "keccak".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_log :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "log".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_memory :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "memory".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_stack :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "stack".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_storage :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "storage".

Axiom ethereum_tangerine_whistle_vm_instructions_imports_system :
  IsImported globals "ethereum.tangerine_whistle.vm.instructions" "system".

Definition Ops : Value.t := make_klass {|
  Klass.bases := [
    (globals, "(* At base: unsupported node type: Attribute *)")
  ];
  Klass.class_methods := [
  ];
  Klass.methods := [
  ];
|}.

(* At top_level_stmt: unsupported node type: AnnAssign *)
```
