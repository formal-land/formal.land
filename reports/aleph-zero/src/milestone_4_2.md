# Milestone 4 - 2

In this grant report we present the second half of our work about building the tool `coq-of-solidity` to formally verify smart contract written in [Solidity](https://soliditylang.org/) with the interactive theorem prover [Coq](https://coq.inria.fr/). In the first part of the grant, we build the tool to translate Solidity programs to Coq. In this second part, we work on the formal verification of the translated programs taking an [ERC-20 smart contract](https://github.com/ethereum/solidity/blob/develop/test/libsolidity/semanticTests/various/erc20.sol) as an example.

The tool `coq-of-solidity` represents an improvement compared to the existing formal verification tools for Solidity, as most of the existing tools rely on automated theorem provers. While these provers can facilitate the verification process, they are limited in the complexity of the properties they can verify. In contrast, with an interactive theorem prover, we can verify arbitrarily complex properties of smart contracts. One example is showing the backward compatibility for an upgrade of an existing contract. The only equivalent of our work that we know about is the project [Clear](https://github.com/NethermindEth/Clear) which uses the interactive prover [Lean](https://lean-lang.org/) instead of Coq.

The `coq-of-solidity` tool is available on [https://github.com/formal-land/solidity](https://github.com/formal-land/solidity) and is based on a fork of the Solidity compiler that generates Coq code instead of EVM bytecode. The code is open-source with a GPL-3 license for the translation from Solidity to Coq (as the code of the Solidity compiler is already with a GPL-3 license), and as MIT license for the Coq developments (the specifications and the proofs).

## Deliverables

The code of the project is available at [https://github.com/formal-land/solidity](https://github.com/formal-land/solidity) The relevant files are:

- [https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/test/libsolidity/semanticTests/various/erc20/prepare.py](https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/test/libsolidity/semanticTests/various/erc20/prepare.py) A Python script to modify the Coq translation of a Solidity contract in a form optimized for verification.
- [https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/test/libsolidity/semanticTests/various/erc20/prepare_proof.py](https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/test/libsolidity/semanticTests/various/erc20/prepare_proof.py) A Python script that generates a Coq proof that the translation made by the script above is correct.
- [https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/test/libsolidity/semanticTests/various/erc20/ERC20.v](https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/test/libsolidity/semanticTests/various/erc20/ERC20.v) The raw Coq translation of the ERC-20 smart contract (generated).
- [https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/test/libsolidity/semanticTests/various/erc20/ERC20_functional.v](https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/test/libsolidity/semanticTests/various/erc20/ERC20_functional.v) The Coq translation of the ERC-20 smart contract in an optimized form for verification (generated).
- [https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/simulations/erc20.v](https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/simulations/erc20.v) The function specification of the ERC-20 smart contract in Coq.
- [https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/proofs/ERC20_functional.v](https://github.com/formal-land/solidity/blob/guillaume-claret%40verify-erc20/CoqOfSolidity/proofs/ERC20_functional.v) The formal proof that the specification above is correct.

## Blog posts

We made three blog posts to talk about the `coq-of-solidity` tool:

- [https://formal.land/blog/2024/08/07/coq-of-solidity-2](https://formal.land/blog/2024/08/07/coq-of-solidity-2)
- [https://formal.land/blog/2024/08/12/coq-of-solidity-3](https://formal.land/blog/2024/08/12/coq-of-solidity-3)
- [https://formal.land/blog/2024/08/13/coq-of-solidity-4](https://formal.land/blog/2024/08/13/coq-of-solidity-4)

These blog posts present how `coq-of-solidity` works to translate Solidity programs to Coq in a form that is amenable to formal verification, how we specify and verify an example function, and how we extend the verification work to a whole [ERC-20 smart contract](https://github.com/ethereum/solidity/blob/develop/test/libsolidity/semanticTests/various/erc20.sol).

## Improvement in the translation

Our initial translation of Solidity code to Coq, going through the intermediate language Yul, was very straightforward and hence trustable, but too complex to make the code verifiable. We implemented a first pass, as a Python script, that simplifies the translation with these two changes:

- Variables are not represented as a string of their names anymore and store in a stack of scopes, but with plain Coq variables.
- Likewise, functions are not names in an environment of functions anymore but standard Coq function, sorted in the topological order of their dependencies.

To make sure we do not make mistakes in this simplification process, the Python script also generates a Coq proof that the two versions are equivalent. This step is described in our first blog post [🪨 Coq of Solidity – part 2](https://formal.land/blog/2024/08/07/coq-of-solidity-2).

## Functional specification of the ERC-20 smart contract

To specify our ERC-20 example, we chose to give it a functional specification in the form of a Coq definition describing how it should behave. In this description we ignore certain details, such as `emit` calls in the contract or the payload of revert operations. We make the all overflow checks explicit, by doing arithmetic on the unbounded integer type&nbsp;`Z` and writing explicit&nbsp;`if` statements to check for overflows.

As an example, we specify the `_transfer` function:
```solidity
function _transfer(address from, address to, uint256 value) internal {
    require(to != address(0), "ERC20: transfer to the zero address");

    // The subtraction and addition here will revert on overflow.
    _balances[from] = _balances[from] - value;
    _balances[to] = _balances[to] + value;
    emit Transfer(from, to, value);
}
```
by the Coq function:
```coq
Definition _transfer (from to : Address.t) (value : U256.t) (storage : Storage.t)
    : Result.t Storage.t :=
  if to =? 0 then
    revert_address_null
  else if balanceOf storage from <? value then
    revert_arithmetic
  else
    let storage :=
      storage <| Storage.balances :=
        Dict.declare_or_assign
          storage.(Storage.balances)
          from
          (balanceOf storage from - value)
      |> in
    if balanceOf storage to + value >=? 2 ^ 256 then
      revert_arithmetic
    else
      Result.Success storage <| Storage.balances :=
        Dict.declare_or_assign
          storage.(Storage.balances)
          to
          (balanceOf storage to + value)
      |>.
```
The two added `if` statements correspond to the explicit overflow checks. The `emit` operation does not appear as we ignore the logging of events. The notation:
```coq
storage <| Storage.field := new_value |>
```
is to update a storage element in Coq.

The Coq function `_transfer` takes the same parameters as the Solidity function as well as an explicit storage state and returns a new storage value or an error. We write the same kind of specification for all the functions of the ERC-20 contract.

## Entrypoint dispatch

As this was required in our verification work, we also specified the dispatch to the right entrypoint according to the payload value at the entrance of the smart contract. This amounts to reading the first four bytes of the payload and calling the corresponding function. This is done in the Coq function `of_calldata` that starts like this:
```coq
Definition of_calldata (callvalue : U256.t) (calldata: list U256.t) : option t :=
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
This function exactly reproduces what is done in the contract at the Yul level so that we can show that our functional specification behaves exactly as the smart contract for all the inputs. A lot of our code, especially the redundant one, was successfully generated by AI tools such as [Claude.ai](https://claude.ai/) or [Copilot](https://copilot.github.com/).

## Proof technique

To prove the equivalence between the code and its specification, we designed a set of tactics that use the interactive proof mode of Coq as a debugger where we make progress in both the specification and the code so that we can show that the twos are equivalent. Here is the list of commands:

- `p`: final **P**ure expression
- `pn`: final **P**ure expression ignoring the resulting state with a **N**one (for a revert)
- `pe`: final **P**ure expression with non-trivial **E**quality of results
- `pr`: Yul **PR**imitive
- `prn`: Yul **PR**imitive ignoring the resulting state with a **N**one
- `l`: step in a **L**et
- `lu`: step in a **L**et by **U**nfolding
- `c`: step in a function **C**all
- `cu`: step in a function **C**all by **U**nfolding
- `s`: **S**implify the goal

Most of the steps of the proofs are simple but still verbose, and would require more automation in the future. We were able to show the equivalence of our specification with the code in about 1,000 lines of Coq proof, for about 100 original lines of Solidity code in the smart contract.
