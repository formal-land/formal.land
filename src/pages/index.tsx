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
          <div className={styles.heroPanel} aria-label="Verification outcomes">
            <img
              alt=""
              className={styles.heroMark}
              src="img/icons/land.png"
            />
            <div>
              <span className={styles.metricValue}>8</span>
              <span className={styles.metricLabel}>public verification reports</span>
            </div>
            <div>
              <span className={styles.metricValue}>4</span>
              <span className={styles.metricLabel}>source-level translation tools</span>
            </div>
            <div>
              <span className={styles.metricValue}>Rocq/Lean</span>
              <span className={styles.metricLabel}>inspectable machine-checked proofs</span>
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
