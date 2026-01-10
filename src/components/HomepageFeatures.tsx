/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
// import useThemeContext from '@theme/hooks/useThemeContext';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image?: string;
  imageNight?: string;
  description: JSX.Element;
};

const FeatureListServices: FeatureItem[] = [
  {
    title: 'Smart contract audit',
    image: 'img/homepage/solidity_logo.svg',
    imageNight: 'img/homepage/solidity_logo.svg',
    description: (
      <>
        <p>
          We provide audits for your <a href="https://soliditylang.org/">Solidity</a> smart contracts. We use formal verification to make sure we cover all edge cases.
        </p>
        <p>
          Such audits offer the highest degree of certainty and can be relatively cheap on the long run. We recommend applying formal verification after a few dozen millions of dollars of assets under management.
        </p>
      </>
    ),
  },
  {
    title: 'Rust verification',
    image: 'img/homepage/rust-crab.png',
    imageNight: 'img/homepage/rust-crab.png',
    description: (
      <>
        <p>
          We audit Rust code using our formal verification tool <a href="https://github.com/formal-land/coq-of-rust">coq-of-rust</a>. It covers almost all Rust code, including the standard library, for any kinds of properties to verify.
        </p>
        <p>
          This will be useful if you have critical libraries or applications written in Rust, such as blockchains, operating systems, or cryptographic primitives.
        </p>
      </>
    ),
  },
  {
    title: 'Zero Knowledge audit',
    image: 'img/homepage/zero-knowledge.svg',
    imageNight: 'img/homepage/zero-knowledge.svg',
    description: (
      <>
        <p>
          We have expertise in zero-knowledge systems and provide audits with formal verification for these systems. Here are some examples of our products:
        </p>
        <ul style={{ listStylePosition: "inside", paddingLeft: 0, marginTop: 20 }}>
          <li>
            <a href="https://github.com/formal-land/rocq-of-noir">rocq-of-noir</a> a formal verification for <a href="https://noir-lang.org/">Noir</a> programs
          </li>
          <li>
            <a href="https://github.com/formal-land/garden">Garden</a> an open source library to verify circuits (Circom, ...)
          </li>
        </ul>
      </>
    ),
  },
];

const FeatureListCaseStudies: FeatureItem[] = [
  {
    title: 'Ethereum Foundation',
    image: 'img/homepage/ethereum-foundation.svg',
    imageNight: 'img/homepage/ethereum-foundation.svg',
    description: (
      <>
        <p>
          We are formally verifying for the <a href="https://ethereum.foundation/">Ethereum Foundation</a> the correctness of the <a href="https://github.com/bluealloy/revm">revm</a> implementation of the EVM virtual machine, according to a functional specification.
        </p>
        <p>
          This is an ongoing project, involving the formal verification of thousands of unmodified lines of Rust code.
        </p>
      </>
    ),
  },
  {
    title: 'Sui Foundation',
    image: 'img/homepage/sui.jpeg',
    imageNight: 'img/homepage/sui.jpeg',
    description: (
      <p>
        We formally verified a first part of the type-checker for the <a href="https://sui.io/move">Move language</a> used by the <a href="https://sui.io/">Sui</a> blockchain. Look at some of our blog posts such as <a href="https://formal.land/blog/2025/01/13/verification-one-instruction-sui">Verification of one instruction of the Move's type-checker</a> for more information.
      </p>
    ),
  },
  {
    title: 'Aleph Zero Foundation',
    image: 'img/homepage/aleph-zero.jpg',
    imageNight: 'img/homepage/aleph-zero.jpg',
    description: (
      <>
        <p>
          Thanks to the <a href="https://alephzero.org/">Aleph Zero</a> Foundation we developed the two following formal verification tools:
        </p>
        <ul style={{ listStylePosition: "inside", paddingLeft: 0, marginTop: 20 }}>
          <li>
            <a href="https://github.com/formal-land/coq-of-rust">coq-of-rust</a> for Rust programs
          </li>
          <li>
            <a href="https://github.com/formal-land/coq-of-solidity">coq-of-solidity</a> for Solidity/Yul programs
          </li>
        </ul>
        <p>
          These enable the formal verification of most of the blockchain code that is written today, either in smart contracts or L1/L2.
        </p>
      </>
    ),
  },
  {
    title: 'Tezos Foundation',
    image: 'img/homepage/tezos.svg',
    imageNight: 'img/homepage/tezos.svg',
    description: (
      <>
        <p>
          The formal verification of parts of the implementation of the <a href="https://tezos.com/">Tezos</a> blockchain was our first project. It started at <a href="https://www.nomadic-labs.com/</p>">Nomadic Labs</a> and <a href="https://inria.fr/en">Inria</a> with the development of the verification tool for OCaml <a href="https://github.com/formal-land/coq-of-ocaml">coq-of-ocaml</a>.
        </p>
        <p>
          It continued with the repository <a href="https://formal-land.gitlab.io/coq-tezos-of-ocaml/">coq-tezos-of-ocaml</a> and the verification of parts of the storage system and the smart contracts VM.
        </p>
      </>
    ),
  },
];

const FeatureListTechnologies: FeatureItem[] = [
  {
    title: 'Rocq prover',
    // image: 'https://raw.githubusercontent.com/coq/rocq-prover.org/refs/heads/main/rocq-id/logos/SVG/icon-rocq-orange.svg',
    // imageNight: 'https://raw.githubusercontent.com/coq/rocq-prover.org/refs/heads/main/rocq-id/logos/SVG/icon-rocq-orange.svg',
    description: (
      <>
        <p>
          We rely on the formal verification tool <a href="https://rocq-prover.org/">Rocq</a> (previously named Coq) to prove the correctness of your software. Rocq is a powerful proof assistant that allows us to verify the absence of any kinds of bugs in your code.
        </p>
        <p>
          Based on the theory of the <a href="https://en.wikipedia.org/wiki/Calculus_of_constructions">Calculus of Constructions</a>, Rocq was originated at the <a href="https://inria.fr/en">Inria</a> research center in France and received contributions from several Universities across the world.
        </p>
      </>
    ),
  },
  {
    title: 'Automated translation',
    // image: 'img/homepage/translation.svg',
    // imageNight: 'img/homepage/translation.svg',
    description: (
      <>
        <p>
          We developed several automated translation tools from various programming languages (Rust, Solidity, OCaml, Noir, Circom, ...) to the Rocq proof system.
        </p>
        <p>
          These tools allow us to verify the correctness of your software at the source level, and to maintain the proof of correctness as the code evolves.
        </p>
      </>
    ),
  },
  {
    title: 'Open source',
    // image: 'img/homepage/open-source.svg',
    // imageNight: 'img/homepage/open-source.svg',
    description: (
      <>
        <p>
          We believe in the strength of open source to lower the cost of formal verification and make it accessible to more people.
        </p>
        <p>
          To look at our code visit our <a href="https://github.com/formal-land">GitHub</a> and our <a href="https://formal.land/blog">blog</a>.
        </p>
      </>
    ),
  },
  {
    title: 'AI',
    // image: 'img/homepage/ai.svg',
    // imageNight: 'img/homepage/ai.svg',
    description: (
      <>
        <p>
          Thanks to an <a href="https://erasmus-plus.ec.europa.eu/funding-calls">Erasmus grant</a>, we are working on AI solutions in the <a href="https://code.visualstudio.com/">VSCode</a> editor to help developers write Rocq proofs. See our blog post <a href="https://formal.land/blog/2025/01/21/designing-a-coding-assistant-for-rocq">Designing a coding assistant for Rocq</a> for more details.
        </p>
      </>
    ),
  },
];

function Feature({ title, image, imageNight, description }: FeatureItem) {
  // const { isDarkTheme } = useThemeContext();
  const isDarkTheme = false;

  return (
    <div className={clsx('col col--6')} style={{ marginTop: 50 }}>
      <div style={{ margin: "auto", maxWidth: 500 }}>
        {image &&
          <div className="text--center">
            <img
              alt={title}
              className={styles.featureImg}
              src={isDarkTheme ? imageNight : image}
            />
          </div>
        }
        <div className="text--center padding-horiz--md" style={{ marginTop: 30 }}>
          <h3>{title}</h3>
          {description}
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <h2 className="margin-bottom--lg text--center">
            They trust us
          </h2>
          <div className="row">
            {FeatureListCaseStudies.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
      <section className={styles.features}>
        <div className="container">
          <h2 className="margin-bottom--lg text--center">
            Services
          </h2>
          <div className="row">
            {FeatureListServices.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
      <section className={styles.features}>
        <div className="container">
          <h2 className="margin-bottom--lg text--center">
            Technologies
          </h2>
          <div className="row">
            {FeatureListTechnologies.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
