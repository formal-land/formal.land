# 🌐 TypeScript verification

[📽️&nbsp;Demo&nbsp;<svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>](https://formal-land.github.io/coq-of-js/)

Our goal is to bring **formal verification&nbsp;🛡️** to [TypeScript](https://www.typescriptlang.org/) in the same way TypeScript brings **typing to JavaScript**.

[Formal verification](https://en.wikipedia.org/wiki/Formal_verification) is a **strong method** to ensure that code does not contain bugs or security issues&nbsp;🧨 and improve the QA process. This is thanks to the use of **mathematical methods&nbsp;📐**. With formal verification, we can probably hope to **divide by one hundred** the number of bugs on a code that is already well-typed and tested. If the verification is cost-effective enough, we can apply it on a large class of programs to improve the **quality of existing software&nbsp;🌟**.

Our strategy is to consider a convenient subset of TypeScript (essentially a purely functional subset) and make an automatic translation to similar-looking Rocq code. The [Rocq&nbsp;🐓](https://rocq-prover.org/) system is an interactive proof assistant that allows to verify arbitrary specifications on programs, either automatically or with manual guidance. Our translation to Rocq might or might not be 100% faithful. The goal is to be efficient even if we need some approximations.

We have two projects:
1. [coq-of-js](https://github.com/formal-land/coq-of-js) to translate JavaScript code to Rocq using the [Babel](https://babeljs.io/) parser. You can try it with our [📽️&nbsp;demo&nbsp;<svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>](https://formal-land.github.io/coq-of-js/) where you type JavaScript code on the left and see the Rocq translation on the right. This works on untyped JavaScript. However it seems some type information would be helpful for the translation, so we are now directly targeting the translation of TypeScript (instead of untyped JavaScript).
2. [coq-of-ts](https://github.com/formal-land/coq-of-ts) to translate TypeScript code to Rocq, using the TypeScript compiler API. This follows the `coq-of-js` project and is under development.

:::tip Offer
For any additional information or service request, if you have code to **verify** or to **develop**, contact us:
* by email at [&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;](mailto:&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;)&nbsp;✉️
* with a call on [koalendar.com/e/meet-with-formal-land](https://koalendar.com/e/meet-with-formal-land)&nbsp;☎️
:::

<!-- > The more you are demanding, the more you need us 🏇. -->
> Helping you build&nbsp;🚀
