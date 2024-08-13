---
title: 🪨 Coq of Solidity – part 4
tags: [formal verification, Coq, Solidity, Yul]
authors: []
---

In this blog post we explain how we specify and formally verify a whole [ERC-20 smart contract](https://github.com/ethereum/solidity,/blob/develop/test/libsolidity/semanticTests/various/erc20.sol) using our tool [coq-of-solidity](https://github.com/formal-land/solidity), which translates [Solidity](https://soliditylang.org/) code to the proof assistant [Coq&nbsp;🐓](https://coq.inria.fr/).

The proofs are still tedious for now, as there are around 1,000 lines of proofs for 100 lines of Solidity. We plan to automate this work as much as possible in the subsequent iterations of the tool. One good thing about the interactive theorem prover Coq is that we know we can never be stuck, so we can always make progress in our proof techniques and verify complex properties even if it takes time&nbsp;✨.

Formal verification with an interactive proof assistant is the strongest way to verify programs since:

- it covers all possible inputs and program states,
- it checks any kind of properties.

<!-- truncate -->

:::success Get started

To audit your smart contracts and make sure they contain no bugs, contact us at&nbsp;[&nbsp;📧&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land).

We refund our work if we missed a high/critical severity bug.

:::

<figure>
  ![Ethereum in forest](2024-08-13/ethereum-in-forest.webp)
</figure>

## Functional specification

We specify the ERC-20 smart contract by writing an equivalent version in Coq that acts as a functional specification. In this specification, we ignore the `emit` operations that are logging events in Solidity and the precise payload of revert operations (we only say that "a revert occurs"). We make all our arithmetic operations on&nbsp;`Z` the type of unbounded integers with explicit overflow checks.

For example, here is the `_transfer` function of the Solidity smart contract:
```solidity
function _transfer(address from, address to, uint256 value) internal {
    require(to != address(0), "ERC20: transfer to the zero address");

    // The subtraction and addition here will revert on overflow.
    _balances[from] = _balances[from] - value;
    _balances[to] = _balances[to] + value;
    emit Transfer(from, to, value);
}
```
We specify it in the file [erc20.v](https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/simulations/erc20.v) by:
```coq
Definition _transfer (from to : Address.t) (value : U256.t) (s : Storage.t)
    : Result.t Storage.t :=
  if to =? 0 then
    revert_address_null
  else if balanceOf s from <? value then
    revert_arithmetic
  else
    let s :=
      s <| Storage.balances :=
        Dict.declare_or_assign s.(Storage.balances) from (balanceOf s from - value)
      |> in
    if balanceOf s to + value >=? 2 ^ 256 then
      revert_arithmetic
    else
      Result.Success s <| Storage.balances :=
        Dict.declare_or_assign s.(Storage.balances) to (balanceOf s to + value)
      |>.
```
With the Coq notation:
```coq
storage <| field := new_value |>
```
we modify a storage element as in the equivalent Solidity:
```solidity
field = new_value;
```
With the two tests:
```coq
if balanceOf s from <? value then
if balanceOf s to + value >=? 2 ^ 256 then
```
we make explicit the overflow checks that are implicit in the Solidity code.

## Dispatch to the entrypoints

A Solidity smart contract has two public functions:

1. One is the deployment code, which essentially initializes the storage of the smart contract and loads the rest of the code in memory,
2. The other one is executed when a transaction is sent to the smart contract, which is dispatched to the relevant entrypoint according to the payload of the transaction.

We will focus on the second one. It takes the contract's payload in a specific format:

1. The first four bytes are the function selector, which is the first four bytes of the hash of the function signature,
2. The rest of the payload is the arguments of the function, following the ABI ([Application Binary Interface](https://en.wikipedia.org/wiki/Application_binary_interface)) of Solidity.

This blog article [Deconstructing a Solidity Contract - Part III: The Function Selector](https://blog.openzeppelin.com/deconstructing-a-solidity-contract-part-iii-the-function-selector-6a9b6886ea49) from OpenZeppelin gives more information about it. In Coq, we represent the payload of a contract with a sum type:
```coq
Module Payload.
  Inductive t : Set :=
  | Transfer (to: Address.t) (value: U256.t)
  | Approve (spender: Address.t) (value: U256.t)
  | TransferFrom (from: Address.t) (to: Address.t) (value: U256.t)
  | IncreaseAllowance (spender: Address.t) (addedValue: U256.t)
  | DecreaseAllowance (spender: Address.t) (subtractedValue: U256.t)
  | TotalSupply
  | BalanceOf (owner: Address.t)
  | Allowance (owner: Address.t) (spender: Address.t).
End Payload.
```
We define how to get this payload from the binary representation:
```coq
Definition of_calldata (callvalue : U256.t) (calldata: list U256.t) :
    option Payload.t :=
  if Z.of_nat (List.length calldata) <? 4 then
    None
  else
    let selector := Stdlib.Pure.shr (256 - 32) (StdlibAux.get_calldata_u256 calldata 0) in
    if selector =? get_selector "approve(address,uint256)" then
      let to := StdlibAux.get_calldata_u256 calldata (4 + 32 * 0) in
      let value := StdlibAux.get_calldata_u256 calldata (4 + 32 * 1) in
      if negb (callvalue =? 0) then
        None
      else if negb (get_have_enough_calldata (32 * 2) calldata) then
        None
      else if negb (get_is_address_valid to) then
        None
      else
        Some (Approve to value)
    else if selector =? get_selector "totalSupply()" then
    (* ... other cases ... *)
```
The `callvalue` is the amount of Ether sent with the transaction, which has to be zero for non-payable functions. The `calldata` is the list bytes of the payload of the transaction. We check that the length of the payload is at least 4 bytes, then we extract the selector and the arguments of the function. We check that the arguments are valid, and we return the corresponding payload or `None` in case of error.

:::info

Note that a lot of the code is very repetitive and can be generated automatically by AI. For example the definition of the `Payload.t` type was automatically generated by [Claude.ai](https://claude.ai/) in one shot, with the code of the smart contract and its specification in context.

:::

## Equivalence statement

Here is the lemma stating that, for any possible user inputs and storage values, the Solidity smart contract and the Coq specification behave exactly the same:
```coq
Lemma run_body codes environment state
    (s : erc20.Storage.t)
    (H_environment : Environment.Valid.t environment)
    (H_s : erc20.Storage.Valid.t s) :
  let memoryguard := 128 in
  let memory_start :=
    [0; 0; 0; 0; 0] in
  let state_start :=
    make_state environment state memory_start (SimulatedStorage.of_erc20_state s) in
  let output :=
    // highlight-next-line
    The functional specification here:
    erc20.body
      environment.(Environment.caller)
      environment.(Environment.callvalue)
      s
      environment.(Environment.calldata) in
  let memory_end_middle :=
    [memoryguard; 0] in
  let state_end :=
    match output with
    | erc20.Result.Revert _ _ => None
    | erc20.Result.Success (memory_end_beginning, memory_end_end, s) =>
      Some (make_state environment state
        (memory_end_beginning ++ memory_end_middle ++ memory_end_end)
        (SimulatedStorage.of_erc20_state s)
      )
    end in
  {{? codes, environment, Some state_start |
    // highlight-next-line
    The original code here:
    ERC20_403.ERC20_403_deployed.body ⇓
    match output with
    | erc20.Result.Revert p s => Result.Revert p s
    | erc20.Result.Success (_, memory_end_end, _) =>
      Result.Return memoryguard (32 * Z.of_nat (List.length memory_end_end))
    end
  | state_end ?}}.
```
The proof is done in the same way as in the previous blog post [🪨 Coq of Solidity – part 3](/blog/2024/08/12/coq-of-solidity-3) about the verification of the `_approve` function. The body of the contract calls all the other functions of the contract, and we reuse the equivalence proofs for the other functions here.

The main difficulty we encountered in the proof was missing information in the specification. For example, our predicate of equivalence requires for the memory of the smart contract to have the exact same value as its specification at the end of execution, except in case of revert. This means we needed to add the final state of the memory in the specification also, even if this is an implementation detail. We will refine our equivalence statement in the future to avoid this kind of issue.

For the most part of the proof, the work was about stepping through both codes and making sure, by automatic unification, that the twos are indeed equal.

:::success AlephZero

_The development of `coq-of-solidity` is made possible thanks to the [AlephZero](https://alephzero.org/) project. We thank the AlephZero Foundation for their support&nbsp;🙏._

:::

## Conclusion

We have presented how to specify and formally verify a typical smart contract in Solidity, the ERC-20 token, using our tool `coq-of-solidity` (open-source). In the next post, we will see how to verify an invariant on the code and how the proof system Coq reacts if we introduce a bug.
