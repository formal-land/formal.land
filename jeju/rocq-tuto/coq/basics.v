(** * Basics: Fundamental Rocq Concepts *)
(** This file accompanies Chapter 2 of the Rocq Tutorial *)

(** ** Propositions and Proofs *)

(** The simplest proposition: True *)
Theorem my_first_theorem : True.
Proof.
  exact I.
Qed.

(** Identity: if we have A, we can prove A *)
Theorem identity : forall A : Prop, A -> A.
Proof.
  intro A.
  intro H.
  exact H.
Qed.

(** We can also write this more concisely *)
Theorem identity' : forall A : Prop, A -> A.
Proof.
  intros A H.
  assumption.
Qed.

(** Modus ponens: the fundamental rule of logic *)
Theorem modus_ponens : forall A B : Prop, A -> (A -> B) -> B.
Proof.
  intros A B HA HAB.
  apply HAB.
  exact HA.
Qed.

(** ** Basic Tactics in Action *)

(** Transitivity of implication *)
Theorem impl_trans : forall A B C : Prop,
  (A -> B) -> (B -> C) -> (A -> C).
Proof.
  intros A B C HAB HBC HA.
  apply HBC.
  apply HAB.
  exact HA.
Qed.

(** The K combinator *)
Theorem K_combinator : forall A B : Prop, A -> B -> A.
Proof.
  intros A B HA HB.
  exact HA.
Qed.

(** The S combinator *)
Theorem S_combinator : forall A B C : Prop,
  (A -> B -> C) -> (A -> B) -> A -> C.
Proof.
  intros A B C HABC HAB HA.
  apply HABC.
  - exact HA.
  - apply HAB. exact HA.
Qed.

(** ** Using assert for intermediate lemmas *)
Theorem using_assert : forall A B C : Prop,
  (A -> B) -> (B -> C) -> A -> C.
Proof.
  intros A B C HAB HBC HA.
  assert (HB : B).
  { apply HAB. exact HA. }
  apply HBC.
  exact HB.
Qed.

(** ** Auto tactic *)
Theorem auto_example : forall A B C : Prop,
  A -> (A -> B) -> (B -> C) -> C.
Proof.
  auto.
Qed.

(** ** Exercises *)

(** Exercise: Prove this chain of implications *)
Theorem chain : forall A B C D : Prop,
  (A -> B) -> (B -> C) -> (C -> D) -> A -> D.
Proof.
  (* Try it yourself! *)
  intros A B C D HAB HBC HCD HA.
  apply HCD. apply HBC. apply HAB. exact HA.
Qed.

(** Exercise: Flip the arguments *)
Theorem flip : forall A B C : Prop,
  (A -> B -> C) -> (B -> A -> C).
Proof.
  (* Try it yourself! *)
  intros A B C HABC HB HA.
  apply HABC; assumption.
Qed.
