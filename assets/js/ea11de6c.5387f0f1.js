"use strict";(self.webpackChunkformal_land=self.webpackChunkformal_land||[]).push([[5927],{4564:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>f,frontMatter:()=>n,metadata:()=>s,toc:()=>c});var i=o(4848),r=o(8453);const n={title:"\ud83e\udea8 Coq of Solidity \u2013 part 2",tags:["formal verification","Coq","Solidity","Yul"],authors:[]},a=void 0,s={permalink:"/blog/2024/08/07/coq-of-solidity-2",source:"@site/blog/2024-08-07-coq-of-solidity-2.md",title:"\ud83e\udea8 Coq of Solidity \u2013 part 2",description:"We continue to work on our open source formal verification tool for Solidity named coq-of-solidity \ud83d\udee0\ufe0f. Formal verification is the strongest form of code audits, as we verify that the code behaves correctly in all possible execution cases \ud83d\udd0d. We use the interactive theorem prover Coq to express and verify any kinds of properties.",date:"2024-08-07T00:00:00.000Z",formattedDate:"August 7, 2024",tags:[{label:"formal verification",permalink:"/blog/tags/formal-verification"},{label:"Coq",permalink:"/blog/tags/coq"},{label:"Solidity",permalink:"/blog/tags/solidity"},{label:"Yul",permalink:"/blog/tags/yul"}],readingTime:6.36,hasTruncateMarker:!0,authors:[],frontMatter:{title:"\ud83e\udea8 Coq of Solidity \u2013 part 2",tags:["formal verification","Coq","Solidity","Yul"],authors:[]},unlisted:!1,prevItem:{title:"\ud83e\udea8 Coq of Solidity \u2013 part 3",permalink:"/blog/2024/08/12/coq-of-solidity-3"},nextItem:{title:"\ud83e\udea8 Coq of Solidity \u2013 part 1",permalink:"/blog/2024/06/28/coq-of-solidity-1"}},l={authorsImageUrls:[]},c=[];function d(e){const t={a:"a",p:"p",strong:"strong",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.p,{children:["We continue to work on our open source ",(0,i.jsx)(t.strong,{children:"formal verification"})," tool for ",(0,i.jsx)(t.a,{href:"https://soliditylang.org/",children:"Solidity"})," named ",(0,i.jsx)(t.a,{href:"https://github.com/formal-land/solidity",children:"coq-of-solidity"})," \ud83d\udee0\ufe0f. Formal verification is the strongest form of code audits, as we verify that the code behaves correctly in all possible execution cases \ud83d\udd0d. We use the ",(0,i.jsx)(t.strong,{children:"interactive theorem prover"})," ",(0,i.jsx)(t.a,{href:"https://coq.inria.fr/",children:"Coq"})," to express and verify any kinds of properties."]}),"\n",(0,i.jsxs)(t.p,{children:["We work by translating the ",(0,i.jsx)(t.a,{href:"https://docs.soliditylang.org/en/latest/yul.html",children:"Yul"})," version of a smart contract to the formal language Coq\xa0\ud83d\udc13, in which we then express the code specifications/security properties and formally verify them \ud83d\udd04. The Yul language is an intermediate language used by the Solidity compiler and others to generate EVM bytecode. Yul is simpler than Solidity and at a higher level than the EVM bytecode, making it a good target for formal verification."]}),"\n",(0,i.jsx)(t.p,{children:"In this blog post we present the recent developments we made to simplify the reasoning \ud83e\udde0 about Yul programs once translated in Coq."})]})}function f(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,t,o)=>{o.d(t,{R:()=>a,x:()=>s});var i=o(6540);const r={},n=i.createContext(r);function a(e){const t=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(n.Provider,{value:t},e.children)}}}]);