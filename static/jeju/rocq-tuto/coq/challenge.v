(** * Challenge Problems *)
(** This file accompanies Chapter 6 of the Rocq Tutorial *)

Require Import List Arith.
Import ListNotations.

(** ** Challenge 1: Reverse of Reverse *)

Lemma app_nil_r : forall (A : Type) (l : list A), l ++ [] = l.
Proof.
  intros A l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

Lemma app_assoc : forall (A : Type) (l1 l2 l3 : list A),
  l1 ++ (l2 ++ l3) = (l1 ++ l2) ++ l3.
Proof.
  intros A l1 l2 l3.
  induction l1 as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

Lemma rev_app_distr : forall (A : Type) (l1 l2 : list A),
  rev (l1 ++ l2) = rev l2 ++ rev l1.
Proof.
  intros A l1 l2.
  induction l1 as [| h t IHt].
  - simpl. rewrite app_nil_r. reflexivity.
  - simpl. rewrite IHt. rewrite app_assoc. reflexivity.
Qed.

Theorem rev_involutive : forall (A : Type) (l : list A),
  rev (rev l) = l.
Proof.
  intros A l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl.
    rewrite rev_app_distr.
    rewrite IHt.
    simpl.
    reflexivity.
Qed.

(** ** Challenge 2: Filter Length *)

Theorem filter_length : forall (A : Type) (f : A -> bool) (l : list A),
  length (filter f l) <= length l.
Proof.
  intros A f l.
  induction l as [| h t IHt].
  - simpl. apply le_n.
  - simpl. destruct (f h).
    + simpl. apply le_n_S. exact IHt.
    + apply le_S. exact IHt.
Qed.

(** ** Challenge 3: Fold and Map *)

Theorem fold_map : forall (A B C : Type) (f : A -> B) (g : B -> C -> C) (l : list A) (c : C),
  fold_right g c (map f l) = fold_right (fun a c => g (f a) c) c l.
Proof.
  intros A B C f g l c.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

(** ** Challenge 4: In and Append *)

(** Membership in a list *)
Fixpoint In' {A : Type} (x : A) (l : list A) : Prop :=
  match l with
  | [] => False
  | h :: t => h = x \/ In' x t
  end.

Theorem in_app_iff : forall (A : Type) (x : A) (l1 l2 : list A),
  In x (l1 ++ l2) <-> In x l1 \/ In x l2.
Proof.
  intros A x l1 l2.
  split.
  - (* -> *)
    induction l1 as [| h t IHt].
    + simpl. intro H. right. exact H.
    + simpl. intros [Heq | Hin].
      * left. left. exact Heq.
      * destruct (IHt Hin) as [Hl | Hr].
        -- left. right. exact Hl.
        -- right. exact Hr.
  - (* <- *)
    induction l1 as [| h t IHt].
    + simpl. intros [Hfalse | H].
      * destruct Hfalse.
      * exact H.
    + simpl. intros [[Heq | Hl1] | Hl2].
      * left. exact Heq.
      * right. apply IHt. left. exact Hl1.
      * right. apply IHt. right. exact Hl2.
Qed.

(** ** Challenge 5: Sorted Lists *)

Inductive sorted : list nat -> Prop :=
  | sorted_nil : sorted []
  | sorted_one : forall x, sorted [x]
  | sorted_cons : forall x y l,
      x <= y -> sorted (y :: l) -> sorted (x :: y :: l).

Example sorted_123 : sorted [1; 2; 3].
Proof.
  apply sorted_cons.
  - apply le_S. apply le_n.
  - apply sorted_cons.
    + apply le_S. apply le_n.
    + apply sorted_one.
Qed.

Theorem sorted_cons_intro : forall x y l,
  sorted (x :: l) -> y <= x -> sorted (y :: x :: l).
Proof.
  intros x y l Hsorted Hle.
  apply sorted_cons.
  - exact Hle.
  - exact Hsorted.
Qed.

(** ** Challenge 6: Weak Peirce *)

(** This is provable intuitionistically! *)
Theorem weak_peirce : forall A B : Prop,
  ((((A -> B) -> A) -> A) -> B) -> B.
Proof.
  intros A B H.
  apply H.
  intro HABA.
  apply HABA.
  intro HA.
  apply H.
  intro _.
  exact HA.
Qed.

(** ** Bonus: Vectors (Length-Indexed Lists) *)

(** Vectors are lists where the length is part of the type *)
Inductive vec (A : Type) : nat -> Type :=
  | vnil : vec A 0
  | vcons : forall n, A -> vec A n -> vec A (S n).

Arguments vnil {A}.
Arguments vcons {A n}.

(** Example vector of length 3 *)
Definition three_nums : vec nat 3 :=
  vcons 1 (vcons 2 (vcons 3 vnil)).

(** Head function that cannot fail on non-empty vectors *)
Definition vhead {A : Type} {n : nat} (v : vec A (S n)) : A :=
  match v with
  | vcons _ h _ => h
  end.

(** Tail function *)
Definition vtail {A : Type} {n : nat} (v : vec A (S n)) : vec A n :=
  match v with
  | vcons _ _ t => t
  end.

(** Append vectors - the lengths add up in the type! *)
Fixpoint vapp {A : Type} {n m : nat} (v1 : vec A n) (v2 : vec A m) : vec A (n + m) :=
  match v1 with
  | vnil => v2
  | vcons _ h t => vcons h (vapp t v2)
  end.

Example vapp_example : vapp (vcons 1 (vcons 2 vnil)) (vcons 3 vnil) = vcons 1 (vcons 2 (vcons 3 vnil)).
Proof. reflexivity. Qed.

(** Map over vectors preserves length in the type *)
Fixpoint vmap {A B : Type} {n : nat} (f : A -> B) (v : vec A n) : vec B n :=
  match v with
  | vnil => vnil
  | vcons _ h t => vcons (f h) (vmap f t)
  end.

(** ** Advanced: Heterogeneous Lists *)

(** A list where each element can have a different type *)
Inductive hlist : list Type -> Type :=
  | hnil : hlist []
  | hcons : forall A As, A -> hlist As -> hlist (A :: As).

Example my_hlist : hlist [nat; bool; nat] :=
  hcons nat [bool; nat] 42
    (hcons bool [nat] true
      (hcons nat [] 0 hnil)).
