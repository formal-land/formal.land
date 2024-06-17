# 🐓 __init__.v

[🐙 GitHub source](https://github.com/formal-land/coq-of-python/tree/main/CoqOfPython/ethereum/dao_fork/__init__.v)

```coq
Require Import CoqOfPython.CoqOfPython.

Definition globals : Globals.t := "ethereum.dao_fork.__init__".

Definition locals_stack : list Locals.t := [].

Definition expr_1 : Value.t :=
  Constant.str "
The DAO Fork is a response to a smart contract exploit known as the 2016 DAO
Attack where a vulnerable contract was drained of its ether. This fork recovers
the stolen funds into a new contract.
".

Axiom ethereum_fork_criteria_imports_ByBlockNumber :
  IsImported globals "ethereum.fork_criteria" "ByBlockNumber".

Definition FORK_CRITERIA : Value.t := M.run ltac:(M.monadic (
  M.call (|
    M.get_name (| globals, locals_stack, "ByBlockNumber" |),
    make_list [
      Constant.int 1920000
    ],
    make_dict []
  |)
)).
```
