# 👑 Audits

We propose **code audits** with **formal verification** for **Solidity/Rust/Go** projects as a **subscription**. Formal verification offers the highest quality of audit as it covers all possible code executions for a given specification.

We use an interactive theorem prover, [Coq&nbsp;🐓](https://coq.inria.fr/), to make sure we can express and **verify any user specifications**. We **verify the actual code** that will then be deployed in production thanks to tools automatically translating your code to the Coq proof system.

We design our verifications so that it can **follow code changes** without having to re-verify everything. This is a **huge advantage** over traditional audits. The formal specifications and proofs can then be integrated into a CI to make sure your code stays fully correct&nbsp;🔄.

All our tools are **open source** so that you can also use them by yourself. We encourage other auditors to use our tools too, as formal verification with interactive theorem provers can **verify any properties on all execution cases**. This is thus very possibly the strongest method to find bugs&nbsp;🥇. The tradeoff is that it requires to be knowledgeable in an interactive theorem prover, Coq for us.

The price for our audit subscription is **$30,000 per month**[^1], for a team of **a few engineers** available full time for your project to **specify and formally verify your code**. The first month is always free and you can stop at any time. We refund one year back in time if a critical vulnerability is still found!

Contact us on [📧 &#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:contact@formal.land) to get started!

[^1]: We took inspiration from the pricing of [Runtime Verification](https://runtimeverification.com/).
