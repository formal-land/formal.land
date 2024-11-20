# 📚 Start

In this part of the website, we will learn about applying modern **formal verification** to build **software without bugs&nbsp;🎊**.

Formal verification is proving that a program is correct for **any possible parameters** and initial state, even if there are **infinite possibilities**. The trick for this seemingly impossible challenge is to use **mathematical logic** to reason about the code.

With formal verification, we will see how to build software for which users **can never complain about a bug** and attackers, even with state-level capabilities, **can never exploit a vulnerability**. Formal verification has been used successfully for critical systems such as **rockets going to space&nbsp;🧑‍🚀**, trains, airplanes, and more recently to **securing cryptocurrencies&nbsp;💰**.

For the learning, we will follow the adventures of **Jeju&nbsp;🐻‍❄️**, a small bear lost on an island who is very keen on never making mistakes.

<figure>
  ![Jeju in forest](start_jeju_medium.webp)
  <!-- <figcaption style={{textAlign: "center"}}>Jeju&nbsp;🐻‍❄️ in the forest</figcaption> -->
  <figcaption>Jeju&nbsp;🐻‍❄️ in the forest.</figcaption>
</figure>

## Formal verification

There are rules to follow to reason about the code in a logical way. These rules apply to each primitive instruction in a programming language, such as `if`, `while`, `for`, `return`, etc. There is also a way to specify the expected behavior of a program, to distinguish between a **bug** and a **feature**. Distinguishing between a bug and a feature might be one of the hardest things to do, as there is not a single answer fitting every situation. Stating what a program should do is called a **specification**.

Jeju the bear 🐻‍❄️ knows the ancient art of formal verification. He is fortunate to use the **[Coq&nbsp;🐓](https://coq.inria.fr/)** proof software that helps write down all the reasoning **without making mistakes**. The Coq system has now been existing for 40 years and continues to evolve. It uses a special kind of logic based on [dependent types](https://en.wikipedia.org/wiki/Dependent_type), in which we can express any **mathematical statement** or **property about a program** and verify it. Many other systems are also based on these ideas, such as [Lean](https://lean-lang.org/) or [Agda](https://wiki.portal.chalmers.se/agda/pmwiki.php).

## Quick example

We now look at a small example to see the difference between testing and formal verification. You do not need to understand all the details for now.

To find bugs in a program the traditional method is to test many parameters until we can see the program working fine enough times. However there can always be a missing bug on a case that we have not tested. Here we take a small example to show the difference between testing and formal verification.

### Rust program

This is a Rust program returning the opposite of an integer:
```rust
fn opposite_i8(n: i8) -> i8 {
    return -n;
}
```
The type `i8` represents signed integers in 8 bits. If we test this function, it will work for most cases:
```rust
fn main() {
    println!("{}", opposite_i8(0)); // prints 0
    println!("{}", opposite_i8(40)); // prints -40
    println!("{}", opposite_i8(-28)); // prints 28
}
```
But there is one case in which the function fails:
```rust
// You need to run this code in release mode as in debug mode
// the overflows are checked and the program instead panics
fn main() {
    println!("{}", opposite_i8(-128)); // prints -128 instead of 128
}
```
The reason is that the bounds of 8 bits integers are from `-128` to `127` so we cannot represent `128` and thus we get a wrong result, in this case `-128`.

### Coq version

To be extra safe, Jeju uses formal verification and even sometimes avoids writing any tests!

Here is how he would represent the above program in Coq. We do not have an `i8` type but we have the `Z` type of integers without bounds. We simulate `i8` numbers by a function that takes an arbitrary integer and puts it back into the `-128` and `+127` bounds using the modulo operator:
```coq
Definition normalize_i8 (n : Z) : Z :=
  ((n + 128) mod 256) - 128.
```
We then define the opposite function:
```coq
Definition opposite_i8 (n : Z) : Z :=
  normalize_i8 (-n).
```
that returns the same results as in Rust:
```coq
Compute opposite_i8 0. (* 0 *)
Compute opposite_i8 40. (* -40 *)
Compute opposite_i8 (-28). (* 28 *)
Compute opposite_i8 (-128). (* -128 *)
```

### Formal verification

We can now state that the `opposite_i8` function should work for all `i8` values except `-128`:
```coq
Lemma normalize_i8_eq (n : Z) :
  - 127 <= n <= 127 ->
  opposite_i8 n = - n.
```
It says that for all integers between `-127` and `127` the opposite function returns the same value as what we would have in `Z`. We need to write an argument to say that this property is always true as the Coq system cannot check everything by itself. The argument is called a proof and is the following:
```coq
Proof.
  unfold opposite_i8, normalize_i8.
  lia.
Qed.
```
It says that we unfold all the definitions and then run the linear arithmetic solver `lia` to conclude the proof automatically. Once someone knows about the Coq proof system this is a very natural proof to write. For the proof above to work, you need to activate the division mode for `lia` with:
```coq
Ltac Zify.zify_post_hook ::= Z.to_euclidean_division_equations.
```
If we use an interval starting at `-128` instead, the same proof fails as expected:
```coq
Lemma normalize_i8_eq (n : Z) :
  - 128 <= n <= 127 ->
  opposite_i8 n = - n.
Proof.
  unfold opposite_i8, normalize_i8.
  lia.
Qed.
```
returns the error:
```
Error: Tactic failure:  Cannot find witness.
```

### Conclusion

We have seen how to both test and formally verify a small program `opposite_i8`. As there are only `256` possible values between `-128` and `127`, we could have also tested it exhaustively. But if we were working with the `i64` type instead, for signed integers with 64 bits, there would be too many possible values to test. That does not make Jeju afraid as the proof for 64-bits integers takes about the same time to run, a fraction of a second, and confirms that `opposite_i64` is valid for all `i64` values except the minimal one! 🎊

## Next

The rest of the learning section is under construction. We will learn:

- The basics of the Coq system.
- How to write a specification for a program in Coq and verify it?
- How to use Coq to verify smart contracts in Solidity?
- How to use Coq to verify Rust programs?

J. 🐾

Follow my X account on [@JejuFormalLand](https://x.com/JejuFormalLand) for more adventures!

<!-- audit:délai-important
avoir-un-nom-établi
donner-de-belles-references
donner-toujouts-des-noms-des-le-debut-trois-noms
trust,cher,avoir-sales,invalider-la-concurrence-en-deux-mots -->
