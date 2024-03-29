import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// import useThemeContext from '@theme/hooks/useThemeContext';
import styles from './index.module.css';
import './csshake-default.css';
import HomepageFeatures from '../components/HomepageFeatures';

function ExternalLink() {
  return <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>;
}

function TypingText({text}: {text: string}) {
  const [nbLetters, setNbLetters] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNbLetters(nbLetters + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [nbLetters]);

  return (
    <span>
      {text.slice(0, nbLetters)}
    </span>
  )
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  // const { isDarkTheme } = useThemeContext();
  const isDarkTheme = false;

  return (
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      style={isDarkTheme ? {backgroundColor: "#6d6d6d"} : {}}
    >
      <div className="container">
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div className={styles.onlyDesktop} style={{flexShrink: 0}}>
            <img
              // alt={title}
              // className={styles.featureSvg}
              // src={isDarkTheme ? imageNight : image}
              style={{margin: 20, maxHeight: 256}}
              src={isDarkTheme ? "img/icons/wolf-night.png" : "img/icons/land.png"}
            />
          </div>
          <div style={{flex: 1}}>
            <h1 className={clsx("hero__title", styles.hero__title)} style={{marginTop: 20}}>
              {siteConfig.title}
            </h1>
            <p className={styles.hero__subtitle}>
              {siteConfig.tagline}
            </p>
            <div className={styles.buttons}>
              {/* <Link
                className="button button--success button--lg"
                to="https://n25o5qrzcx2.typeform.com/to/mltUWY58">
                Request an audit&nbsp;<ExternalLink />
              </Link> */}
              {/* <Link
                className="button button--info button--lg"
                to="https://koalendar.com/e/meet-with-formal-land">
                Call us&nbsp;<ExternalLink />
              </Link> */}
              <Link
                className="button button--info button--lg"
                to="mailto:&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;">
                Contact us&nbsp;<ExternalLink />
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/company/intro">
                More info
              </Link>
              {/* <Link
                className="button button--secondary button--lg"
                to="/docs/company/intro">
                Info
              </Link> */}
              {/* <Link
                className="button button--danger button--lg"
                to="/docs/company/careers">
                Hiring
              </Link> */}
            </div>
            {/* <p className={clsx("hero__subtitle")} style={{marginTop: 20}} title="Mathematically proven"> */}
            <p className={styles.hero__subsubtitle} style={{marginTop: 20}}>
              {/* <em><TypingText text="Formal verification for Rust, OCaml" /></em> */}
              <em>We support <Link to="/docs/coq-of-rust/introduction">Rust</Link>, <Link to="/docs/coq-of-ocaml/introduction">OCaml</Link>, and more</em>
            </p>
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
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
