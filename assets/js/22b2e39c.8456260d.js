"use strict";(self.webpackChunkformal_land=self.webpackChunkformal_land||[]).push([[5275],{8211:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>a,contentTitle:()=>s,default:()=>d,frontMatter:()=>n,metadata:()=>l,toc:()=>c});var i=o(4848),r=o(8453);const n={title:"\ud83e\ude81 Coq of Solidity \u2013 part 3",tags:["formal verification","Coq","Solidity","Yul"],authors:[]},s=void 0,l={permalink:"/blog/2024/08/12/coq-of-solidity-3",source:"@site/blog/2024-08-12-coq-of-solidity-3.md",title:"\ud83e\ude81 Coq of Solidity \u2013 part 3",description:"We continue to strengthen the security of smart contracts with our tool coq-of-solidity \ud83d\udee0\ufe0f. It checks for vulnerabilities or bugs in Solidity code. It uses formal verification with an interactive theorem prover (Coq&nbsp;\ud83d\udc13) to make sure that we cover:",date:"2024-08-12T00:00:00.000Z",formattedDate:"August 12, 2024",tags:[{label:"formal verification",permalink:"/blog/tags/formal-verification"},{label:"Coq",permalink:"/blog/tags/coq"},{label:"Solidity",permalink:"/blog/tags/solidity"},{label:"Yul",permalink:"/blog/tags/yul"}],readingTime:10.83,hasTruncateMarker:!0,authors:[],frontMatter:{title:"\ud83e\ude81 Coq of Solidity \u2013 part 3",tags:["formal verification","Coq","Solidity","Yul"],authors:[]},unlisted:!1,prevItem:{title:"\ud83e\ude81 Coq of Solidity \u2013 part 4",permalink:"/blog/2024/08/13/coq-of-solidity-4"},nextItem:{title:"\ud83e\ude81 Coq of Solidity \u2013 part 2",permalink:"/blog/2024/08/07/coq-of-solidity-2"}},a={authorsImageUrls:[]},c=[];function h(e){const t={a:"a",code:"code",li:"li",p:"p",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.p,{children:["We continue to strengthen the security of smart contracts with our tool ",(0,i.jsx)(t.a,{href:"https://github.com/formal-land/coq-of-solidity",children:"coq-of-solidity"})," \ud83d\udee0\ufe0f. It checks for vulnerabilities or bugs in ",(0,i.jsx)(t.a,{href:"https://soliditylang.org/",children:"Solidity"})," code. It uses formal verification with an interactive theorem prover (",(0,i.jsx)(t.a,{href:"https://coq.inria.fr/",children:"Coq\xa0\ud83d\udc13"}),") to make sure that we cover:"]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"all possible user inputs/storage states, even if there are infinite possibilities,"}),"\n",(0,i.jsx)(t.li,{children:"for any security properties."}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"This is very important as a single bug can lead to the loss of millions of dollars in smart contracts, as we have regularly seen in the past, and we can never be sure that a human review of the code did not miss anything."}),"\n",(0,i.jsxs)(t.p,{children:["Our tool ",(0,i.jsx)(t.code,{children:"coq-of-solidity"})," is one of the only tools using an interactive theorem prover for Solidity, together with ",(0,i.jsx)(t.a,{href:"https://github.com/NethermindEth/Clear",children:"Clear"})," from ",(0,i.jsx)(t.a,{href:"https://www.nethermind.io/",children:"Nethermind"}),". This might be the most powerful approach to making code without bugs, as exemplified in this ",(0,i.jsx)(t.a,{href:"https://users.cs.utah.edu/~regehr/papers/pldi11-preprint.pdf",children:"PLDI paper"})," comparing the reliability of various C compilers. They found numerous bugs in each compiler except in the ",(0,i.jsx)(t.a,{href:"https://github.com/AbsInt/CompCert",children:"formally verified one"}),"!"]}),"\n",(0,i.jsxs)(t.p,{children:["In this blog post we show how we functionally specify and verify the ",(0,i.jsx)(t.code,{children:"_approve"})," function of an ",(0,i.jsx)(t.a,{href:"https://github.com/ethereum/solidity/blob/develop/test/libsolidity/semanticTests/various/erc20.sol",children:"ERC-20 smart contract"}),". We will see how we prove that a refined version of the function is equivalent to the original one."]})]})}function d(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},8453:(e,t,o)=>{o.d(t,{R:()=>s,x:()=>l});var i=o(6540);const r={},n=i.createContext(r);function s(e){const t=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),i.createElement(n.Provider,{value:t},e.children)}}}]);