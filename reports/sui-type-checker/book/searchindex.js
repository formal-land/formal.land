Object.assign(window.search, {"doc_urls":["index.html#introduction","index.html#general-strategy","01_coq_translation.html#coq-translation","02_tests.html#tests","03_verification.html#verification"],"index":{"documentStore":{"docInfo":{"0":{"body":59,"breadcrumbs":2,"title":1},"1":{"body":97,"breadcrumbs":3,"title":2},"2":{"body":22,"breadcrumbs":4,"title":2},"3":{"body":23,"breadcrumbs":2,"title":1},"4":{"body":49,"breadcrumbs":2,"title":1}},"docs":{"0":{"body":"In this document, we explain our work to formally verify the correctness of the 🦀 Rust implementation of the Move language for the 💧 Sui blockchain . For now, we concentrate on the type-checker of the Move bytecode. Smart contracts are stored as Move bytecode on the blockchain, and several sanity checks are performed on the bytecode before it is executed. The type-checker is one of these checks, and the one that is the most involved. Here are some reference files: The type-checker move-bytecode-verifier/src/type_safety.rs The interpreter of the Move bytecode move-vm-runtime/src/interpreter.rs A README about the list of checks performed on the bytecode crates/move-bytecode-verifier/README.md","breadcrumbs":"Introduction » Introduction","id":"0","title":"Introduction"},"1":{"body":"We use the 🐓 Coq proof assistant for our formal verification effort. With have the tool coq-of-rust which automatically translates Rust programs to Coq, but we are not using it for this project as the generated translation is too verbose. Typically, handling the details of the memory handling, interactions with the standard library, or the traits hierarchy represents too much work. Instead we write a Coq translation by hand of the Rust code of: the type-checker and the interpreter which we test as being equivalent to the Rust code on a set of test cases. Then we verify the following property on the type-checker: Starting from a stack of a type stack_ty, if the function verify_instr of the type-checker is successful, then the function execute_instruction of the interpreter is also successful, with a resulting stack of the type returned by the type-checker. This is not everything we could check but it is a start. Ultimately, we will verify that: If the type-checker is successful, then the interpreter does not run with a critical error. To ensure this property, other checks such as the \"stack safety\" (analysis of the stack height) will be necessary.","breadcrumbs":"Introduction » General strategy","id":"1","title":"General strategy"},"2":{"body":"To get more information about our manual Coq translation of the Rust code of the type-checker and the interpreter of Move, you can read our following blog post: 🦀 Formal verification of the type checker of Sui – part 2 .","breadcrumbs":"Coq Translation » Coq translation","id":"2","title":"Coq translation"},"3":{"body":"To know more about how we verify that our translation of the Rust code of the type-checker in Coq is equivalent to the original code by testing, you can read our blog post 🦀 Formal verification of the type checker of Sui – part 3 .","breadcrumbs":"Tests » Tests","id":"3","title":"Tests"},"4":{"body":"We are currently working on the formal verification of the type checker of the Move bytecode. Here is a blog post explaining the verification of a specific sub-function: 🦀 Example of verification for the Move's checker of Sui . We are focusing on the following property, that we verify for each kind of instruction of the Move bytecode: Starting from a stack of a type stack_ty, if the function verify_instr of the type-checker is successful, then the function execute_instruction of the interpreter is also successful, with a resulting stack of the type returned by the type-checker.","breadcrumbs":"Verification » Verification","id":"4","title":"Verification"}},"length":5,"save":true},"fields":["title","body","breadcrumbs"],"index":{"body":{"root":{"2":{"df":1,"docs":{"2":{"tf":1.0}}},"3":{"df":1,"docs":{"3":{"tf":1.0}}},"a":{"df":0,"docs":{},"n":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"y":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"df":0,"docs":{}},"s":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"u":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}}}}},"b":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"l":{"df":0,"docs":{},"o":{"c":{"df":0,"docs":{},"k":{"c":{"df":0,"docs":{},"h":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":1,"docs":{"0":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}},"df":0,"docs":{},"g":{"df":3,"docs":{"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}}},"y":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"o":{"d":{"df":2,"docs":{"0":{"tf":2.6457513110645907},"4":{"tf":1.4142135623730951}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"c":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{},"h":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"k":{"df":2,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":1.4142135623730951}},"e":{"df":0,"docs":{},"r":{"df":5,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":2.23606797749979},"2":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951},"4":{"tf":2.0}}}}}},"df":0,"docs":{}}},"o":{"d":{"df":0,"docs":{},"e":{"df":3,"docs":{"1":{"tf":1.4142135623730951},"2":{"tf":1.0},"3":{"tf":1.4142135623730951}}}},"df":0,"docs":{},"n":{"c":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}}}}},"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"a":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"q":{"df":3,"docs":{"1":{"tf":2.0},"2":{"tf":1.4142135623730951},"3":{"tf":1.0}}},"r":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}}}},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"/":{"df":0,"docs":{},"m":{"df":0,"docs":{},"o":{"df":0,"docs":{},"v":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"c":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}}}},"u":{"df":0,"docs":{},"r":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}}},"d":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}}},"o":{"c":{"df":0,"docs":{},"u":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"e":{"a":{"c":{"df":0,"docs":{},"h":{"df":1,"docs":{"4":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{},"f":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"q":{"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"v":{"a":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":1.0},"3":{"tf":1.0}}}},"df":0,"docs":{}}}}},"r":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"y":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}},"x":{"a":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":1,"docs":{"4":{"tf":1.0}}}}}},"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"u":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}},"e":{"_":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"p":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":2,"docs":{"0":{"tf":1.0},"4":{"tf":1.0}}}}},"df":0,"docs":{}}}}},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"0":{"tf":1.0}}}}},"o":{"c":{"df":0,"docs":{},"u":{"df":0,"docs":{},"s":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":3,"docs":{"1":{"tf":1.0},"2":{"tf":1.0},"4":{"tf":1.0}}}}}},"r":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"l":{"df":5,"docs":{"0":{"tf":1.0},"1":{"tf":1.0},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}},"df":0,"docs":{}}}},"u":{"df":0,"docs":{},"n":{"c":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"4":{"tf":1.7320508075688772}}}}}}},"df":0,"docs":{}}}},"g":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}}}}}},"h":{"a":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"1":{"tf":1.0}},"l":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}}},"df":0,"docs":{}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"h":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"r":{"df":0,"docs":{},"e":{"df":2,"docs":{"0":{"tf":1.0},"4":{"tf":1.0}}}}},"i":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"r":{"c":{"df":0,"docs":{},"h":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}}}}}}},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"m":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"a":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"r":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"4":{"tf":1.0}}}},"df":0,"docs":{}}}}},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"a":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{},"p":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":4,"docs":{"0":{"tf":1.0},"1":{"tf":1.7320508075688772},"2":{"tf":1.0},"4":{"tf":1.0}}}}}}}},"r":{"df":0,"docs":{},"o":{"d":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}},"v":{"df":0,"docs":{},"o":{"df":0,"docs":{},"l":{"df":0,"docs":{},"v":{"df":1,"docs":{"0":{"tf":1.0}}}}}}}},"k":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}}},"n":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":1,"docs":{"3":{"tf":1.0}}}}}},"l":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"u":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}}}},"df":0,"docs":{},"i":{"b":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"m":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"u":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"m":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":2,"docs":{"2":{"tf":1.0},"3":{"tf":1.0}}}},"v":{"df":0,"docs":{},"e":{"'":{"df":1,"docs":{"4":{"tf":1.0}}},"df":3,"docs":{"0":{"tf":2.449489742783178},"2":{"tf":1.0},"4":{"tf":1.4142135623730951}}}}},"u":{"c":{"df":0,"docs":{},"h":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"n":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"o":{"df":0,"docs":{},"w":{"df":1,"docs":{"0":{"tf":1.0}}}}},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"0":{"tf":1.4142135623730951}}},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":1,"docs":{"3":{"tf":1.0}}}}}}}},"p":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":2,"docs":{"2":{"tf":1.0},"3":{"tf":1.0}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"m":{"df":1,"docs":{"0":{"tf":1.4142135623730951}}}}}}}},"o":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":3,"docs":{"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}}},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"g":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"m":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"j":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"o":{"df":0,"docs":{},"f":{"df":1,"docs":{"1":{"tf":1.0}}}},"p":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"4":{"tf":1.0}}}}}}}}}},"r":{"df":0,"docs":{},"e":{"a":{"d":{"df":2,"docs":{"2":{"tf":1.0},"3":{"tf":1.0}},"m":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{},"f":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}}},"p":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"s":{"df":0,"docs":{},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}},"t":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"df":0,"docs":{},"n":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}}},"u":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.0}},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"/":{"df":0,"docs":{},"s":{"df":0,"docs":{},"r":{"c":{"/":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"p":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{".":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}},"s":{"df":0,"docs":{},"t":{"df":4,"docs":{"0":{"tf":1.0},"1":{"tf":2.0},"2":{"tf":1.0},"3":{"tf":1.0}}}}}},"s":{"a":{"df":0,"docs":{},"f":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":1,"docs":{"0":{"tf":1.0}}}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"m":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}},"df":0,"docs":{}},"p":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"i":{"df":0,"docs":{},"f":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}}},"t":{"a":{"c":{"df":0,"docs":{},"k":{"_":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}},"df":2,"docs":{"1":{"tf":2.0},"4":{"tf":1.4142135623730951}}}},"df":0,"docs":{},"n":{"d":{"a":{"df":0,"docs":{},"r":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"r":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"4":{"tf":1.0}}}}},"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":1,"docs":{"0":{"tf":1.0}}}}},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"df":0,"docs":{}}},"u":{"b":{"df":1,"docs":{"4":{"tf":1.0}}},"c":{"c":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":2,"docs":{"1":{"tf":1.7320508075688772},"4":{"tf":1.4142135623730951}}}}}},"df":0,"docs":{},"h":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{},"i":{"df":4,"docs":{"0":{"tf":1.0},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}}},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951}}}}},"o":{"df":0,"docs":{},"o":{"df":0,"docs":{},"l":{"df":1,"docs":{"1":{"tf":1.0}}}}},"r":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"t":{"df":3,"docs":{"1":{"tf":1.7320508075688772},"2":{"tf":1.4142135623730951},"3":{"tf":1.0}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"y":{"df":0,"docs":{},"p":{"df":0,"docs":{},"e":{"df":5,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":2.6457513110645907},"2":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951},"4":{"tf":2.23606797749979}}},"i":{"c":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}}}},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"s":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"b":{"df":0,"docs":{},"o":{"df":0,"docs":{},"s":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"f":{"df":4,"docs":{"1":{"tf":1.0},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":2.0}},"i":{"df":4,"docs":{"0":{"tf":1.0},"1":{"tf":1.4142135623730951},"3":{"tf":1.0},"4":{"tf":1.0}},"e":{"df":0,"docs":{},"r":{"/":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"a":{"d":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{".":{"df":0,"docs":{},"m":{"d":{"df":1,"docs":{"0":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"s":{"df":0,"docs":{},"r":{"c":{"/":{"df":0,"docs":{},"t":{"df":0,"docs":{},"y":{"df":0,"docs":{},"p":{"df":0,"docs":{},"e":{"_":{"df":0,"docs":{},"s":{"a":{"df":0,"docs":{},"f":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":0,"docs":{},"y":{".":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}},"y":{"_":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}}}},"df":0,"docs":{}}}}}},"m":{"df":1,"docs":{"0":{"tf":1.0}}}},"w":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"k":{"df":3,"docs":{"0":{"tf":1.0},"1":{"tf":1.0},"4":{"tf":1.0}}}}},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}}},"breadcrumbs":{"root":{"2":{"df":1,"docs":{"2":{"tf":1.0}}},"3":{"df":1,"docs":{"3":{"tf":1.0}}},"a":{"df":0,"docs":{},"n":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"y":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"df":0,"docs":{}},"s":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"u":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}}}}},"b":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"l":{"df":0,"docs":{},"o":{"c":{"df":0,"docs":{},"k":{"c":{"df":0,"docs":{},"h":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":1,"docs":{"0":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}},"df":0,"docs":{},"g":{"df":3,"docs":{"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}}},"y":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"o":{"d":{"df":2,"docs":{"0":{"tf":2.6457513110645907},"4":{"tf":1.4142135623730951}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"c":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{},"h":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"k":{"df":2,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":1.4142135623730951}},"e":{"df":0,"docs":{},"r":{"df":5,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":2.23606797749979},"2":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951},"4":{"tf":2.0}}}}}},"df":0,"docs":{}}},"o":{"d":{"df":0,"docs":{},"e":{"df":3,"docs":{"1":{"tf":1.4142135623730951},"2":{"tf":1.0},"3":{"tf":1.4142135623730951}}}},"df":0,"docs":{},"n":{"c":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}}}}},"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"a":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"q":{"df":3,"docs":{"1":{"tf":2.0},"2":{"tf":2.0},"3":{"tf":1.0}}},"r":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}}}},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"/":{"df":0,"docs":{},"m":{"df":0,"docs":{},"o":{"df":0,"docs":{},"v":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"c":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}}}},"u":{"df":0,"docs":{},"r":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}}},"d":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}}},"o":{"c":{"df":0,"docs":{},"u":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"e":{"a":{"c":{"df":0,"docs":{},"h":{"df":1,"docs":{"4":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{},"f":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"q":{"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"v":{"a":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":1.0},"3":{"tf":1.0}}}},"df":0,"docs":{}}}}},"r":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"y":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}},"x":{"a":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":1,"docs":{"4":{"tf":1.0}}}}}},"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"u":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}},"e":{"_":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"p":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":2,"docs":{"0":{"tf":1.0},"4":{"tf":1.0}}}}},"df":0,"docs":{}}}}},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"0":{"tf":1.0}}}}},"o":{"c":{"df":0,"docs":{},"u":{"df":0,"docs":{},"s":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":3,"docs":{"1":{"tf":1.0},"2":{"tf":1.0},"4":{"tf":1.0}}}}}},"r":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"l":{"df":5,"docs":{"0":{"tf":1.0},"1":{"tf":1.0},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}},"df":0,"docs":{}}}},"u":{"df":0,"docs":{},"n":{"c":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"4":{"tf":1.7320508075688772}}}}}}},"df":0,"docs":{}}}},"g":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.7320508075688772}}}}}}},"h":{"a":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"1":{"tf":1.0}},"l":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}}},"df":0,"docs":{}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"h":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"r":{"df":0,"docs":{},"e":{"df":2,"docs":{"0":{"tf":1.0},"4":{"tf":1.0}}}}},"i":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"r":{"c":{"df":0,"docs":{},"h":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}}}}}}},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"m":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"a":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"r":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"4":{"tf":1.0}}}},"df":0,"docs":{}}}}},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"a":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{},"p":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":4,"docs":{"0":{"tf":1.0},"1":{"tf":1.7320508075688772},"2":{"tf":1.0},"4":{"tf":1.0}}}}}}}},"r":{"df":0,"docs":{},"o":{"d":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":2,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}},"v":{"df":0,"docs":{},"o":{"df":0,"docs":{},"l":{"df":0,"docs":{},"v":{"df":1,"docs":{"0":{"tf":1.0}}}}}}}},"k":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}}},"n":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":1,"docs":{"3":{"tf":1.0}}}}}},"l":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"u":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}}}},"df":0,"docs":{},"i":{"b":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"m":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"u":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"m":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":2,"docs":{"2":{"tf":1.0},"3":{"tf":1.0}}}},"v":{"df":0,"docs":{},"e":{"'":{"df":1,"docs":{"4":{"tf":1.0}}},"df":3,"docs":{"0":{"tf":2.449489742783178},"2":{"tf":1.0},"4":{"tf":1.4142135623730951}}}}},"u":{"c":{"df":0,"docs":{},"h":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"n":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"o":{"df":0,"docs":{},"w":{"df":1,"docs":{"0":{"tf":1.0}}}}},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"0":{"tf":1.4142135623730951}}},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":1,"docs":{"3":{"tf":1.0}}}}}}}},"p":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":2,"docs":{"2":{"tf":1.0},"3":{"tf":1.0}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"m":{"df":1,"docs":{"0":{"tf":1.4142135623730951}}}}}}}},"o":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":3,"docs":{"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}}},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"g":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"m":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"j":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"o":{"df":0,"docs":{},"f":{"df":1,"docs":{"1":{"tf":1.0}}}},"p":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"4":{"tf":1.0}}}}}}}}}},"r":{"df":0,"docs":{},"e":{"a":{"d":{"df":2,"docs":{"2":{"tf":1.0},"3":{"tf":1.0}},"m":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{},"f":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}}},"p":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"s":{"df":0,"docs":{},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}},"t":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"df":0,"docs":{},"n":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}}},"u":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.0}},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"/":{"df":0,"docs":{},"s":{"df":0,"docs":{},"r":{"c":{"/":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"p":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{".":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}},"s":{"df":0,"docs":{},"t":{"df":4,"docs":{"0":{"tf":1.0},"1":{"tf":2.0},"2":{"tf":1.0},"3":{"tf":1.0}}}}}},"s":{"a":{"df":0,"docs":{},"f":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":1,"docs":{"0":{"tf":1.0}}}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}}}},"m":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}}},"df":0,"docs":{}},"p":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"i":{"df":0,"docs":{},"f":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}}},"t":{"a":{"c":{"df":0,"docs":{},"k":{"_":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}},"df":2,"docs":{"1":{"tf":2.0},"4":{"tf":1.4142135623730951}}}},"df":0,"docs":{},"n":{"d":{"a":{"df":0,"docs":{},"r":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"r":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"4":{"tf":1.0}}}}},"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":1,"docs":{"0":{"tf":1.0}}}}},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}}}}}},"df":0,"docs":{}}},"u":{"b":{"df":1,"docs":{"4":{"tf":1.0}}},"c":{"c":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":2,"docs":{"1":{"tf":1.7320508075688772},"4":{"tf":1.4142135623730951}}}}}},"df":0,"docs":{},"h":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{},"i":{"df":4,"docs":{"0":{"tf":1.0},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}}},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"3":{"tf":2.0}}}}},"o":{"df":0,"docs":{},"o":{"df":0,"docs":{},"l":{"df":1,"docs":{"1":{"tf":1.0}}}}},"r":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"t":{"df":3,"docs":{"1":{"tf":1.7320508075688772},"2":{"tf":2.0},"3":{"tf":1.0}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"y":{"df":0,"docs":{},"p":{"df":0,"docs":{},"e":{"df":5,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":2.6457513110645907},"2":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951},"4":{"tf":2.23606797749979}}},"i":{"c":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}}}},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":1,"docs":{"1":{"tf":1.0}}}}}},"s":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"b":{"df":0,"docs":{},"o":{"df":0,"docs":{},"s":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"f":{"df":4,"docs":{"1":{"tf":1.0},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":2.449489742783178}},"i":{"df":4,"docs":{"0":{"tf":1.0},"1":{"tf":1.4142135623730951},"3":{"tf":1.0},"4":{"tf":1.0}},"e":{"df":0,"docs":{},"r":{"/":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"a":{"d":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{".":{"df":0,"docs":{},"m":{"d":{"df":1,"docs":{"0":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"s":{"df":0,"docs":{},"r":{"c":{"/":{"df":0,"docs":{},"t":{"df":0,"docs":{},"y":{"df":0,"docs":{},"p":{"df":0,"docs":{},"e":{"_":{"df":0,"docs":{},"s":{"a":{"df":0,"docs":{},"f":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":0,"docs":{},"y":{".":{"df":0,"docs":{},"r":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}},"y":{"_":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}}}},"df":0,"docs":{}}}}}},"m":{"df":1,"docs":{"0":{"tf":1.0}}}},"w":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"k":{"df":3,"docs":{"0":{"tf":1.0},"1":{"tf":1.0},"4":{"tf":1.0}}}}},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}}},"title":{"root":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"q":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{},"g":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"d":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"0":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"df":0,"docs":{}}}},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"3":{"tf":1.0}}}}},"r":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"f":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}}}},"lang":"English","pipeline":["trimmer","stopWordFilter","stemmer"],"ref":"id","version":"0.9.5"},"results_options":{"limit_results":30,"teaser_word_count":30},"search_options":{"bool":"OR","expand":true,"fields":{"body":{"boost":1},"breadcrumbs":{"boost":1},"title":{"boost":2}}}});