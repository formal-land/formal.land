"use strict";(self.webpackChunkformal_land=self.webpackChunkformal_land||[]).push([[7054],{2440:(t,e,o)=>{o.r(e),o.d(e,{assets:()=>l,contentTitle:()=>r,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>h});var n=o(4848),a=o(8453);const i={title:"\ud83d\udc0d Simulation of Python code in Coq",tags:["coq-of-python","Python","Coq","translation","Ethereum"],authors:[]},r=void 0,s={permalink:"/blog/2024/05/14/translation-of-python-code-simulations",source:"@site/blog/2024-05-14-translation-of-python-code-simulations.md",title:"\ud83d\udc0d Simulation of Python code in Coq",description:"We are continuing to specify the Ethereum Virtual Machine (EVM) in the formal verification language&nbsp;Coq. We are working from the automatic translation in Coq of the reference implementation of the EVM, which is written in the language Python.",date:"2024-05-14T00:00:00.000Z",formattedDate:"May 14, 2024",tags:[{label:"coq-of-python",permalink:"/blog/tags/coq-of-python"},{label:"Python",permalink:"/blog/tags/python"},{label:"Coq",permalink:"/blog/tags/coq"},{label:"translation",permalink:"/blog/tags/translation"},{label:"Ethereum",permalink:"/blog/tags/ethereum"}],readingTime:6.63,hasTruncateMarker:!0,authors:[],frontMatter:{title:"\ud83d\udc0d Simulation of Python code in Coq",tags:["coq-of-python","Python","Coq","translation","Ethereum"],authors:[]},unlisted:!1,prevItem:{title:"\ud83d\udc0d Simulation of Python code from traces in Coq",permalink:"/blog/2024/05/22/translation-of-python-code-simulations-from-trace"},nextItem:{title:"\ud83d\udc0d Translation of Python code to Coq",permalink:"/blog/2024/05/10/translation-of-python-code"}},l={authorsImageUrls:[]},h=[];function c(t){const e={a:"a",em:"em",p:"p",...(0,a.R)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(e.p,{children:["We are continuing to specify the ",(0,n.jsx)(e.a,{href:"https://ethereum.org/en/developers/docs/evm/",children:"Ethereum Virtual Machine"})," (EVM) in the formal verification language\xa0",(0,n.jsx)(e.a,{href:"https://coq.inria.fr/",children:"Coq"}),". We are working from the ",(0,n.jsx)(e.a,{href:"https://github.com/formal-land/coq-of-python/tree/main/CoqOfPython/ethereum",children:"automatic translation in Coq"})," of the ",(0,n.jsx)(e.a,{href:"https://github.com/ethereum/execution-specs",children:"reference implementation of the EVM"}),", which is written in the language ",(0,n.jsx)(e.a,{href:"https://www.python.org/",children:"Python"}),"."]}),"\n",(0,n.jsxs)(e.p,{children:["In this article, we will see how we specify the EVM in Coq by writing an interpreter that closely mimics the behavior of the Python code. We call that implementation a ",(0,n.jsx)(e.em,{children:"simulation"})," as it aims to reproduce the behavior of the Python code, the reference."]}),"\n",(0,n.jsx)(e.p,{children:"In contrast to the automatic translation from Python, the simulation is a manual translation written in idiomatic Coq. We expect it to be ten times smaller in lines compared to the automatic translation, and of about the same size as the Python code. This is because the automatic translation needs to encode all the Python specific features in Coq, like variable mutations and the class system."}),"\n",(0,n.jsx)(e.p,{children:"In the following article, we will show how we can prove that the simulation is correct, meaning that it behaves exactly as the automatic translation."}),"\n",(0,n.jsxs)(e.p,{children:["The code of this project is open-source and available on GitHub: ",(0,n.jsx)(e.a,{href:"https://github.com/formal-land/coq-of-python",children:"formal-land/coq-of-python"}),". This work follows a call from ",(0,n.jsx)(e.a,{href:"https://en.wikipedia.org/wiki/Vitalik_Buterin",children:"Vitalik Buterin"})," for more formal verification of the Ethereum's code."]})]})}function m(t={}){const{wrapper:e}={...(0,a.R)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(c,{...t})}):c(t)}},8453:(t,e,o)=>{o.d(e,{R:()=>r,x:()=>s});var n=o(6540);const a={},i=n.createContext(a);function r(t){const e=n.useContext(i);return n.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function s(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(a):t.components||a:r(t.components),n.createElement(i.Provider,{value:e},t.children)}}}]);