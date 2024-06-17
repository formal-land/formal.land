# 🐓 mapping.v

[🐙 GitHub source](https://github.com/formal-land/coq-of-python/tree/main/CoqOfPython/ethereum/constantinople/vm/precompiled_contracts/mapping.v)

```coq
Require Import CoqOfPython.CoqOfPython.

Definition globals : Globals.t := "ethereum.constantinople.vm.precompiled_contracts.mapping".

Definition locals_stack : list Locals.t := [].

Definition expr_1 : Value.t :=
  Constant.str "
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Mapping of precompiled contracts their implementations.
".

Axiom typing_imports_Callable :
  IsImported globals "typing" "Callable".
Axiom typing_imports_Dict :
  IsImported globals "typing" "Dict".

Axiom ethereum_constantinople_fork_types_imports_Address :
  IsImported globals "ethereum.constantinople.fork_types" "Address".

Axiom ethereum_constantinople_vm_precompiled_contracts_imports_ALT_BN128_ADD_ADDRESS :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts" "ALT_BN128_ADD_ADDRESS".
Axiom ethereum_constantinople_vm_precompiled_contracts_imports_ALT_BN128_MUL_ADDRESS :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts" "ALT_BN128_MUL_ADDRESS".
Axiom ethereum_constantinople_vm_precompiled_contracts_imports_ALT_BN128_PAIRING_CHECK_ADDRESS :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts" "ALT_BN128_PAIRING_CHECK_ADDRESS".
Axiom ethereum_constantinople_vm_precompiled_contracts_imports_ECRECOVER_ADDRESS :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts" "ECRECOVER_ADDRESS".
Axiom ethereum_constantinople_vm_precompiled_contracts_imports_IDENTITY_ADDRESS :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts" "IDENTITY_ADDRESS".
Axiom ethereum_constantinople_vm_precompiled_contracts_imports_MODEXP_ADDRESS :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts" "MODEXP_ADDRESS".
Axiom ethereum_constantinople_vm_precompiled_contracts_imports_RIPEMD160_ADDRESS :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts" "RIPEMD160_ADDRESS".
Axiom ethereum_constantinople_vm_precompiled_contracts_imports_SHA256_ADDRESS :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts" "SHA256_ADDRESS".

Axiom ethereum_constantinople_vm_precompiled_contracts_alt_bn128_imports_alt_bn128_add :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts.alt_bn128" "alt_bn128_add".
Axiom ethereum_constantinople_vm_precompiled_contracts_alt_bn128_imports_alt_bn128_mul :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts.alt_bn128" "alt_bn128_mul".
Axiom ethereum_constantinople_vm_precompiled_contracts_alt_bn128_imports_alt_bn128_pairing_check :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts.alt_bn128" "alt_bn128_pairing_check".

Axiom ethereum_constantinople_vm_precompiled_contracts_ecrecover_imports_ecrecover :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts.ecrecover" "ecrecover".

Axiom ethereum_constantinople_vm_precompiled_contracts_identity_imports_identity :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts.identity" "identity".

Axiom ethereum_constantinople_vm_precompiled_contracts_modexp_imports_modexp :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts.modexp" "modexp".

Axiom ethereum_constantinople_vm_precompiled_contracts_ripemd160_imports_ripemd160 :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts.ripemd160" "ripemd160".

Axiom ethereum_constantinople_vm_precompiled_contracts_sha256_imports_sha256 :
  IsImported globals "ethereum.constantinople.vm.precompiled_contracts.sha256" "sha256".

(* At top_level_stmt: unsupported node type: AnnAssign *)
```
