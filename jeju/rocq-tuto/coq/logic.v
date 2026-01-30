(** * Logic: Propositional Connectives and Classical Logic *)
(** This file accompanies Chapter 5 of the Rocq Tutorial *)

(** ** Conjunction: A /\ B *)

(** Introduction: to prove A /\ B, prove both A and B *)
Theorem and_intro : forall A B : Prop, A -> B -> A /\ B.
Proof.
  intros A B HA HB.
  split.
  - exact HA.
  - exact HB.
Qed.

(** Elimination: extract parts of a conjunction *)
Theorem and_elim_l : forall A B : Prop, A /\ B -> A.
Proof.
  intros A B [HA HB].
  exact HA.
Qed.

Theorem and_elim_r : forall A B : Prop, A /\ B -> B.
Proof.
  intros A B [HA HB].
  exact HB.
Qed.

(** Conjunction is commutative *)
Theorem and_comm : forall A B : Prop, A /\ B -> B /\ A.
Proof.
  intros A B [HA HB].
  split; assumption.
Qed.

(** Conjunction is associative *)
Theorem and_assoc : forall A B C : Prop,
  A /\ (B /\ C) <-> (A /\ B) /\ C.
Proof.
  intros A B C.
  split.
  - intros [HA [HB HC]].
    split; [split |]; assumption.
  - intros [[HA HB] HC].
    split; [| split]; assumption.
Qed.

(** ** Disjunction: A \/ B *)

(** Introduction: prove one side *)
Theorem or_intro_l : forall A B : Prop, A -> A \/ B.
Proof.
  intros A B HA.
  left.
  exact HA.
Qed.

Theorem or_intro_r : forall A B : Prop, B -> A \/ B.
Proof.
  intros A B HB.
  right.
  exact HB.
Qed.

(** Elimination: case analysis *)
Theorem or_elim : forall A B C : Prop,
  (A -> C) -> (B -> C) -> A \/ B -> C.
Proof.
  intros A B C HAC HBC [HA | HB].
  - apply HAC. exact HA.
  - apply HBC. exact HB.
Qed.

(** Disjunction is commutative *)
Theorem or_comm : forall A B : Prop, A \/ B -> B \/ A.
Proof.
  intros A B [HA | HB].
  - right. exact HA.
  - left. exact HB.
Qed.

(** ** Negation: ~A = A -> False *)

(** Ex falso quodlibet: from False, anything follows *)
Theorem ex_falso : forall P : Prop, False -> P.
Proof.
  intros P HFalse.
  destruct HFalse.
Qed.

(** A and ~A lead to contradiction *)
Theorem contradiction : forall A : Prop, A -> ~A -> False.
Proof.
  intros A HA HNA.
  apply HNA.
  exact HA.
Qed.

(** Double negation introduction (always provable) *)
Theorem double_neg_intro : forall A : Prop, A -> ~~A.
Proof.
  intros A HA HNA.
  apply HNA.
  exact HA.
Qed.

(** Contrapositive *)
Theorem contrapositive : forall A B : Prop, (A -> B) -> (~B -> ~A).
Proof.
  intros A B HAB HNB HA.
  apply HNB.
  apply HAB.
  exact HA.
Qed.

(** Modus tollens *)
Theorem modus_tollens : forall A B : Prop, (A -> B) -> ~B -> ~A.
Proof.
  intros A B HAB HNB HA.
  apply HNB.
  apply HAB.
  exact HA.
Qed.

(** ** De Morgan's Laws *)

(** These are provable intuitionistically *)
Theorem demorgan1 : forall A B : Prop, ~A /\ ~B -> ~(A \/ B).
Proof.
  intros A B [HNA HNB] [HA | HB].
  - apply HNA. exact HA.
  - apply HNB. exact HB.
Qed.

Theorem demorgan2 : forall A B : Prop, ~A \/ ~B -> ~(A /\ B).
Proof.
  intros A B [HNA | HNB] [HA HB].
  - apply HNA. exact HA.
  - apply HNB. exact HB.
Qed.

Theorem demorgan3 : forall A B : Prop, ~(A \/ B) -> ~A /\ ~B.
Proof.
  intros A B HNAB.
  split.
  - intro HA. apply HNAB. left. exact HA.
  - intro HB. apply HNAB. right. exact HB.
Qed.

(** This one requires classical logic! *)
Require Import Classical.

Theorem demorgan4 : forall A B : Prop, ~(A /\ B) -> ~A \/ ~B.
Proof.
  intros A B HNAB.
  destruct (classic A) as [HA | HNA].
  - right. intro HB. apply HNAB. split; assumption.
  - left. exact HNA.
Qed.

(** ** Classical Logic *)

(** Double negation elimination requires classical logic *)
Theorem double_neg_elim : forall A : Prop, ~~A -> A.
Proof.
  intros A HNNA.
  destruct (classic A) as [HA | HNA].
  - exact HA.
  - exfalso. apply HNNA. exact HNA.
Qed.

(** Excluded middle is the classical axiom *)
Theorem excluded_middle_consequence : forall A : Prop,
  (A \/ ~A) -> (~~A -> A).
Proof.
  intros A [HA | HNA] HNNA.
  - exact HA.
  - exfalso. apply HNNA. exact HNA.
Qed.

(** ** Distribution Laws *)

Theorem and_dist_or : forall A B C : Prop,
  A /\ (B \/ C) -> (A /\ B) \/ (A /\ C).
Proof.
  intros A B C [HA [HB | HC]].
  - left. split; assumption.
  - right. split; assumption.
Qed.

Theorem or_dist_and : forall A B C : Prop,
  A \/ (B /\ C) -> (A \/ B) /\ (A \/ C).
Proof.
  intros A B C [HA | [HB HC]].
  - split; left; exact HA.
  - split; right; assumption.
Qed.

(** ** Biconditional *)

Theorem iff_refl : forall A : Prop, A <-> A.
Proof.
  intro A.
  split; intro H; exact H.
Qed.

Theorem iff_sym : forall A B : Prop, (A <-> B) -> (B <-> A).
Proof.
  intros A B [HAB HBA].
  split; assumption.
Qed.

Theorem iff_trans : forall A B C : Prop,
  (A <-> B) -> (B <-> C) -> (A <-> C).
Proof.
  intros A B C [HAB HBA] [HBC HCB].
  split.
  - intro HA. apply HBC. apply HAB. exact HA.
  - intro HC. apply HBA. apply HCB. exact HC.
Qed.
