"use strict";(self.webpackChunkformal_land=self.webpackChunkformal_land||[]).push([[2962],{3072:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var r=o(4848),n=o(8453);const s={title:"\ud83e\udd80 Verification of one instruction of the Move's type-checker",tags:["Rust","Move","Sui","type-checker"],authors:[]},i=void 0,a={permalink:"/blog/2025/01/13/verification-one-instruction-sui",source:"@site/blog/2025-01-13-verification-one-instruction-sui.md",title:"\ud83e\udd80 Verification of one instruction of the Move's type-checker",description:"This is the last article of a series of blog post presenting our formal verification effort in &nbsp;Rocq/Coq to ensure the correctness of the type-checker of the Move language for Sui.",date:"2025-01-13T00:00:00.000Z",formattedDate:"January 13, 2025",tags:[{label:"Rust",permalink:"/blog/tags/rust"},{label:"Move",permalink:"/blog/tags/move"},{label:"Sui",permalink:"/blog/tags/sui"},{label:"type-checker",permalink:"/blog/tags/type-checker"}],readingTime:5.73,hasTruncateMarker:!0,authors:[],frontMatter:{title:"\ud83e\udd80 Verification of one instruction of the Move's type-checker",tags:["Rust","Move","Sui","type-checker"],authors:[]},unlisted:!1,prevItem:{title:"\ud83e\udd16 Designing a coding assistant for Rocq",permalink:"/blog/2025/01/21/designing-a-coding-assistant-for-rocq"},nextItem:{title:"\ud83e\udd16 Annotating what we are doing for an LLM to pick up",permalink:"/blog/2025/01/06/annotating-what-we-are-doing"}},c={authorsImageUrls:[]},l=[];function h(e){const t={a:"a",p:"p",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(t.p,{children:["This is the last article of a series of blog post presenting our formal verification effort in ",(0,r.jsxs)(t.a,{href:"https://rocq-prover.org/",children:[(0,r.jsx)("img",{src:"https://raw.githubusercontent.com/coq/rocq-prover.org/refs/heads/main/rocq-id/logos/SVG/icon-rocq-orange.svg",height:"18px"}),"\xa0Rocq/Coq"]})," to ensure the correctness of the type-checker of the ",(0,r.jsx)(t.a,{href:"https://sui.io/move",children:"Move language"})," for ",(0,r.jsx)(t.a,{href:"https://sui.io/",children:"Sui"}),"."]}),"\n",(0,r.jsx)(t.p,{children:"Here we show how the formal proof works to check that the type-checker is correct on a particular instruction, for any possible initial states. The general idea is to symbolically execute the code step by step on the type-checker side, accumulating properties about the stack assuming the type-checker succeeds, and then to show that the interpreter will produce a stack of the expected type as a result."})]})}function u(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},8453:(e,t,o)=>{o.d(t,{R:()=>i,x:()=>a});var r=o(6540);const n={},s=r.createContext(n);function i(e){const t=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);