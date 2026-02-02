(** * Induction: Natural Numbers and Mathematical Induction *)
(** This file accompanies Chapter 3 of the Rocq Tutorial *)

Require Import Arith.
Require Import Lia.

(** ** Natural Numbers *)

(** Natural numbers are defined inductively:
    Inductive nat : Type :=
      | O : nat
      | S : nat -> nat.
*)

(** Pattern matching example *)
Definition is_zero (n : nat) : bool :=
  match n with
  | O => true
  | S _ => false
  end.

Definition pred (n : nat) : nat :=
  match n with
  | O => O
  | S m => m
  end.

Example pred_5 : pred 5 = 4.
Proof. reflexivity. Qed.

(** ** Addition *)

(** Addition is defined recursively on the first argument:
    Fixpoint add (n m : nat) : nat :=
      match n with
      | O => m
      | S p => S (add p m)
      end.
*)

(** ** Our First Induction Proofs *)

(** 0 + n = n is trivial by definition *)
Theorem plus_O_n : forall n : nat, 0 + n = n.
Proof.
  intro n.
  simpl.
  reflexivity.
Qed.

(** n + 0 = n requires induction *)
Theorem plus_n_O : forall n : nat, n + 0 = n.
Proof.
  intro n.
  induction n as [| n' IHn'].
  - (* Base case: n = 0 *)
    simpl. reflexivity.
  - (* Inductive case: n = S n' *)
    simpl.
    rewrite IHn'.
    reflexivity.
Qed.

(** Helper lemma for commutativity *)
Theorem plus_n_Sm : forall n m : nat, S (n + m) = n + S m.
Proof.
  intros n m.
  induction n as [| n' IHn'].
  - simpl. reflexivity.
  - simpl. rewrite IHn'. reflexivity.
Qed.

(** Addition is commutative *)
Theorem plus_comm : forall n m : nat, n + m = m + n.
Proof.
  intros n m.
  induction n as [| n' IHn'].
  - simpl. rewrite plus_n_O. reflexivity.
  - simpl. rewrite IHn'. rewrite plus_n_Sm. reflexivity.
Qed.

(** Addition is associative *)
Theorem plus_assoc : forall n m p : nat, (n + m) + p = n + (m + p).
Proof.
  intros n m p.
  induction n as [| n' IHn'].
  - simpl. reflexivity.
  - simpl. rewrite IHn'. reflexivity.
Qed.

(** ** More Examples *)

(** Double function *)
Fixpoint double (n : nat) : nat :=
  match n with
  | O => O
  | S n' => S (S (double n'))
  end.

Theorem double_plus : forall n : nat, double n = n + n.
Proof.
  intro n.
  induction n as [| n' IHn'].
  - simpl. reflexivity.
  - simpl.
    rewrite IHn'.
    rewrite plus_n_Sm.
    reflexivity.
Qed.

(** ** Multiplication *)

(** Multiplication is defined as:
    Fixpoint mult (n m : nat) : nat :=
      match n with
      | O => O
      | S p => m + mult p m
      end.
*)

Theorem mult_0_r : forall n : nat, n * 0 = 0.
Proof.
  intro n.
  induction n as [| n' IHn'].
  - simpl. reflexivity.
  - simpl. exact IHn'.
Qed.

Theorem mult_1_r : forall n : nat, n * 1 = n.
Proof.
  intro n.
  induction n as [| n' IHn'].
  - simpl. reflexivity.
  - simpl. rewrite IHn'. reflexivity.
Qed.

(** ** Exercises *)

(** Exercise: Prove multiplication distributes over addition *)
Theorem mult_plus_distr_r : forall n m p : nat,
  (n + m) * p = n * p + m * p.
Proof.
  intros n m p.
  induction n as [| n' IHn'].
  - simpl. reflexivity.
  - simpl. rewrite IHn'. rewrite plus_assoc. reflexivity.
Qed.

(** Exercise: Prove multiplication is associative *)
Theorem mult_assoc : forall n m p : nat, n * (m * p) = (n * m) * p.
Proof.
  intros n m p.
  induction n as [| n' IHn'].
  - simpl. reflexivity.
  - simpl.
    rewrite mult_plus_distr_r.
    rewrite IHn'.
    reflexivity.
Qed.
