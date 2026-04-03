'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Newsletter from '@/components/frontend/Newsletter';
import { PLAN_CONFIG } from '@/lib/types';
import styles from './page.module.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const features = [
  { icon: '🗳️', title: 'Vote on Causes', text: 'Allocate your votes to the charitable causes you care about most each quarter.' },
  { icon: '📊', title: 'Track Impact', text: 'See exactly where your money goes with real-time donation tracking and impact reports.' },
  { icon: '🎥', title: 'Share Stories', text: 'Upload and watch inspiring video testimonials from our community members.' },
  { icon: '🤝', title: 'Join Community', text: 'Connect with like-minded Americans united by faith, compassion, and purpose.' },
];

export default function JoinContent() {
  const plans = [
    { key: 'basic' as const, ...PLAN_CONFIG.basic, featured: false },
    { key: 'standard' as const, ...PLAN_CONFIG.standard, featured: true },
    { key: 'premium' as const, ...PLAN_CONFIG.premium, featured: false },
  ];

  return (
    <>
      {/* Pricing Section */}
      <section className={`section ${styles.pricingSection}`}>
        <div className="container">
          <motion.div
            style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-label" style={{ display: 'inline-block' }}>Membership Plans</span>
            <h2 className="heading-lg">Choose Your Level of Impact</h2>
            <p className={styles.pricingSubtext}>
              80% of every dollar goes directly to the causes your community votes for.
              Donations are fully tax-deductible.
            </p>
          </motion.div>

          <div className={styles.pricingGrid}>
            {plans.map((plan, i) => (
              <motion.div
                key={plan.key}
                custom={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  boxShadow: plan.featured
                    ? '0 24px 48px rgba(219,0,0,0.22)'
                    : '0 20px 40px rgba(0,0,0,0.13)',
                  transition: { duration: 0.25 },
                }}
                className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}
              >
                {plan.featured && <div className={styles.popularBadge}>Popular</div>}
                <div className={styles.pricingHeader}>
                  <h3 className={styles.pricingName}>{plan.name}</h3>
                  <div className={styles.pricingPrice}>
                    <span className={styles.pricingDollar}>$</span>
                    <span className={styles.pricingAmount}>{Math.floor(plan.price)}</span>
                    <span className={styles.pricingCents}>.{(plan.price % 1).toFixed(2).slice(2)}</span>
                    <span className={styles.pricingPeriod}>/month</span>
                  </div>
                </div>
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
                <Link
                  href={`/register?plan=${plan.key}`}
                  className="btn btn--primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}
          >
            Monthly, quarterly, or annual recurring options available. No contracts — cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-label section-label--light" style={{ display: 'inline-block' }}>Why Join</span>
            <h2 className="heading-lg">What Members Get</h2>
          </motion.div>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="card"
              >
                <div className="card__icon" style={{ fontSize: '2rem', background: 'none' }}>{f.icon}</div>
                <h4 className="card__title" style={{ color: 'white' }}>{f.title}</h4>
                <p className="card__text">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
