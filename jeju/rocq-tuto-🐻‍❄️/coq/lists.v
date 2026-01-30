(** * Lists: The Fundamental Data Structure *)
(** This file accompanies Chapter 4 of the Rocq Tutorial *)

Require Import List.
Require Import Arith.
Import ListNotations.

(** ** List Basics *)

(** Lists are defined as:
    Inductive list (A : Type) : Type :=
      | nil : list A
      | cons : A -> list A -> list A.

    Notation: [] for nil, x :: xs for cons, [1; 2; 3] for cons 1 (cons 2 (cons 3 nil))
*)

(** ** Basic Functions *)

(** Length of a list *)
Fixpoint my_length {A : Type} (l : list A) : nat :=
  match l with
  | [] => 0
  | _ :: t => S (my_length t)
  end.

Example length_example : my_length [1; 2; 3; 4] = 4.
Proof. reflexivity. Qed.

(** Append two lists *)
Fixpoint my_app {A : Type} (l1 l2 : list A) : list A :=
  match l1 with
  | [] => l2
  | h :: t => h :: my_app t l2
  end.

Example app_example : my_app [1; 2] [3; 4] = [1; 2; 3; 4].
Proof. reflexivity. Qed.

(** Reverse a list *)
Fixpoint my_rev {A : Type} (l : list A) : list A :=
  match l with
  | [] => []
  | h :: t => my_rev t ++ [h]
  end.

Example rev_example : my_rev [1; 2; 3] = [3; 2; 1].
Proof. reflexivity. Qed.

(** Map a function over a list *)
Fixpoint my_map {A B : Type} (f : A -> B) (l : list A) : list B :=
  match l with
  | [] => []
  | h :: t => f h :: my_map f t
  end.

Example map_example : my_map (fun x => x * 2) [1; 2; 3] = [2; 4; 6].
Proof. reflexivity. Qed.

(** ** Proofs About Lists *)

(** Length of append *)
Theorem app_length : forall (A : Type) (l1 l2 : list A),
  length (l1 ++ l2) = length l1 + length l2.
Proof.
  intros A l1 l2.
  induction l1 as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

(** Append is associative *)
Theorem app_assoc : forall (A : Type) (l1 l2 l3 : list A),
  l1 ++ (l2 ++ l3) = (l1 ++ l2) ++ l3.
Proof.
  intros A l1 l2 l3.
  induction l1 as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

(** Append with nil on the right *)
Theorem app_nil_r : forall (A : Type) (l : list A),
  l ++ [] = l.
Proof.
  intros A l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

(** Map preserves length *)
Theorem map_length : forall (A B : Type) (f : A -> B) (l : list A),
  length (map f l) = length l.
Proof.
  intros A B f l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

(** ** Reverse Theorems *)

(** Reverse distributes over append (in reverse order) *)
Theorem rev_app_distr : forall (A : Type) (l1 l2 : list A),
  rev (l1 ++ l2) = rev l2 ++ rev l1.
Proof.
  intros A l1 l2.
  induction l1 as [| h t IHt].
  - simpl. rewrite app_nil_r. reflexivity.
  - simpl. rewrite IHt. rewrite app_assoc. reflexivity.
Qed.

(** Reverse is involutive (reversing twice gives the original) *)
Theorem rev_involutive : forall (A : Type) (l : list A),
  rev (rev l) = l.
Proof.
  intros A l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite rev_app_distr. rewrite IHt. simpl. reflexivity.
Qed.

(** ** Map Theorems *)

(** Mapping two functions is the same as mapping their composition *)
Theorem map_map : forall (A B C : Type) (f : A -> B) (g : B -> C) (l : list A),
  map g (map f l) = map (fun x => g (f x)) l.
Proof.
  intros A B C f g l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

(** Map distributes over append *)
Theorem map_app : forall (A B : Type) (f : A -> B) (l1 l2 : list A),
  map f (l1 ++ l2) = map f l1 ++ map f l2.
Proof.
  intros A B f l1 l2.
  induction l1 as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

(** ** Filter *)

(** Filter elements satisfying a predicate *)
Fixpoint my_filter {A : Type} (f : A -> bool) (l : list A) : list A :=
  match l with
  | [] => []
  | h :: t => if f h then h :: my_filter f t else my_filter f t
  end.

(** Filter can only decrease length *)
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

(** ** Exercises *)

(** Exercise: Prove that reversing preserves length *)
Theorem rev_length : forall (A : Type) (l : list A),
  length (rev l) = length l.
Proof.
  intros A l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl.
    rewrite app_length.
    rewrite IHt.
    simpl.
    rewrite Nat.add_comm.
    simpl.
    reflexivity.
Qed.
