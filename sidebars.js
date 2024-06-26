/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  sidebar: [
    {
      type: 'category',
      label: 'Company',
      items: [
        'company/about',
        'company/intro',
        'company/claims',
        'company/careers',
        'company/press',
      ],
    },
    // {
    //   type: 'category',
    //   label: 'Formal verification',
    //   items: [
    //     'verification/ocaml',
    //     'verification/rust',
    //     'verification/typescript',
    //     'verification/solidity',
    //   ],
    // },
    // {
    //   type: 'category',
    //   label: 'Services',
    //   items: [
    //     'services/ocaml-development',
    //     'services/rust-development',
    //     'services/typescript-development',
    //     'services/solidity-development',
    //   ],
    // },
    {
      type: 'category',
      label: '🦀 coq-of-rust',
      items: [
        'coq-of-rust/introduction',
      ],
    },
    {
      type: 'category',
      label: '🐫 coq-of-ocaml',
      items: [
        'coq-of-ocaml/introduction',
        'coq-of-ocaml/install',
        'coq-of-ocaml/run',
        'coq-of-ocaml/cookbook',
        {
          type: 'category',
          label: 'Language',
          items: [
            'coq-of-ocaml/ocaml-core',
            'coq-of-ocaml/type-definitions',
            'coq-of-ocaml/module-system',
            'coq-of-ocaml/gadts',
          ],
        },
        {
          type: 'category',
          label: 'Options',
          items: [
            'coq-of-ocaml/attributes',
            'coq-of-ocaml/configuration',
          ],
        },
        {
          type: 'category',
          label: 'More',
          items: [
            'coq-of-ocaml/examples',
            'coq-of-ocaml/faq',
          ],
        },
      ],
    },
  ],
};
