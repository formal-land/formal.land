import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './HomepageFeatures.module.css';

type LinkItem = {
  label: string;
  href: string;
};

type ResultItem = {
  title: string;
  meta: string;
  image?: string;
  description: string;
  links: LinkItem[];
};

type OfferItem = {
  title: string;
  description: string;
  bullets: string[];
};

type CapabilityItem = {
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: JSX.Element;
};

const contactHref =
  'mailto:contact@formal.land?subject=Formal%20verification%20project';

const ResultList: ResultItem[] = [
  {
    title: 'Ethereum Foundation',
    meta: 'Revm formal specification - Rust / EVM',
    image: 'img/homepage/ethereum-foundation.svg',
    description:
      'A public formal specification for Revm, the Rust implementation of the Ethereum Virtual Machine.',
    links: [
      {
        label: 'Read the report',
        href: '/reports/2026-02-15_revm-formal-specification.pdf',
      },
    ],
  },
  {
    title: 'Ethereum Foundation',
    meta: 'ZK verification reports',
    image: 'img/homepage/ethereum-foundation.svg',
    description:
      'Verification work on Keccak, branch equality, and LLZK-related proof artifacts for zero-knowledge systems.',
    links: [
      {label: 'Keccak', href: '/slides/2025-ef-zk-reports/keccak.pdf'},
      {
        label: 'Branch equality',
        href: '/slides/2025-ef-zk-reports/branch-eq.pdf',
      },
      {label: 'LLZK', href: '/slides/2025-ef-zk-reports/llzk.pdf'},
    ],
  },
  {
    title: 'Sui',
    meta: 'Move type-checker - Rust',
    image: 'img/homepage/sui.jpeg',
    description:
      'Formal verification of part of the type-checker for the Move language, focused on correctness-critical infrastructure code.',
    links: [
      {label: 'Read the report', href: '/reports/sui-type-checker/book/'},
    ],
  },
  {
    title: 'Smoo.th',
    meta: 'Elliptic curve library - Solidity',
    image: 'img/homepage/zero-knowledge.svg',
    description:
      'Formal verification work for a Solidity elliptic curve library where small arithmetic mistakes can invalidate protocol assumptions.',
    links: [{label: 'Read the report', href: '/reports/smoo.th/book/'}],
  },
  {
    title: 'Aleph Zero',
    meta: 'Source-level verification tooling - Rust / Solidity',
    image: 'img/homepage/aleph-zero.jpg',
    description:
      'Development of rocq-of-rust and rocq-of-solidity to support maintainable verification of production-language code.',
    links: [{label: 'Read the report', href: '/reports/aleph-zero/book/'}],
  },
  {
    title: 'Tezos',
    meta: 'Layer 1 verification - OCaml',
    image: 'img/homepage/tezos.svg',
    description:
      'Verification work on parts of the Tezos implementation, leading to our long-running OCaml verification toolchain.',
    links: [{label: 'Read the report', href: '/reports/tezos/book/'}],
  },
];

const OfferList: OfferItem[] = [
  {
    title: 'Formal verification audit',
    description:
      'A focused engagement for a code snapshot where a small set of high-value properties needs stronger evidence than tests can provide.',
    bullets: [
      'Choose the component and properties to verify',
      'Build machine-checked Rocq/Lean proof artifacts',
      'Deliver a report that engineering teams can inspect',
    ],
  },
  {
    title: 'Ongoing verification subscription',
    description:
      'A recurring workflow for teams that need proofs to remain useful as requirements, code, or dependencies change.',
    bullets: [
      'Track changes in selected critical components',
      'Replay and update proofs during release work',
      'Keep verification cost focused on what changed',
    ],
  },
  {
    title: 'Consulting, tooling, and training',
    description:
      'Expert support for teams adopting formal methods or connecting production languages to Rocq/Lean proof workflows.',
    bullets: [
      'Design specifications around real engineering requirements',
      'Build source-level translation and proof tooling',
      'Train teams to maintain proof artifacts over time',
    ],
  },
];

const CapabilityList: CapabilityItem[] = [
  {
    title: 'Critical embedded and systems logic',
    description:
      'Control logic, mode management, stateful components, protocol code, and safety-relevant interfaces where exhaustive testing is hard.',
  },
  {
    title: 'Rust, OCaml, Solidity, and TypeScript',
    description:
      'Source-level verification for production languages using our translation tools and Rocq/Lean proof engineering experience.',
  },
  {
    title: 'Cryptography and ZK systems',
    description:
      'Arithmetic, constraints, hash functions, circuit-adjacent code, and interoperability-sensitive components where subtle bugs matter.',
  },
  {
    title: 'Reusable proof workflows',
    description:
      'Open-source tooling and maintainable proof structures that make verification work replayable rather than one-off documentation.',
  },
];

const ProcessSteps = [
  'Identify one component where failure would be costly',
  'Define the precise safety or correctness properties worth proving',
  'Connect the source code to Rocq/Lean proof workflows',
  'Deliver specifications, proof artifacts, and a verification report',
  'Keep proofs aligned as the implementation evolves',
];

const FaqList: FaqItem[] = [
  {
    question: 'What do buyers get at the end of a project?',
    answer: (
      <p>
        A focused report, specifications, and machine-checked Rocq/Lean proof
        artifacts for the properties agreed at the start of the engagement.
      </p>
    ),
  },
  {
    question: 'Do you verify an entire codebase?',
    answer: (
      <p>
        Usually not at first. The best starting point is a narrow component
        where failure would be costly: a control module, protocol component,
        cryptographic routine, type-checker rule, or interface boundary.
      </p>
    ),
  },
  {
    question: 'How does this fit with testing and review?',
    answer: (
      <p>
        Formal verification complements tests, audits, and code review. It gives
        machine-checked evidence for selected properties that are hard to cover
        exhaustively with tests alone.
      </p>
    ),
  },
  {
    question: 'Is Formal Land only for Web3 projects?',
    answer: (
      <p>
        No. Our public reports are strongest in blockchain infrastructure, but
        the same source-level verification methods apply to embedded, systems,
        cryptographic, and other critical software.
      </p>
    ),
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function ResultsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHeader
          eyebrow="Public evidence"
          title="Public proof reports"
          description="Public reports show the kind of proof work we deliver for production systems, cryptography, and language infrastructure."
        />
        <div className={styles.resultGrid}>
          {ResultList.map(({title, meta, image, description, links}) => (
            <article key={`${title}-${meta}`} className={styles.resultCard}>
              <div className={styles.resultHeader}>
                {image && <img alt="" src={image} className={styles.resultLogo} />}
                <div>
                  <h3>{title}</h3>
                  <p>{meta}</p>
                </div>
              </div>
              <p>{description}</p>
              <div className={styles.linkRow}>
                {links.map(({label, href}) => (
                  <a key={href} href={href}>
                    {label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className={styles.sectionCta}>
          <Link className="button button--secondary" to="/docs/audit">
            See all audit reports
          </Link>
        </div>
      </div>
    </section>
  );
}

function OffersSection() {
  return (
    <section className={clsx(styles.section, styles.sectionMuted)}>
      <div className="container">
        <SectionHeader
          eyebrow="What you can buy"
          title="Formal verification engagements"
          description="We scope work around the small parts of a system where proof adds the most value."
        />
        <div className={styles.offerGrid}>
          {OfferList.map(({title, description, bullets}) => (
            <article key={title} className={styles.offerCard}>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul>
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHeader
          eyebrow="Where we fit"
          title="Critical software, not just Web3"
          description="Blockchain results are visible because they are public. The same methods apply to critical embedded, systems, and infrastructure software."
        />
        <div className={styles.capabilityGrid}>
          {CapabilityList.map(({title, description}) => (
            <article key={title} className={styles.capabilityItem}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className={clsx(styles.section, styles.processSection)}>
      <div className="container">
        <SectionHeader
          eyebrow="How projects work"
          title="A narrow proof target, then replayable evidence"
        />
        <ol className={styles.processList}>
          {ProcessSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className={styles.sectionCta}>
          <Link className="button button--warning button--lg" to={contactHref}>
            Email us about a project
          </Link>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHeader title="FAQ" />
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
      <ResultsSection />
      <OffersSection />
      <CapabilitiesSection />
      <ProcessSection />
      <FaqSection />
    </>
  );
}
