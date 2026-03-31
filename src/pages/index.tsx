import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// import useThemeContext from '@theme/hooks/useThemeContext';
import styles from './index.module.css';
import './csshake-default.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  // const { isDarkTheme } = useThemeContext();
  const isDarkTheme = false;

  return (
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      style={isDarkTheme ? {backgroundColor: "#6d6d6d"} : {}}
    >
      <div className={clsx('container', styles.hero__container)}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            // Vertically center the content
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className={styles.onlyDesktop} style={{flexShrink: 0, padding: 120}}>
            <img
              style={{maxHeight: 350}}
              src={isDarkTheme ? "img/icons/wolf-night.png" : "img/icons/land.png"}
            />
          </div>
          <div style={{flex: 1}}>
            <h1
              className={clsx("hero__title", styles.hero__title)}
              style={{
                letterSpacing: '0.03em',
              }}
            >
              {siteConfig.title}
            </h1> 
            <p className={styles.hero__subtitle} style={{marginTop: 80, marginBottom: 80}}>
              Formal verification for critical software.
            </p>
            <ul className={styles.hero__subsubtitle} style={{marginTop: 80, marginBottom: 80, textAlign: 'left'}}>
              <li>Prove key safety and correctness properties on selected critical components</li>
              <li>Keep proofs aligned as requirements and code evolve</li>
              <li>Support embedded, systems, and infrastructure teams with services and tooling</li>
            </ul>
            <div className={styles.buttons} style={{marginTop: 80, marginBottom: 80}}>
              <Link
                className={clsx('button button--warning button--lg', styles.hero__button)}
                to="https://calendar.app.google/hs9VRQYdb71KDMLd8"
              >
                Discuss a project
              </Link>
              <Link
                className={clsx('button button--secondary button--lg', styles.hero__button)}
                to="/docs/services/critical-embedded-software"
              >
                Critical embedded software
              </Link>
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
      description={siteConfig.tagline}
    >
      <HomepageHeader />
      <main style={{marginTop: 50, marginBottom: 50}}>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
