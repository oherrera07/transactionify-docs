import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const NAV_CARDS = [
  {
    title: 'Quickstart',
    description: 'Step-by-step tutorials to help you integrate the Transactionify API into your application quickly.',
    link: '/docs/getting-started/quickstart',
    label: 'Read the guides',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: 'Tutorials',
    description: 'Detailed technical reference for all endpoints — accounts, payments, balance, and transactions.',
    link: '/docs/tutorials/make-payment',
    label: 'See the reference',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'API Explorer',
    description: 'Try the Transactionify API live in our interactive sandbox — no setup required, just your API key.',
    link: '/docs/sandbox/api-explorer',
    label: 'Open explorer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

function NavCard({ title, description, link, label, icon, index }) {
  return (
    <Link to={link} className={styles.card} style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}</p>
      <span className={styles.cardLink}>
        {label}
        <svg className={styles.cardArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Developer Documentation"
      description="Explore guides, API reference, and tools to integrate Transactionify payments into your app."
    >
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroGlow2} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Developer Documentation
          </div>
          <h1 className={styles.heroH1}>
            {siteConfig.title}<br />
            <span className={styles.heroAccent}>API</span> Documentation
          </h1>
          <p className={styles.heroSub}>
            Explore our guides, API reference, and interactive tools to integrate
            payments and transactions into your application.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/docs/getting-started/quickstart" className={styles.btnPrimary}>
              Quick start
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="docs/sandbox/api-explorer" className={styles.btnSecondary}>
              API Explorer
            </Link>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className={styles.cardsSection}>
        <div className={styles.cardsInner}>
          <h2 className={styles.cardsTitle}>Everything you need to build</h2>
          <p className={styles.cardsSub}>Comprehensive resources for developers at every stage</p>
          <div className={styles.cardsGrid}>
            {NAV_CARDS.map((card, i) => (
              <NavCard key={card.title} {...card} index={i} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
