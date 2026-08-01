'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import styles from './page.module.css';
import { haptics } from '@/lib/haptics';

const amountOptions = [
  { value: 25, label: '1 family meal' },
  { value: 50, label: 'Shelter kit' },
  { value: 100, label: 'Youth mentor' },
  { value: 250, label: 'Relief supplies' },
  { value: 500, label: 'Rebuild fund' },
];

const causeOptions = [
  "Where it's needed most",
  'Disaster Relief',
  'Youth Programs',
  'Medical Relief',
  'Food Security',
  'Housing',
];

function PurchaseCelebrationModal({ onClose }: { onClose: () => void }) {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          height: 'min(640px, 90vh)',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundImage: 'url(/images/vote_celebration.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '48px 24px 32px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
          border: '1.5px solid rgba(255,255,255,0.08)',
          animation: 'vpm_slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
          boxSizing: 'border-box',
          color: '#ffffff'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.2)',
            background: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Top Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', textAlign: 'center' }}>
          {/* Checkmark Circle Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid #ff7b5a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            background: 'rgba(255, 123, 90, 0.1)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff7b5a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Donation Successful!
          </h2>

          <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px', color: 'rgba(255,255,255,0.9)' }}>
            Thank you for your <span style={{ color: '#ff7b5a' }}>contribution!</span>
          </p>

          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5, padding: '0 12px' }}>
            Your support helps us continue our mission to strengthen faith, unity, and purpose across America.
          </p>
        </div>

        {/* Bottom Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px', zIndex: 10 }}>
          {/* Supporting Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(15, 13, 23, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            {/* Heart Icon Circle */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff7b5a, #e7421b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(231, 66, 27, 0.3)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                Thank you for <span style={{ color: '#ff7b5a' }}>Supporting!</span>
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>
                Together we can bring hope and rebuild lives
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(231, 66, 27, 0.4)',
              transition: 'transform 0.2s',
            }}
          >
            Great!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes vpm_slideUp { from { transform:translateY(24px);opacity:0 } to { transform:translateY(0);opacity:1 } }
      `}</style>
    </div>
  );
}

export default function DonationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showCelebration, setShowCelebration] = useState(false);
  const [selected, setSelected] = useState<number | 'custom'>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [cause, setCause] = useState(causeOptions[0]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      setShowCelebration(true);
      router.replace('/donation');
    }
  }, [searchParams, router]);

  const handleDonate = async () => {
    setErrorMessage('');

    if (selected === 'custom') {
      const amount = Number(customAmount);
      if (!amount || amount <= 0) {
        setErrorMessage('Please enter a valid amount.');
        return;
      }
    }

    setLoading(true);
    haptics.tap();

    try {
      const body = selected === 'custom' ? { amount: Number(customAmount) } : { amount: selected };
      const res = await fetch('/api/stripe/donate-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.message || 'Unable to start checkout. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      setLoading(false);
    }
  };

  const donateLabel = selected === 'custom'
    ? (customAmount ? `$${customAmount}` : '')
    : `$${selected}`;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroDots} />
        <div className="container">
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>Give Today</span>
            <h1 className={styles.heroTitle}>Your gift, made visible</h1>
            <p className={styles.heroLead}>
              100% transparent. Every dollar tracked to a mission you can follow from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* ===== DONATE CARD ===== */}
      <section className={`section ${styles.donateSection}`}>
        <div className="container">
          <div className={styles.donateCard}>
            <label className={styles.amountLabel}>Choose an amount</label>
            <div className={styles.amtGrid}>
              {amountOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.amtBtn} ${selected === opt.value ? styles.amtBtnActive : ''}`}
                  onClick={() => setSelected(opt.value)}
                >
                  <b>${opt.value}</b>
                  <small>{opt.label}</small>
                </button>
              ))}
              <button
                type="button"
                className={`${styles.amtBtn} ${selected === 'custom' ? styles.amtBtnActive : ''}`}
                onClick={() => setSelected('custom')}
              >
                <b className={styles.customIcon}>✎</b>
                <small>Custom</small>
              </button>
            </div>

            {selected === 'custom' && (
              <div className={styles.customWrap}>
                <label className={styles.fieldLabel}>Custom amount</label>
                <input
                  type="number"
                  className={styles.customInput}
                  placeholder="Enter amount ($)"
                  min={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Direct my gift to</label>
              <select className={styles.select} value={cause} onChange={(e) => setCause(e.target.value)}>
                {causeOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className={styles.donateBtn}
              onClick={handleDonate}
              disabled={loading || (selected === 'custom' && !customAmount)}
            >
              {loading ? 'Loading…' : (
                <>Donate {donateLabel} <span className={styles.donateBtnArrow}>→</span></>
              )}
            </button>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <div className={styles.secureNote}>
              <span className={styles.secureIcon}>🔒</span>
              <span>Secure checkout via Stripe. You&apos;ll receive a tax-deductible receipt and a link to follow your mission.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFIT ROWS ===== */}
      <section className={`section ${styles.benefitsSection}`}>
        <div className="container">
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitRow}>
              <div className={styles.benefitIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
              <div>
                <h4>Tracked to the dollar</h4>
                <p>Follow your gift to the exact mission it funds.</p>
              </div>
            </div>
            <div className={styles.benefitRow}>
              <div className={`${styles.benefitIcon} ${styles.benefitIconGold}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
              </div>
              <div>
                <h4>Boots on the ground</h4>
                <p>963 missions delivered by real volunteers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Celebration Modal on Successful checkout */}
      {showCelebration && (
        <PurchaseCelebrationModal onClose={() => setShowCelebration(false)} />
      )}
    </>
  );
}
