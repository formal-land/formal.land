import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image?: string;
  imageNight?: string;
  description: JSX.Element;
};

type FaqItem = {
  question: string;
  answer: JSX.Element;
};

const FeatureListServices: FeatureItem[] = [
  {
    title: 'Critical embedded software',
    description: (
      <>
        <p>
          We verify selected control, mode-management, interface, and safety-relevant logic in embedded software for teams working on aerospace, defense, automotive, rail, and other high-consequence systems.
        </p>
        <p>
          The goal is not to prove everything. It is to add machine-checked evidence on the components that drive disproportionate certification or integration risk.
        </p>
      </>
    ),
  },
  {
    title: 'High-assurance Rust and TypeScript',
    description: (
      <>
        <p>
          We verify Rust, TypeScript, and other programming languages at the source level using our Rocq-based toolchain. This is useful for critical libraries, infrastructure components, protocol implementations, and systems software.
        </p>
        <p>
          Our workflow is designed to keep proofs synchronized with the implementation as the code evolves.
        </p>
      </>
    ),
  },
  {
    title: 'Verification tooling and training',
    description: (
      <>
        <p>
          We build translation tools, proof workflows, and reusable verification components so your team can adopt rigorous methods without starting from a blank page.
        </p>
        <p>
          We also provide training and expert support for teams using Rocq to structure proofs around real engineering requirements.
        </p>
      </>
    ),
  },
  {
    title: 'Verification of cryptographic systems',
    description: (
      <>
        <p>
          We verify cryptographic systems and correctness-critical components where subtle errors can invalidate security arguments or break interoperability.
        </p>
        <p>
          ZK circuits are one example of the systems we verify, and we collaborate with <a href="https://zippellabs.github.io/">ZippelLabs</a> on this kind of work.
        </p>
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
          We are formally verifying the correctness of the <a href="https://github.com/bluealloy/revm">revm</a> implementation of the EVM virtual machine against a functional specification.
        </p>
        <p>
          This is an example of large-scale verification on unmodified Rust code, with proofs that can evolve alongside the implementation.
        </p>
      </>
    ),
  },
  {
    title: 'Sui Foundation',
    image: 'img/homepage/sui.jpeg',
    imageNight: 'img/homepage/sui.jpeg',
    description: (
      <>
        <p>
          We formally verified part of the type-checker for the Move language.
        </p>
        <p>
          The work illustrates how we approach complex language and infrastructure code where correctness properties matter.
        </p>
      </>
    ),
  },
  {
    title: 'Aleph Zero Foundation',
    image: 'img/homepage/aleph-zero.jpg',
    imageNight: 'img/homepage/aleph-zero.jpg',
    description: (
      <>
        <p>
          We developed <a href="https://github.com/formal-land/rocq-of-rust">rocq-of-rust</a> and <a href="https://github.com/formal-land/rocq-of-solidity">rocq-of-solidity</a> to bring source-level verification to modern production languages.
        </p>
        <p>
          These tools are reusable well beyond blockchain and reflect our broader capability in automated translation and maintainable proof workflows.
        </p>
      </>
    ),
  },
  {
    title: 'Tezos',
    image: 'img/homepage/tezos.svg',
    imageNight: 'img/homepage/tezos.svg',
    description: (
      <>
        <p>
          The formal verification of parts of the Tezos implementation was our first large project. It led to the tool <a href="https://github.com/formal-land/coq-of-ocaml">coq-of-ocaml</a> and long-running work on verifying complex OCaml systems.
        </p>
        <p>
          This experience shaped how we connect source code, specifications, and replayable machine-checked proofs.
        </p>
      </>
    ),
  },
];

const FeatureListIndustries: FeatureItem[] = [
  {
    title: 'Aerospace and defence',
    description: (
      <p>
        Good fit for flight software, control logic, mission software, certified toolchains, and supplier-delivered components where exhaustive testing is expensive and assurance requirements are high.
      </p>
    ),
  },
  {
    title: 'Automotive and mobility',
    description: (
      <p>
        Useful for software-defined vehicle platforms, ADAS components, functional safety arguments, and integration-sensitive interfaces shared across suppliers and OEMs.
      </p>
    ),
  },
  {
    title: 'Web3 and financial infrastructure',
    description: (
      <p>
        We are already active in blockchain infrastructure, smart contract tooling, virtual machines, and related correctness-critical software where subtle bugs can have immediate financial consequences.
      </p>
    ),
  },
  {
    title: 'Tool vendors and engineering suppliers',
    description: (
      <p>
        We also work with companies building verification toolchains or delivering engineering services into critical programs, where proof expertise can complement existing delivery capability.
      </p>
    ),
  },
];

const FeatureListTechnologies: FeatureItem[] = [
  {
    title: 'Automated translation',
    description: (
      <>
        <p>
          We develop automated translations from programming languages such as <a href="https://github.com/formal-land/rocq-of-rust">Rust</a>, TypeScript, <a href="https://github.com/formal-land/coq-of-ocaml">OCaml</a>, <a href="https://github.com/formal-land/rocq-of-solidity">Solidity</a>, and others into formal languages.
        </p>
        <p>
          This lets us verify software close to the original implementation and re-run proofs as the code changes.
        </p>
      </>
    ),
  },
  {
    title: 'AI-assisted proof work',
    description: (
      <>
        <p>
          We are working on AI-assisted methods for software verification and rigorous engineering workflows.
        </p>
        <p>
          This includes collaborations with <a href="https://inria.fr/en">Inria</a>, for example with <a href="https://www.di.ens.fr/~lelarge/index.html">Marc Lelarge</a>, on practical ways to make advanced verification techniques more usable.
        </p>
      </>
    ),
  },
  {
    title: 'Interactive theorem provers',
    description: (
      <>
        <p>
          We rely on interactive theorem provers such as <a href="https://rocq-prover.org/">Rocq</a> to prove specified properties of software with machine-checked proofs.
        </p>
        <p>
          Rocq originated at <a href="https://inria.fr/en">Inria</a> in France and remains one of the strongest foundations for high-assurance proof workflows.
        </p>
      </>
    ),
  },
  {
    title: 'Open source',
    description: (
      <>
        <p>
          We keep much of our tooling open source to lower the cost of adoption and make verification work easier to inspect, extend, and maintain.
        </p>
        <p>
          You can review our code on <a href="https://github.com/formal-land">GitHub</a> and follow technical progress on the <a href="https://formal.land/blog">blog</a>.
        </p>
      </>
    ),
  },
];

const FaqList: FaqItem[] = [
  {
    question: 'What kind of software do you verify?',
    answer: (
      <p>
        We work on critical software components where stronger evidence is useful: embedded logic, systems code, infrastructure software, high-risk libraries, and security-sensitive or correctness-sensitive applications.
      </p>
    ),
  },
  {
    question: 'Do you only work on blockchain and web3?',
    answer: (
      <p>
        No. Our current public references are strongest in blockchain and financial infrastructure, but the underlying methods apply to both web3 and industrial software, including embedded and high-assurance systems.
      </p>
    ),
  },
  {
    question: 'Do you verify an entire codebase?',
    answer: (
      <p>
        Usually not at the start. The most effective projects focus on a narrow, high-value part of a system: a control module, interface boundary, protocol component, or other piece of code where failure would be especially costly.
      </p>
    ),
  },
  {
    question: 'How do you fit with testing, reviews, or certification work?',
    answer: (
      <p>
        Formal verification complements testing and review. It gives machine-checked evidence on selected properties that are hard to cover exhaustively with tests alone, and it can support safety, assurance, or certification-oriented workflows.
      </p>
    ),
  },
  {
    question: 'What do clients receive?',
    answer: (
      <p>
        Depending on the project, clients receive specifications, proof artifacts, supporting tooling, and documentation that can be replayed and maintained as the code evolves.
      </p>
    ),
  },
];

function Feature({title, image, imageNight, description}: FeatureItem) {
  const isDarkTheme = false;

  return (
    <div className={clsx('col col--6')} style={{marginTop: 50}}>
      <div style={{margin: 'auto', maxWidth: 500}}>
        {image && (
          <div className="text--center">
            <img
              alt={title}
              className={styles.featureImg}
              src={isDarkTheme ? imageNight : image}
            />
          </div>
        )}
        <div className="text--center padding-horiz--md" style={{marginTop: 30}}>
          <h3>{title}</h3>
          {description}
        </div>
      </div>
    </div>
  );
}

function FeatureSection({
  title,
  items,
}: {
  title: string;
  items: FeatureItem[];
}) {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className="margin-bottom--lg text--center">{title}</h2>
        <div className="row">
          {items.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className="margin-bottom--lg text--center">FAQ</h2>
        <div className={styles.faqList}>
          {FaqList.map(({question, answer}) => (
            <details key={question} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{question}</summary>
              <div className={styles.faqAnswer}>{answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <>
      <FeatureSection title="Services" items={FeatureListServices} />
      <FeatureSection title="Selected work" items={FeatureListCaseStudies} />
      <FaqSection />
      <FeatureSection title="Where we fit" items={FeatureListIndustries} />
      <FeatureSection title="Technologies" items={FeatureListTechnologies} />
    </>
  );
}
