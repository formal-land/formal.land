# 🐓 __init__.v

[🐙 GitHub source](https://github.com/formal-land/coq-of-python/tree/main/CoqOfPython/ethereum/tangerine_whistle/__init__.v)

```coq
Require Import CoqOfPython.CoqOfPython.

Definition globals : Globals.t := "ethereum.tangerine_whistle.__init__".

Definition locals_stack : list Locals.t := [].

Definition expr_1 : Value.t :=
  Constant.str "
The Tangerine Whistle fork is the first of two forks responding to a
denial-of-service attack on the Ethereum network. It tunes the price of various
EVM instructions, and reduces the state size by removing a number of empty
accounts.
".

Axiom ethereum_fork_criteria_imports_ByBlockNumber :
  IsImported globals "ethereum.fork_criteria" "ByBlockNumber".

Definition FORK_CRITERIA : Value.t := M.run ltac:(M.monadic (
  M.call (|
    M.get_name (| globals, locals_stack, "ByBlockNumber" |),
    make_list [
      Constant.int 2463000
    ],
    make_dict []
  |)
)).
```
