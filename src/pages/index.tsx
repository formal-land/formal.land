import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import './csshake-default.css';
import HomepageFeatures from '../components/HomepageFeatures';

const contactHref =
  'mailto:contact@formal.land?subject=Formal%20verification%20project';

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>Formal verification since 2021</p>
            <h1 className={styles.heroTitle}>
              Machine-checked proofs for critical software
            </h1>
            <p className={styles.heroSubtitle}>
              We verify selected Rust, OCaml, Solidity, and systems components
              with Rocq/Lean-based proof workflows that can follow code
              changes.
            </p>
            <ul className={styles.heroBullets}>
              <li>Formal verification audits for high-risk code paths</li>
              <li>Ongoing proof maintenance as implementations evolve</li>
              <li>Consulting, tooling, and training for engineering teams</li>
            </ul>
            <div className={styles.buttons}>
              <Link
                className={clsx('button button--warning button--lg', styles.primaryButton)}
                to={contactHref}
              >
                Email us about a project
              </Link>
              <Link
                className={clsx('button button--secondary button--lg', styles.secondaryButton)}
                to="/docs/audit"
              >
                See verification reports
              </Link>
            </div>
          </div>
          <div className={styles.heroPanel} aria-label="Sample machine-checked proof">
            <div className={styles.proofChrome}>
              <span className={styles.proofDots} aria-hidden="true">
                <span /><span /><span />
              </span>
              <span className={styles.proofFile}>revm/proofs/EvmStep.v</span>
              <span className={styles.proofBadge}>Rocq ✓</span>
            </div>
            <pre className={styles.proofCode}>
              <code>
                <span className={styles.cmt}>(* Revm — EVM step preserves invariant *)</span>{'\n'}
                <span className={styles.kw}>Theorem</span> <span className={styles.fn}>step_preserves_invariant</span> :{'\n'}
                {'  '}<span className={styles.kw}>forall</span> (pre post : <span className={styles.ty}>State</span>) (op : <span className={styles.ty}>Instruction</span>),{'\n'}
                {'    '}<span className={styles.fn}>step</span> pre op = post →{'\n'}
                {'    '}<span className={styles.fn}>valid_state</span> pre →{'\n'}
                {'    '}<span className={styles.fn}>valid_state</span> post.{'\n'}
                <span className={styles.kw}>Proof</span>.{'\n'}
                {'  '}<span className={styles.cmt}>(* 124 lines · machine-checked *)</span>{'\n'}
                <span className={styles.kw}>Qed</span>.
              </code>
            </pre>
            <div className={styles.proofMeta}>
              <Link to="/docs/audit" className={styles.proofLink}>
                <strong>8</strong> public reports
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/docs/tools" className={styles.proofLink}>
                <strong>4</strong> translation tools
              </Link>
              <span aria-hidden="true">·</span>
              <span><strong>Rocq + Lean</strong></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.tagline}
      description="Formal verification audits, subscriptions, and consulting for critical software."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
