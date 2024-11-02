import React, {useEffect} from 'react';
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
              // alt={title}
              // className={styles.featureSvg}
              // src={isDarkTheme ? imageNight : image}
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
            {/* <p className={styles.hero__subtitle}>
              <em><Link href="https://en.wikipedia.org/wiki/Vitalik_Buterin">Vitalik Buterin</Link>:</em> <u>Security</u> is now the<br />
              #1 priority for Ethereum, especially <u>formal verification of zkVMs</u>
            </p> */}
            <p className={styles.hero__subtitle} style={{marginTop: 80, marginBottom: 80}}>
              <em>Formal verification for the blockchain</em>
            </p>
            <p className={styles.hero__subsubtitle} style={{marginTop: 80, marginBottom: 80}}>
              <strong>Our references: <Link href="https://tezos.com/">Tezos</Link>, <Link href="https://alephzero.org/">Aleph&nbsp;Zero</Link>, <Link href="https://sui.io/">Sui</Link></strong>
            </p>
            {/* <p className={styles.hero__subsubtitle} style={{marginTop: 60, marginBottom: 30}}>
              <em>Proving the absence of bugs</em>
            </p> */}
            {/* <p className={styles.hero__subsubtitle} style={{marginTop: 50, marginBottom: 50}}>
              👉&nbsp;<u><Link href="mailto:verify-my-zk-vm@formal.land">Contact us to verify your zkVM!</Link></u>&nbsp;👈 We provide advanced formal verification services for <Link to="/docs/coq-of-rust/introduction">Rust</Link> and the blockchain.
            </p> */}
            <p className={styles.hero__subsubtitle} style={{marginTop: 80, marginBottom: 80}}>
              We build tools and services to <strong>make sure</strong> your code<br />
              <strong>contains no vulnerabilities&nbsp;🐞</strong>
            </p>
            {/* <p className={styles.hero__subsubtitle} style={{marginTop: 50, marginBottom: 50}}>
              We provide you a complete <strong>peace of mind&nbsp;🧘‍♀️</strong> and <strong>lower your security cost&nbsp;💰</strong>.
            </p> */}
            {/* <p className={styles.hero__subsubtitle} style={{marginTop: 50, marginBottom: 50}}>
              This is <strong>state-of-the-art security🦸</strong>: no state agencies can break it!
            </p> */}
            <div className={styles.buttons} style={{marginTop: 80, marginBottom: 80}}>
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
                className={clsx('button button--info button--lg', styles.hero__button)}
                to="mailto:&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;"
              >
                Contact us&nbsp;<ExternalLink />
              </Link>
              <Link
                className={clsx('button button--secondary button--lg', styles.hero__button)}
                to="/docs/audit">
                🛡️&nbsp;Get audit
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
            {/* <p className={styles.hero__subsubtitle} style={{marginTop: 50, marginBottom: 80}}>
              <em>We support <Link to="/docs/coq-of-rust/introduction">Rust</Link>, <Link to="/docs/coq-of-ocaml/introduction">OCaml</Link>, and <Link to="/blog/2024/05/14/translation-of-python-code-simulations">more</Link></em>
            </p> */}
          </div>
        </div>
      </div>
    </header>
  );
}

const HubspotContactForm = () => {
  useEffect(() => {
      const script = document.createElement('script');
      script.src='https://js.hsforms.net/forms/v2.js';
      document.body.appendChild(script);

      script.addEventListener('load', () => {
          // @ts-ignore
          if (window.hbspt) {
              // @ts-ignore
              window.hbspt.forms.create({
                  portalId: "144793130",
                  formId: "44518a92-58ae-4923-8ae0-e8400fcff12c",
                  region: "eu1",
                  target: '#hubspotForm'
              })
          }
      });
  }, []);

  return (
      <div>
          <div id="hubspotForm" />
      </div>
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
        <section style={{marginTop: 120, marginBottom: 120}}>
          <div className="container" style={{fontSize: 20, maxWidth: 1000}}>
            <img
              style={{maxHeight: 170, float: "right", marginLeft: 20, borderRadius: 15}}
              src="https://pbs.twimg.com/profile_images/1748153260203229184/sXJIGMBk_400x400.jpg"
            />
            <blockquote cite="https://x.com/VitalikButerin/status/1759369749887332577">
              <p>
                One application of AI that I am excited about is AI-assisted <strong>formal verification</strong> of code and bug finding.<br />
                Right now <strong>ethereum's biggest technical risk probably is bugs in code</strong>, and anything that could significantly change the game on that would be amazing.
              </p>
            </blockquote>
            <p>Vitalik Buterin, <a href="https://x.com/VitalikButerin/status/1759369749887332577"><cite>Feb 19, 2024 - X</cite></a></p>
          </div>
        </section>
        <HomepageFeatures />
        <section style={{marginTop: 80, marginBottom: 80}}>
          <div className="container" style={{maxWidth: 800}}>
            <h2 className="margin-bottom--lg text--center">
              Contact us!
            </h2>
            <p>If you want to audit your codebase with formal verification (Solidity, Rust, Go, OCaml) or for any other questions, contact us!</p>
            {/* <p>For more information about how formal verification can help your project, please contact us!</p> */}
            <HubspotContactForm />
          </div>
        </section>
      </main>
    </Layout>
  );
}
