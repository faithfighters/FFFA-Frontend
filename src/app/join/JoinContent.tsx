'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import Newsletter from '@/components/frontend/Newsletter';
import { PLAN_CONFIG } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import { Vote, BarChart3, Video, Users } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const features = [
  { icon: <Vote size={32} color="#dc2626" />, title: 'Vote on Causes', text: 'Allocate your votes to the charitable causes you care about most each quarter.' },
  { icon: <BarChart3 size={32} color="#dc2626" />, title: 'Track Impact', text: 'See exactly where your money goes with real-time donation tracking and impact reports.' },
  { icon: <Video size={32} color="#dc2626" />, title: 'Share Stories', text: 'Upload and watch inspiring video testimonials from our community members.' },
  { icon: <Users size={32} color="#dc2626" />, title: 'Join Community', text: 'Connect with like-minded Americans united by faith, compassion, and purpose.' },
];

const featureGroups = [
  {
    label: 'Access & Content',
    items: [
      'Full platform access (live streams, impact reports, stories)',
      'Exclusive community updates and newsletters',
      'Behind-the-scenes previews of upcoming projects',
    ],
  },
  {
    label: 'Voting & Participation',
    items: [
      '30 donation votes per cycle — 1 vote per day',
      'Vote on and propose community initiatives',
    ],
  },
  {
    label: 'Community & Events',
    items: [
      'Priority access to virtual town halls',
      'Exclusive Freedom Roundtable sessions with leadership (quarterly)',
    ],
  },
  {
    label: 'Recognition & Rewards',
    items: [
      'Official badge: "Faith Fighter"',
      'Annual digital certificate of contribution',
      'Personalized thank-you video from the team',
    ],
  },
  {
    label: 'Merch & Benefits',
    items: [
      '15% discount on all merch',
      'Free exclusive annual merch item',
    ],
  },
];

export default function JoinContent() {
  const { user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  const handleBuy = async (planKey: string) => {
    setCheckoutLoading(planKey);
    setCheckoutError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.message || 'Could not start checkout. Please try again.');
        setCheckoutLoading(null);
      }
    } catch {
      setCheckoutError('Network error. Please try again.');
      setCheckoutLoading(null);
    }
  };

  const plan = { key: 'faith_fighter' as const, ...PLAN_CONFIG.faith_fighter };

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
            <h2 className="heading-lg">Monthly Donation</h2>
            <p className={styles.pricingSubtext}>
              80% of every dollar goes directly to the causes your community votes for.
              Donations are fully tax-deductible.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className={styles.planCard}
          >
            {/* Left: header + CTA */}
            <div className={styles.planLeft}>
              <div className={styles.popularBadge} style={{ position: 'static', transform: 'none', alignSelf: 'flex-start', marginBottom: '24px' }}>Popular</div>
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.planPrice}>
                <span className={styles.pricingDollar}>$</span>
                <span className={styles.pricingAmount}>{Math.floor(plan.price)}</span>
                <span className={styles.planPeriod}>/month</span>
              </div>
              <p className={styles.planTagline}>Have faith, shape the future — your voice carries more weight.</p>

              {!user ? (
                <Link href="/register" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                  Purchase Now
                </Link>
              ) : user.plan ? (
                <button
                  onClick={() => handleBuy(plan.key)}
                  disabled={checkoutLoading === plan.key}
                  className="btn btn--primary"
                  style={{ width: '100%', justifyContent: 'center', fontFamily: 'inherit', cursor: checkoutLoading === plan.key ? 'not-allowed' : 'pointer', opacity: checkoutLoading === plan.key ? 0.7 : 1, marginTop: 'auto' }}
                >
                  {checkoutLoading === plan.key ? 'Redirecting…' : '🔁 Buy More Votes'}
                </button>
              ) : (
                <button
                  onClick={() => handleBuy(plan.key)}
                  disabled={checkoutLoading === plan.key}
                  className="btn btn--primary"
                  style={{ width: '100%', justifyContent: 'center', fontFamily: 'inherit', cursor: checkoutLoading === plan.key ? 'not-allowed' : 'pointer', opacity: checkoutLoading === plan.key ? 0.7 : 1, marginTop: 'auto' }}
                >
                  {checkoutLoading === plan.key ? 'Redirecting…' : 'Purchase Now'}
                </button>
              )}
              {checkoutError && (
                <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '10px', textAlign: 'center' }}>{checkoutError}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginTop: '12px' }}>
                No contracts — cancel anytime
              </p>
            </div>

            {/* Right: grouped feature list */}
            <div className={styles.planRight}>
              {featureGroups.map((group) => (
                <div key={group.label} className={styles.featureGroup}>
                  <p className={styles.featureGroupLabel}>{group.label}</p>
                  {group.items.map((item) => (
                    <div key={item} className={styles.featureItem}>
                      <span className={styles.featureCheck}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}
          >
            No contracts — cancel anytime.
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
