"use strict";(self.webpackChunkformal_land=self.webpackChunkformal_land||[]).push([[4583],{8501:(e,t,i)=>{i.r(t),i.d(t,{default:()=>p});i(6540);function o(e){var t,i,s="";if("string"==typeof e||"number"==typeof e)s+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(i=o(e[t]))&&(s&&(s+=" "),s+=i);else for(t in e)e[t]&&(s&&(s+=" "),s+=t);return s}const s=function(){for(var e,t,i=0,s="";i<arguments.length;)(e=arguments[i++])&&(t=o(e))&&(s&&(s+=" "),s+=t);return s};var r=i(781),n=i(8774),a=i(4586);const l={heroBanner:"heroBanner_qdFl",buttons:"buttons_AeoN",hero__button:"hero__button_At_c",hero__container:"hero__container_CovH",hero__title:"hero__title_sobY",glow:"glow_rLah",hero__subtitle:"hero__subtitle_AUTZ",hero__subsubtitle:"hero__subsubtitle_yuZD",onlyDesktop:"onlyDesktop_mEGl",container:"container_bfhl"},c={features:"features_xdhU",featureImg:"featureImg_IxXR"};var h=i(4848);const d=[{title:"Solidity verification",image:"img/icons/water.png",imageNight:"img/icons/wolf-night.png",description:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)("p",{children:["We provide a formal verification tool for ",(0,h.jsx)("a",{href:"https://soliditylang.org/",children:"Solidity"})," called ",(0,h.jsx)("a",{href:"https://github.com/formal-land/coq-of-solidity",children:"coq-of-solidity"}),". You can now express and verify any property about a smart contract using the proof assistant\xa0",(0,h.jsx)("a",{href:"https://coq.inria.fr/",children:"Coq"}),"\xa0\ud83d\udc13."]}),(0,h.jsxs)("p",{children:["With ",(0,h.jsx)("code",{children:"coq-of-solidity"}),", you can ",(0,h.jsx)("strong",{children:"prove the absence of bugs"})," in your code and go further than with code audits. This tool is open-source, and we can help you set it up on your project."]})]})},{title:"Rust verification",image:"img/icons/hills.png",imageNight:"img/icons/hills-night.png",description:(0,h.jsxs)("p",{children:["We developed an open-source formal verification tool for Rust\xa0\ud83e\udd80 ",(0,h.jsx)("a",{href:"https://github.com/formal-land/coq-of-rust",children:"coq-of-rust"})," with the cryptocurrency ",(0,h.jsx)("a",{href:"https://alephzero.org/",children:"Aleph Zero"}),"\xa0\ud83d\udd17. You can now very arbitrarily large Rust programs, thanks to the use of the interactive theorem prover ",(0,h.jsx)("a",{href:"https://coq.inria.fr/",children:"Coq"}),"\xa0\ud83d\udc13 and our support of the ",(0,h.jsx)(n.A,{to:"/blog/2024/04/26/translation-core-alloc-crates",children:"Rust's standard library"}),".",(0,h.jsx)("br",{}),"We are now improving our reasoning principles for Rust, in order to make the verification process more efficient\xa0\ud83c\udfce\ufe0f."]})},{title:"EVM implementation",image:"img/icons/canyon.png",imageNight:"img/icons/canyon-night.png",description:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("p",{children:"To add more trust to the L2s built on top of Ethereum, we are proving the equivalence of the two EVM implementations:"}),(0,h.jsxs)("ul",{style:{listStylePosition:"inside",paddingLeft:0,marginTop:20},children:[(0,h.jsxs)("li",{children:[(0,h.jsx)("a",{href:"https://github.com/bluealloy/revm",children:"revm"})," in Rust\xa0\ud83e\udd80"]}),(0,h.jsxs)("li",{children:[(0,h.jsx)("a",{href:"https://github.com/ethereum/execution-specs",children:"execution-specs"})," in Python\xa0\ud83d\udc0d"]})]}),(0,h.jsxs)("p",{children:["This work relies on our tools ",(0,h.jsx)("a",{href:"https://github.com/formal-land/coq-of-rust",children:"coq-of-rust"})," and ",(0,h.jsx)("a",{href:"https://github.com/formal-land/coq-of-python",children:"coq-of-python"}),"."]})]})},{title:"L1 of Tezos",image:"img/icons/river.png",imageNight:"img/icons/river-night.png",description:(0,h.jsxs)("p",{children:["We ",(0,h.jsx)("a",{href:"https://formal-land.gitlab.io/coq-tezos-of-ocaml/",children:"formally verified\xa0\ud83d\udd0d"})," the ",(0,h.jsx)("em",{children:"code"})," of the layer 1 of the security-focused blockchain ",(0,h.jsx)("a",{href:"https://tezos.com/",children:"Tezos"}),". This is a significant achievement as no other blockchains have done that, verifying ",(0,h.jsx)("em",{children:"models"})," of the implementation at best.",(0,h.jsx)("br",{}),"We covered a codebase of more than 100,000 lines of ",(0,h.jsx)("a",{href:"",children:"OCaml"}),"\xa0\ud83d\udc2b code, including the storage system and the smart contracts VM, thanks to our ",(0,h.jsx)("a",{href:"https://github.com/formal-land/coq-of-ocaml",children:"innovative tools"})," and methods. See the ",(0,h.jsx)("a",{href:"https://formal-land.gitlab.io/coq-tezos-of-ocaml/blog",children:"blog of the project"})," for more details\xa0\ud83d\udcda."]})}];function m(e){let{title:t,image:i,imageNight:o,description:r}=e;return(0,h.jsx)("div",{className:s("col col--6"),style:{marginTop:50},children:(0,h.jsxs)("div",{style:{margin:"auto",maxWidth:500},children:[(0,h.jsx)("div",{className:"text--center",children:(0,h.jsx)("img",{alt:t,className:c.featureImg,src:i})}),(0,h.jsxs)("div",{className:"text--center padding-horiz--md",style:{marginTop:30},children:[(0,h.jsx)("h3",{children:t}),r]})]})})}function u(){return(0,h.jsx)("section",{className:c.features,children:(0,h.jsxs)("div",{className:"container",children:[(0,h.jsx)("h2",{className:"margin-bottom--lg text--center",children:"Our projects"}),(0,h.jsx)("div",{className:"row",children:d.map(((e,t)=>(0,h.jsx)(m,{...e},t)))})]})})}function g(){return(0,h.jsx)("svg",{width:"13.5",height:"13.5","aria-hidden":"true",viewBox:"0 0 24 24",children:(0,h.jsx)("path",{fill:"currentColor",d:"M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"})})}function f(){const{siteConfig:e}=(0,a.A)();return(0,h.jsx)("header",{className:s("hero hero--primary",l.heroBanner),style:{},children:(0,h.jsx)("div",{className:s("container",l.hero__container),children:(0,h.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between"},children:[(0,h.jsx)("div",{className:l.onlyDesktop,style:{flexShrink:0,padding:120},children:(0,h.jsx)("img",{style:{maxHeight:350},src:"img/icons/land.png"})}),(0,h.jsxs)("div",{style:{flex:1},children:[(0,h.jsx)("h1",{className:s("hero__title",l.hero__title),style:{letterSpacing:"0.03em"},children:e.title}),(0,h.jsx)("p",{className:l.hero__subtitle,style:{marginTop:80,marginBottom:80},children:(0,h.jsx)("em",{children:"Formal verification for the blockchain"})}),(0,h.jsx)("p",{className:l.hero__subsubtitle,style:{marginTop:80,marginBottom:80},children:(0,h.jsxs)("strong",{children:["Our references: ",(0,h.jsx)(n.A,{href:"https://tezos.com/",children:"Tezos"}),", ",(0,h.jsx)(n.A,{href:"https://alephzero.org/",children:"Aleph\xa0Zero"}),", ",(0,h.jsx)(n.A,{href:"https://sui.io/",children:"Sui"})]})}),(0,h.jsxs)("p",{className:l.hero__subsubtitle,style:{marginTop:80,marginBottom:80},children:["We build tools and services to ",(0,h.jsx)("strong",{children:"make sure"})," your code",(0,h.jsx)("br",{}),(0,h.jsx)("strong",{children:"contains no vulnerabilities\xa0\ud83d\udc1e"})]}),(0,h.jsxs)("div",{className:l.buttons,style:{marginTop:80,marginBottom:80},children:[(0,h.jsxs)(n.A,{className:s("button button--info button--lg",l.hero__button),to:"mailto:contact@formal.land",children:["Contact us\xa0",(0,h.jsx)(g,{})]}),(0,h.jsx)(n.A,{className:s("button button--secondary button--lg",l.hero__button),to:"/docs/audit",children:"\ud83d\udee1\ufe0f\xa0Get audit"})]})]})]})})})}function p(){const{siteConfig:e}=(0,a.A)();return(0,h.jsxs)(r.A,{title:e.tagline,description:e.tagline,children:[(0,h.jsx)(f,{}),(0,h.jsxs)("main",{style:{marginTop:50,marginBottom:50},children:[(0,h.jsx)("section",{style:{marginTop:120,marginBottom:120},children:(0,h.jsxs)("div",{className:"container",style:{fontSize:20,maxWidth:1e3},children:[(0,h.jsx)("blockquote",{cite:"https://x.com/VitalikButerin/status/1759369749887332577",children:(0,h.jsxs)("p",{children:["One application of AI that I am excited about is AI-assisted ",(0,h.jsx)("strong",{children:"formal verification"})," of code and bug finding.",(0,h.jsx)("br",{}),"Right now ",(0,h.jsx)("strong",{children:"ethereum's biggest technical risk probably is bugs in code"}),", and anything that could significantly change the game on that would be amazing."]})}),(0,h.jsxs)("p",{children:["Vitalik Buterin, ",(0,h.jsx)("a",{href:"https://x.com/VitalikButerin/status/1759369749887332577",children:(0,h.jsx)("cite",{children:"Feb 19, 2024 - X"})})]})]})}),(0,h.jsx)(u,{})]})]})}}}]);