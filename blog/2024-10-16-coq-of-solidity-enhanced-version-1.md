---
title: 🪁 Enhancements to coq-of-solidity – 1
tags: [Solidity, monad, effects, Yul, loops, mutations]
authors: []
---

We present improvements we made to our tool [coq-of-solidity](https://github.com/formal-land/coq-of-solidity) to formally verify [Solidity](https://soliditylang.org/) smart contracts for any advanced properties, relying on the proof assistant [🐓&nbsp;Coq](https://coq.inria.fr/). The idea is to be able to prove the **full absence of bugs&nbsp;✨** in **very complex contracts**, like L1 verifiers for **zero-knowledge L2s&nbsp;🕵️**, or contracts with **very large amounts of money&nbsp;💰** (in the billions).

In this blog post, we present how we developed an effect inference mechanism to translate optimized [Yul](https://docs.soliditylang.org/en/latest/yul.html) code combining variable mutations and control flow with loops and nested premature returns (`break`, `continue`, and `leave`) to a clean&nbsp;🧼 purely functional representation in the proof system Coq.

<!-- truncate -->

:::info

We will be talking about this work at the [Encode London Conference](https://lu.ma/encode-london-24) on Friday, October 25, 2024&nbsp;📢.

:::

:::success Get started

To ensure your code is secure today, contact us at&nbsp;[&nbsp;📧&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

Formal verification goes further than traditional audits to make 100% sure you cannot lose your funds. It can be integrated into your CI pipeline to make sure that every commit is correct without running a full audit again.

We make bugs such as the [DAO hack](https://www.gemini.com/fr-fr/cryptopedia/the-dao-hack-makerdao) ($60 million stolen) virtually impossible to happen again.

:::

<figure>
  ![Frozen Solidity rock](2024-10-16/frozen-solidity.webp)
</figure>

## 🧨 The issue

Yul is the intermediate language of the Solidity compiler that we translate to the Coq proof system to formally verify properties of smart contracts. The issue is that it has slightly different behaviors than the Coq language. In particular, it allows for variable mutations and imperative loops (`for` loops) with premature exits that have no native equivalents in purely functional languages like the ones used for formal verification.

Here is a short example of Yul code that is impossible to translate to Coq as it is:

```go
function rugby() -> x {
  let i := 0
  x := 0
  for { } lt(i, 10) { i := add(i, 1) } {
      x := add(x, i)
      if eq(i, 5) {
          leave
      }
  }
}
```

It uses the variable `x` to store the sum of the increasing sequence of integers `1`, `2`, `3`, ... but prematurely stops the loop when `i` reaches `5` and returns the final value of `x`.

To represent this code in a purely functional language, we need to:

- Make explicit the fact that we operate on a local state, that is to say, the couple of the two variables `i` and `x`.
- Represent the control flow of the loop, which repeats its body until the condition `eq(i, 5)` is satisfied and then bubbles up to the body of the function to return the final result&nbsp;`x`.

## Why is it important?

Having a purely functional representation of the Yul code is important as verifying functional programs is easier than verifying imperative ones, especially in the case of a system like Coq that is based on functional programming even at the logical level.

Ideally, such a translation should be done automatically so that we are not at risk of making mistakes and can focus our time on the verification work. This would allow to more efficiently formally verify properties of smart contracts or similar imperative programs. Not that in Yul, in addition to mutations on variables, there are also mutations on the contract's memory and storage, which we do not cover here.

## The solution

Our solution is a tool that does an effect inference on the Yul code to determine which variables might be mutated at each point of the program, and then propagates the results in the two cases where the execution continues to the next instruction and the case where it bubbles up.

### 🏗️ The tool

We wrote our tool in 🐍&nbsp;Python, for ease of development, parsing the Yul code from the JSON output of the Solidity compiler and outputting a Coq file that represents the functional version of the code. Yul is a rather pleasant language, optimized for formal verification and with very few constructs. Our code is available on our GitHub repository [github.com/formal-land/coq-of-solidity](https://github.com/formal-land/coq-of-solidity), in a pull request that is about to be merged.

Here is the header of our main Python function, which translates Yul statements to Coq:

```python
def statement_to_coq(node) -> tuple[Callable[[set[str]], str], set[str], set[str]]:
```

It takes a JSON `node` corresponding to a statement (assignment, `if`, `for`, `leave`, ...) and returns a triple with:

1. A function that takes the yet-to-be-determined mutated variables in the surrounding block and returns the Coq code of the statement.
2. The set of newly declared variables.
3. The set of mutated variables.

From these information we can infer the variables that are mutated at each point of the program and propagate them.

### 🔍 Example

As an example, here is the generated Coq translation of our 🏉&nbsp;`rugby` example above:

```coq showLineNumbers
Definition rugby : M.t U256.t :=
  let~ '(_, result) :=
    let~ i := [[ 0 ]] in
    let~ x := [[ 0 ]] in
    let_state~ '(i, x) :=
      (* for loop *)
      Shallow.for_
        (* init state *)
        (i, x)
        (* condition *)
        (fun '(i, x) => [[
          lt ~(| i, 10 |)
        ]])
        (* body *)
        (fun '(i, x) =>
          Shallow.lift_state_update
            (fun x => (i, x))
            (let~ x := [[ add ~(| x, i |) ]] in
            let_state~ 'tt := [[
              Shallow.if_ (|
                eq ~(| i, 5 |),
                M.pure (BlockUnit.Leave, tt),
                tt
              |)
            ]] default~ x in
            M.pure (BlockUnit.Tt, x)))
        (* post *)
        (fun '(i, x) =>
          Shallow.lift_state_update
            (fun i => (i, x))
            (let~ i := [[ add ~(| i, 1 |) ]] in
            M.pure (BlockUnit.Tt, i)))
    default~ x in
    M.pure (BlockUnit.Tt, x)
  in
  M.pure result.
```

On lines `3` and `4` we see that we use normal `let` declarations for the variables `i` and `x`:

```coq
let~ i := [[ 0 ]] in
let~ x := [[ 0 ]] in
```

The notation&nbsp;`let~` is a monadic notation to represent the side-effects of the EVM (storage updates, contract calls, ...) but the variables `i` and `x` are plain Coq variables, what will facilitate the formal verification process later.

In line&nbsp;`5`, we see that we consider the `for` loop to have a two-variable state `(i, x)`:

```coq
let_state~ '(i, x) :=
  (* for loop *)
  Shallow.for_
    (* init state *)
    (i, x)
```

The condition depends on the whole state, even if it only uses a part of it:

```coq
(* condition *)
(fun '(i, x) => [[
  lt ~(| i, 10 |)
]])
```
The body is more interesting. We only modify the variable `x` but we need to read and return the whole state `(i, x)`, so we start with a lift operation:

```coq
(* body *)
(fun '(i, x) =>
  Shallow.lift_state_update
    (fun x => (i, x))
```

Then we update the variable `x` with a standard variable declaration as if the variable was immutable:

```coq
(let~ x := [[ add ~(| x, i |) ]] in
```

The updated value of the variable `x` is propagated at the end of the body:

```coq
M.pure (BlockUnit.Tt, x)))
```

This is how we translate the inner&nbsp;`if`:

```coq
let_state~ 'tt := [[
  Shallow.if_ (|
    eq ~(| i, 5 |),
    M.pure (BlockUnit.Leave, tt),
    tt
  |)
]] default~ x in
```

If the condition is satisfied, we return the special value `BlockUnit.Leave` that will be interpreted as a premature exit of the function and activate the bubble-up mechanism. The associated state is the special empty value&nbsp;`tt` as there are no mutations in the `if` statement. We use&nbsp;`default~ x` at the next line to say that we complete the&nbsp;`tt` state with the value `x` if we are bubbling up.

The binding of the expression of `default~` is done after the `let_state~` to be able to retrieve parts of the state that might have been modified, if needed. This is, for example, the case for the `for` loop where we say that we first get the values of the two variables `i` and `x`:

```coq
let_state~ '(i, x) :=
  (* for loop *)
```

and then propagate only the state `x` in case of a premature exit:

```coq
default~ x in
```

at the line&nbsp;`33`.

### 🔮 Monad

The [monad](https://en.wikipedia.org/wiki/Monad_(functional_programming)) we use to represent the bubble-up mechanism is the following:

```coq
Module Shallow.
  Definition t (State : Set) : Set :=
    M.t (BlockUnit.t * State).
```

where:

- `M.t` is the monad representing the side-effects of the EVM,
- `BlockUnit.t` is a type representing the different modes of the bubble-up mechanism: no bubble-up, or a bubble-up with a `break`, `continue`, or `leave` instruction,
- `State` is the type of the current state that we might be writing to.

We define the notation `let_state~ ... default~ ... in` with:

```coq
Notation "'let_state~' pattern ':=' e 'default~' state 'in' k" :=
  (let_state e (fun pattern => (state, k)))
```

and the function:

```coq
Definition let_state {State1 State2 : Set}
    (expression : t State1) (body : State1 -> State2 * t State2) :
    t State2 :=
  M.strong_let_ expression (fun value =>
  let '(mode, state1) := value in
  match mode with
  (* no bubble-up, do not use the default state *)
  | BlockUnit.Tt => snd (body state1)
  (* bubble-up, use the default state and keep the same bubble-up mode *)
  | _ => M.pure (mode, fst (body state1))
  end).
```

You can also look at the definitions of the `Shallow.if_` and `Shallow.for_` functions in our code. For loops, we use a non-termination effect of the underlying monad `M.t`. This is because loops can be infinite, and this is not allowed in Coq.

## Application

We are using the new translation above to formally verify the implementation of a hand-optimized Yul code using loops and mutations to implement cryptographic operations in an efficient way. We believe that this translation would work as well for any other examples of Yul code, enabling the formal verification of arbitrary Solidity or Yul code in a more functional way.

## ✒️ Conclusion

We have show how we can automatically translate arbitrary Yul code in a purely functional form&nbsp;🌟, excluding mutations of the memory and the storage, in order to simplify further formal verification operations&nbsp;🙂.

A work left to be done is to prove that this transformation is correct, showing it equivalent to our initial and simpler Yul semantics where variables are represented as string keys in a map. We believe this is possible by generating a proof on a case-by-case basis for each transformed program, working by unification and exploring all the branches. But this remains to be done.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land), or comment on this post below! Feel free to DM us for any formal verification services you need._

:::
