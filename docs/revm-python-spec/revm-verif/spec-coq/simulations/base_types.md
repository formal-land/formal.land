# 🐓 base_types.v

[🐙 GitHub source](https://github.com/formal-land/coq-of-python/tree/main/CoqOfPython/ethereum/simulations/base_types.v)

```coq
Require Import CoqOfPython.CoqOfPython.
Require Import simulations.CoqOfPython.
Require Import simulations.builtins.

Import simulations.CoqOfPython.Notations.

Definition globals : Globals.t := "ethereum.base_types".

Definition U255_CEIL_VALUE : Z := 2^255.

Definition U256_CEIL_VALUE : Z := 2^256.

Module Uint.
  Inductive t : Set :=
  | Make (value : Z).

  Definition get (value : t) : Z :=
    match value with
    | Make value => value
    end.

  Definition __add__ (self right_ : t) : t :=
    Make (get self + get right_).
End Uint.

Module FixedUint.
  Record t : Set := {
    MAX_VALUE : Z;
    value : Z;
  }.

  Definition __add__ (self right_ : t) : M? Exception.t t :=
    let result := (self.(value) + right_.(value))%Z in
    if result >? self.(MAX_VALUE) then
      Error.raise (Exception.ArithmeticError ArithmeticError.OverflowError)
    else
      return? {|
        MAX_VALUE := self.(MAX_VALUE);
        value := result;
      |}.

  Definition wrapping_add (self right_ : t) : t :=
    let sum := (self.(value) + right_.(value))%Z in
    {|
      MAX_VALUE := self.(MAX_VALUE);
      value := Z.modulo sum self.(MAX_VALUE);
    |}.
  
  Definition __sub__ (self right_ : t) : M? Exception.t t :=
    let result := (self.(value) - right_.(value))%Z in
    if result >? self.(MAX_VALUE) then
      Error.raise (Exception.ArithmeticError ArithmeticError.OverflowError)
    else
      return? {|
        MAX_VALUE := self.(MAX_VALUE);
        value := result;
      |}.

  Definition wrapping_sub (self right_ : t) : t :=
    let sub := (self.(value) - right_.(value))%Z in
    {|
      MAX_VALUE := self.(MAX_VALUE);
      value := Z.modulo sub self.(MAX_VALUE);
    |}.

  Definition __mul__ (self right_ : t) : M? Exception.t t :=
    let result := (self.(value) * right_.(value))%Z in
    if result >? self.(MAX_VALUE) then
      Error.raise (Exception.ArithmeticError ArithmeticError.OverflowError)
    else
      return? {|
        MAX_VALUE := self.(MAX_VALUE);
        value := result;
      |}.

  Definition wrapping_mul (self right_ : t) : t :=
    let mul := (self.(value) * right_.(value))%Z in
    {|
      MAX_VALUE := self.(MAX_VALUE);
      value := Z.modulo mul self.(MAX_VALUE);
    |}.

  Definition bit_and (self right_ : t) : t :=
    let x := self.(value)%Z in
    let y := right_.(value)%Z in
    {|
      MAX_VALUE := self.(MAX_VALUE);
      value := Z.land x y;
    |}.

  Definition bit_or (self right_ : t) : t :=
    let x := self.(value)%Z in
    let y := right_.(value)%Z in
    {|
      MAX_VALUE := self.(MAX_VALUE);
      value := Z.lor x y;
    |}.

  Definition bit_xor (self right_ : t) : t :=
    let x := self.(value)%Z in
    let y := right_.(value)%Z in
    {|
      MAX_VALUE := self.(MAX_VALUE);
      value := Z.lxor x y;
    |}.

  Definition bit_not (self : t) : t :=
    let x := self.(value)%Z in
    {|
      MAX_VALUE := self.(MAX_VALUE);
      value := Z.lnot x;
    |}.
End FixedUint.

Module U256.
  Inductive t : Set :=
  | Make (value : FixedUint.t).

  Definition of_Z (value : Z) : t :=
    Make {|
      FixedUint.MAX_VALUE := 2^256 - 1;
      FixedUint.value := value;
    |}.

  Definition get (value : t) : FixedUint.t :=
    let 'Make value := value in
    value.

  Definition to_Z (value : t) : Z :=
    FixedUint.value (get value).

  Definition to_value (value : t) : Value.t :=
    Value.Make globals "U256" (Pointer.Imm (Object.wrapper (Data.Integer (to_Z value)))).

  Definition MAX_VALUE : t := U256.of_Z (2^256 - 1).

  Definition __add__ (self right_ : t) : M? Exception.t t :=
    let? result := FixedUint.__add__ (get self) (get right_) in
    return? (Make result).

  Definition wrapping_add (self right_ : t) : t :=
    Make (FixedUint.wrapping_add (get self) (get right_)).

  Definition __sub__ (self right_ : t) : M? Exception.t t :=
    let? result := FixedUint.__sub__ (get self) (get right_) in
    return? (Make result).

  Definition wrapping_sub (self right_ : t) : t :=
    Make (FixedUint.wrapping_sub (get self) (get right_)).

  Definition __mul__ (self right_ : t) : M? Exception.t t :=
    let? result := FixedUint.__mul__ (get self) (get right_) in
    return? (Make result).

  Definition wrapping_mul (self right_ : t) : t :=
    Make (FixedUint.wrapping_mul (get self) (get right_)).

  Definition bit_and (self right_ : t) : t :=
    Make (FixedUint.bit_and (get self) (get right_)).

  Definition bit_or (self right_ : t) : t :=
    Make (FixedUint.bit_or (get self) (get right_)).

  Definition bit_xor (self right_ : t) : t :=
    Make (FixedUint.bit_xor (get self) (get right_)).

  Definition bit_not (self : t) : t :=
    Make (FixedUint.bit_not (get self)).
  (*  
  def from_signed(cls: Type, value: int) -> "U256":
      """
      Creates an unsigned integer representing `value` using two's
      complement.
      """
      if value >= 0:
          return cls(value)

      return cls(value & cls.MAX_VALUE)
  *)  
  (* NOTE: for now we ignore the cls here *)  
  Definition from_signed (self : t) : t :=
    let value := U256.to_Z self in
    if value >=? 0 
    then (U256.of_Z value)
    (* TODO: here 2^256 - 1 should be the max value of the corresponded class.
       To be modified in the future. *)
    else (U256.of_Z (Z.land value (2^256 - 1))).
End U256.

Module U32.
  Inductive t : Set :=
  | Make (value : FixedUint.t).

  Definition of_Z (value : Z) : t :=
    Make {|
      FixedUint.MAX_VALUE := 2^32 - 1;
      FixedUint.value := value;
    |}.

  Definition get (value : t) : FixedUint.t :=
    match value with
    | Make value => value
    end.
End U32.

Module U64.
  Inductive t : Set :=
  | Make (value : FixedUint.t).

  Definition of_Z (value : Z) : t :=
    Make {|
      FixedUint.MAX_VALUE := 2^64 - 1;
      FixedUint.value := value;
    |}.

  Definition get (value : t) : FixedUint.t :=
    match value with
    | Make value => value
    end.
End U64.

Module FixedBytes.
  Inductive t : Set :=
  | Make (bytes : list ascii).

  Definition get (bytes : t) : list ascii :=
    match bytes with
    | Make bytes => bytes
    end.
End FixedBytes.

Module Bytes0.
  Inductive t : Set :=
  | Make (bytes : FixedBytes.t).

  Definition get (bytes : t) : FixedBytes.t :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes0.

Module Bytes4.
  Inductive t : Set :=
  | Make (bytes : FixedBytes.t).

  Definition get (bytes : t) : FixedBytes.t :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes4.

Module Bytes8.
  Inductive t : Set :=
  | Make (bytes : FixedBytes.t).

  Definition get (bytes : t) : FixedBytes.t :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes8.

Module Bytes20.
  Inductive t : Set :=
  | Make (bytes : FixedBytes.t).

  Definition get (bytes : t) : FixedBytes.t :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes20.

Module Bytes32.
  Inductive t : Set :=
  | Make (bytes : FixedBytes.t).

  Definition get (bytes : t) : FixedBytes.t :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes32.

Module Bytes48.
  Inductive t : Set :=
  | Make (bytes : FixedBytes.t).

  Definition get (bytes : t) : FixedBytes.t :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes48.

Module Bytes64.
  Inductive t : Set :=
  | Make (bytes : FixedBytes.t).

  Definition get (bytes : t) : FixedBytes.t :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes64.

Module Bytes256.
  Inductive t : Set :=
  | Make (bytes : FixedBytes.t).

  Definition get (bytes : t) : FixedBytes.t :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes256.

Module Bytes.
  Inductive t : Set :=
  | Make (bytes : list ascii).

  Definition get (bytes : t) : list ascii :=
    match bytes with
    | Make bytes => bytes
    end.
End Bytes.
```
