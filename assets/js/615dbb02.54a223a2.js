"use strict";(self.webpackChunkformal_land=self.webpackChunkformal_land||[]).push([[1377],{3351:(t,e,o)=>{o.r(e),o.d(e,{assets:()=>l,contentTitle:()=>s,default:()=>f,frontMatter:()=>a,metadata:()=>i,toc:()=>u});var r=o(4848),n=o(8453);const a={title:"\ud83e\udd80 Trait representation in Coq",tags:["coq-of-rust","Rust","Coq","trait"],author:"Bart\u0142omiej Kr\xf3likowski"},s=void 0,i={permalink:"/blog/2023/08/25/trait-representation-in-coq",source:"@site/blog/2023-08-25-trait-representation-in-coq.md",title:"\ud83e\udd80 Trait representation in Coq",description:"In our project coq-of-rust we translate programs written in Rust to equivalent programs in the language of the proof system Coq&nbsp;\ud83d\udc13, which will later allow us to formally verify them.",date:"2023-08-25T00:00:00.000Z",formattedDate:"August 25, 2023",tags:[{label:"coq-of-rust",permalink:"/blog/tags/coq-of-rust"},{label:"Rust",permalink:"/blog/tags/rust"},{label:"Coq",permalink:"/blog/tags/coq"},{label:"trait",permalink:"/blog/tags/trait"}],readingTime:7.58,hasTruncateMarker:!0,authors:[{name:"Bart\u0142omiej Kr\xf3likowski"}],frontMatter:{title:"\ud83e\udd80 Trait representation in Coq",tags:["coq-of-rust","Rust","Coq","trait"],author:"Bart\u0142omiej Kr\xf3likowski"},unlisted:!1,prevItem:{title:"\ud83e\udd80 Optimizing Rust translation to Coq with THIR and bundled traits",permalink:"/blog/2023/11/08/rust-thir-and-bundled-traits"},nextItem:{title:"\ud83e\udd80 Monad for side effects in Rust",permalink:"/blog/2023/05/28/monad-for-side-effects-in-rust"}},l={authorsImageUrls:[void 0]},u=[];function c(t){const e={a:"a",p:"p",...(0,n.R)(),...t.components};return(0,r.jsxs)(e.p,{children:["In our project ",(0,r.jsx)(e.a,{href:"https://github.com/formal-land/coq-of-rust",children:"coq-of-rust"})," we translate programs written in ",(0,r.jsx)(e.a,{href:"https://www.rust-lang.org/",children:"Rust"})," to equivalent programs in the language of the proof system ",(0,r.jsx)(e.a,{href:"https://coq.inria.fr/",children:"Coq\xa0\ud83d\udc13"}),", which will later allow us to formally verify them.\nBoth Coq and Rust have many unique features, and there are many differences between them, so in the process of translation we need to treat the case of each language construction separately.\nIn this post, we discuss how we translate the most complicated one: ",(0,r.jsx)(e.a,{href:"https://doc.rust-lang.org/book/ch10-02-traits.html",children:"traits"}),"."]})}function f(t={}){const{wrapper:e}={...(0,n.R)(),...t.components};return e?(0,r.jsx)(e,{...t,children:(0,r.jsx)(c,{...t})}):c(t)}},8453:(t,e,o)=>{o.d(e,{R:()=>s,x:()=>i});var r=o(6540);const n={},a=r.createContext(n);function s(t){const e=r.useContext(a);return r.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function i(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(n):t.components||n:s(t.components),r.createElement(a.Provider,{value:e},t.children)}}}]);