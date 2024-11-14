---
title: 🦀 Example of verification for the Move's checker of Sui
tags: [Rust, Move, Sui, type-checker]
authors: []
---

We are continuing our formal verification work for the implementation of the type-checker of the [Move](https://sui.io/move) language in the [💧&nbsp;Sui](https://sui.io/) blockchain. We verify a manual translation in the proof system [🐓&nbsp;Coq](https://coq.inria.fr/) of the [🦀&nbsp;Rust](https://www.rust-lang.org/) code of the Move checker as available on [GitHub](https://github.com/move-language/move-sui/tree/main/crates/move-bytecode-verifier).

In this blog post, we present in detail the verification of a particular function `AbstractStack::pop_eq_n` that manipulates 📚&nbsp;stacks of types to show that it is equivalent to its naive implementation.

All the code presented here is on our GitHub at [github.com/formal-land/coq-of-rust](https://github.com/formal-land/coq-of-rust) 🧑‍🏫.

<!-- truncate -->

:::success Get started

To ensure your code is secure today, contact us at&nbsp;[&nbsp;💌&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land)!&nbsp;🚀

Formal verification goes further than traditional audits to make 100% sure you cannot lose your funds, thanks to **mathematical reasoning on the code**. It can be integrated into your CI pipeline to check that every commit is fully correct **without doing a whole audit again**.

We make bugs such as the [DAO hack](https://www.gemini.com/fr-fr/cryptopedia/the-dao-hack-makerdao) ($60 million stolen) virtually **impossible to happen again**.

:::

<figure>
  ![Water in forest](2024-11-14/water-in-forest.webp)
</figure>

## 🕵️ The code to verify

Here is the definition in Rust of an `AbstractStack`, from the file [move-abstract-stack/src/lib.rs](https://github.com/move-language/move-sui/blob/main/crates/move-abstract-stack/src/lib.rs):

```rust
/// An abstract value that compresses runs of the same value to reduce space usage
pub struct AbstractStack<T> {
    values: Vec<(u64, T)>,
    len: u64,
}
```

It says that a stack of elements of type&nbsp;`T` is a vector of pairs of a number and a value. The number is the number of times the value is repeated in the stack. The field&nbsp;`len` is the total number of elements in the stack. This representation is more efficient than a naive stack, in case the stack contains many repeated values.

Here is one of the primitives to remove elements from this stack:

```rust
/// Pops n values off the stack, erroring if there are not enough items or if the n items are
/// not equal
pub fn pop_eq_n(&mut self, n: NonZeroU64) -> Result<T, AbsStackError> {
    let n: u64 = n.get();
    if self.is_empty() || n > self.len {
        return Err(AbsStackError::Underflow);
    }
    let (count, last) = self.values.last_mut().unwrap();
    debug_assert!(*count > 0);
    let ret = match (*count).cmp(&n) {
        Ordering::Less => return Err(AbsStackError::ElementNotEqual),
        Ordering::Equal => {
            let (_, last) = self.values.pop().unwrap();
            last
        }
        Ordering::Greater => {
            *count -= n;
            last.clone()
        }
    };
    self.len -= n;
    Ok(ret)
}
```

This function removes `n` elements from the stack, returning the value of removed elements. It returns an error if there are not enough elements in the stack or if the `n` last items are not grouped as equal elements.

Our goal is to **show that this function is equal to the naive pop function with repetition** on flattened stacks.

## ⚖️ Specification

Here is the property we want to verify in the formal language Coq:

```coq
Lemma flatten_pop_eq_n {A : Set} `{Eq.Trait A} (n : Z) (stack : AbstractStack.t A)
    (H_n : n > 0) :
  match AbstractStack.pop_eq_n n stack with
  | Panic.Value (Result.Ok item, stack') =>
    flatten stack = List.repeat item (Z.to_nat n) ++ flatten stack'
  | _ => True
  end.
```

It says that for any possible `stack` and `n` greater than 0, if we remove `n` elements from the stack and when the execution succeeds, the flattened stack is equal to the repetition of the removed element `n` times followed by the flattened stack.

How did we get from the Rust code above to the expression of this property? We manually converted the Rust code above in Coq with the following definitions:

```coq
Module AbstractStack.
  Record t (A : Set) : Set := {
    values : list (Z * A);
    len : Z;
  }.
```

for the `AbstractStack` type, and:

```coq
Definition pop_eq_n {A : Set} (n : Z) : MS! (t A) (Result.t A AbsStackError.t) :=
  fun (self : t A) =>
  if (is_empty self || (n >? len self))%bool then
    return! (Result.Err AbsStackError.Underflow, self)
  else
  let! (count, last) := Option.unwrap (List.hd_error self.(values)) in
  if count <? n then
    return! (Result.Err AbsStackError.ElementNotEqual, self)
  else if count =? n then
    let (_, values) := vec.pop_front self.(values) in
    let self := {|
      values := values;
      len := self.(len) - n
    |} in
    return! (Result.Ok last, self)
  else
    let! values :=
      match values self with
      | [] => panic! "unreachable"
      | (_, last) :: values => return! ((count - n, last) :: values)
      end in
    let self := {|
      values := values;
      len := self.(len) - n
    |} in
    return! (Result.Ok last, self).
```

for the `pop_eq_n` function. Note that this definition uses a lot of user-defined notations, such as `let!`, that we made in order to simplify the expression of effects in Coq. You can read more about these notations on our previous blog post [🦀&nbsp;Formal verification of the type checker of Sui – part 2](/blog/2024/10/14/verification-move-sui-type-checker-2). We checked by testing that our translation above behaves as the original Rust code, as explained in our blog post [🦀&nbsp;Formal verification of the type checker of Sui – part 3](/blog/2024/10/15/verification-move-sui-type-checker-3). It is not necessary to understand the translation in detail, as its verification will flow naturally.

We define the `flatten` function to translate a stack with repetitions to a flat stack as:

```coq
Definition flatten {A : Set} (abstract_stack : AbstractStack.t A) : list A :=
  List.flat_map (fun '(n, v) => List.repeat v (Z.to_nat n)) abstract_stack.(AbstractStack.values).
```

It duplicates all the elements&nbsp;`n` times with `List.repeat v (Z.to_nat n)` and concatenates them with `List.flat_map`.

## 🤓 Proof

To show that the specification above is correct for any stacks, we cannot test it as it will only cover a finite amount of cases. We must write a Coq proof showing by mathematical reasoning that the code is always correct.

Here is our full proof:

```coq
Proof.
  destruct stack as [stack].
  unfold AbstractStack.pop_eq_n, flatten.
  (* if (is_empty self || (n >? len self))%bool then *)
  destruct (_  || _); simpl; [reflexivity|].
  unfold List.hd_error.
  (* Option.unwrap (List.hd_error self.(values)) *)
  destruct stack as [|[count last] stack]; simpl; [reflexivity|].
  (* if count <? n then *)
  destruct (_ <? n)%Z eqn:?; simpl; [reflexivity|].
  (* if count =? n then *)
  destruct (_ =? n)%Z eqn:?; simpl.
  { now replace n with count by lia. }
  { rewrite List.app_assoc.
    rewrite <- List.repeat_app.
    now replace (Z.to_nat n + Z.to_nat (count - n))%nat
      with (Z.to_nat count)
      by lia.
  }
Qed.
```

The way it works is that we follow all the possible execution branches in the Coq definition of `pop_eq_n` to show that each branch leads to either an execution error or a `Result.Ok` value with the correct stack. The `destruct` tactic is the one that allows us to explore each branch of the code, and is used every time we have a `match` or an `if` in the code.

Other reasoning operations include `unfold` to expand a definition or `rewrite` and `replace` to replace an expression with another when we have proved they are equal. For example, we replace:


```coq
Z.to_nat n + Z.to_nat (count - n)
```

by:

```coq
Z.to_nat count
```

as addition and subtraction by `n` cancel each other, and `count` is greater than `n` in this context for the `Z.to_nat (count - n)` operation to be well-defined.

While we write the proof in Coq we get a better view thanks to the interactive proof mode. For example, after the last&nbsp;`destruct` we have:

```coq
A: Set
H: Eq.Trait A
n, count: Z
last: A
stack: list (Z * A)
len: Z
H_n: n >= 0
Heqb: (count <? n) = false
Heqb0: (count =? n) = true

--------------------------------------

1/2
List.repeat last (Z.to_nat count) ++ List.flat_map (fun '(n0, v) => List.repeat v (Z.to_nat n0)) stack =
List.repeat last (Z.to_nat n) ++ List.flat_map (fun '(n0, v) => List.repeat v (Z.to_nat n0)) stack

--------------------------------------

2/2
List.repeat last (Z.to_nat count) ++ List.flat_map (fun '(n0, v) => List.repeat v (Z.to_nat n0)) stack =
List.repeat last (Z.to_nat n) ++
List.repeat last (Z.to_nat (count - n)) ++ List.flat_map (fun '(n0, v) => List.repeat v (Z.to_nat n0)) stack
```

This is how we can progress in the proof and know which command to type. We see two sub-goals `(1/2)` and `(2/2)` for each branch explored by the last `destruct`. In both cases, we need to show an equality:

1. The first one is solved by the fact that `count = n` in this branch.
2. The second one is solved by the fact that `count > n` in this branch, so that we can group the `List.repeat last (Z.to_nat n)` with `List.repeat last (Z.to_nat (count - n))` (repeating a "negative" number of times is the empty list so we need to make sure that `count - n` is not negative).

## ✒️ Conclusion

In this example, we have seen how to verify that the `pop_eq_n` function of the `AbstractStack` type in the Move checker of Sui is equivalent to the naive pop function with repetition on flattened stacks. As this is a formal proof, we are sure that this property holds for any possible stack and value of `n`.

We are continuing the work to verify the other functions of the project, with the final aim to verify the whole type-checker. We will keep you updated on our progress in the next blog posts&nbsp;🚀.

:::success For more

_Follow us on [X](https://x.com/FormalLand) or [LinkedIn](https://fr.linkedin.com/company/formal-land) for more, or comment on this post below! Feel free to DM us for any questions or requests!_

:::
