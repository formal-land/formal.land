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
              <em>Formal verification services for software</em>
            </p>
            <p className={styles.hero__subsubtitle} style={{marginTop: 80, marginBottom: 80}}>
              Ship Bug-Free Code with Mathematical Certainty!
            </p>
            <p className={styles.hero__subsubtitle} style={{marginTop: 80, marginBottom: 80}}>
              Prove your software systems are correct — no edge cases, no surprises.
            </p>
            <div className={styles.buttons} style={{marginTop: 80, marginBottom: 80}}>
              <Link
                className={clsx('button button--info button--lg', styles.hero__button)}
                to="mailto:&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;"
              >
                Contact us&nbsp;<ExternalLink />
              </Link>
              <Link
                className={clsx('button button--secondary button--lg', styles.hero__button)}
                to="mailto:&#099;&#111;&#110;&#116;&#097;&#099;&#116;&#064;formal&#046;&#108;&#097;&#110;&#100;?subject=Start%20my%20free%20trial&body=Dear%20Formal%20Land%20team%2C%0A%0AI%20would%20like%20to%20start%20the%20free%20trial%20to%20audit%20my%20code.%20Please%20provide%20me%20with%20the%20necessary%20information.%0A%0AThanks%20and%20best%20regards"
              >
                🚀&nbsp;Start free trial
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
