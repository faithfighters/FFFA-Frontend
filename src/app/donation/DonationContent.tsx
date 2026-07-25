'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import styles from './page.module.css';
import { haptics } from '@/lib/haptics';

const donationOptions = [
  { amount: '$5', value: 5 },
  { amount: '$15', value: 15 },
  { amount: '$25', value: 25 },
  { amount: '$50', value: 50 },
  { amount: '$70', value: 70 },
  { amount: '$100', value: 100 },
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
  const [loading, setLoading] = useState<number | 'custom' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      setShowCelebration(true);
      router.replace('/donation');
    }
  }, [searchParams, router]);

  const handleDonate = async (amount: number, target: number) => {
    if (!amount || amount <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }
    setErrorMessage('');
    setLoading(target);
    haptics.tap();

    try {
      const res = await fetch('/api/stripe/donate-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.message || 'Unable to start checkout. Please try again.');
        setLoading(null);
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      setLoading(null);
    }
  };

  const handleCustomDonate = async () => {
    setErrorMessage('');
    setLoading('custom');
    haptics.tap();

    try {
      const res = await fetch('/api/stripe/donate-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Empty body = let customer choose price on Stripe page
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.message || 'Unable to start checkout. Please try again.');
        setLoading(null);
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      setLoading(null);
    }
  };

  return (
    <>
      {/* ===== SUPPORT OUR CAUSE SECTION ===== */}
      <section className={`section ${styles.introSection}`}>
        <div className="container">
          <div className={styles.twoColumn}>
            <div className={styles.imageCol}>
              <Image
                src="/images/donate-img.jpg"
                alt="Support Our Cause"
                fill
                priority
                className={styles.donateImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className={styles.textCol}>
              <span className="section-label section-label--red" style={{ color: 'rgba(255,255,255,0.55)' }}>Donation</span>
              <h2 className="heading-lg">Support Our Cause</h2>
              <div className={styles.contentBlock}>
                <p>
                  Your support helps us continue our mission to strengthen faith, unity, and purpose
                  across America. Every contribution — no matter the size — fuels our outreach
                  programs, community initiatives, and campaigns that remind people of the power
                  of faith in action.
                </p>
                <p>
                  By donating, you become part of a movement dedicated to rebuilding the moral
                  and spiritual foundation of our nation. Together, we can light the path toward a
                  stronger, more faithful America.
                </p>
              </div>

              {/* Dynamic custom amount donation button (redirects to Stripe with custom_unit_amount enabled) */}
              <button
                disabled={loading !== null}
                onClick={handleCustomDonate}
                className={styles.donateNowBtn}
              >
                {loading === 'custom' ? 'Loading...' : 'Donate Now'}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '4px' }}>
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DONATION OPTIONS GRID SECTION ===== */}
      <section className={`section ${styles.optionsSection}`}>
        <div className="container">
          <div className={styles.optionsHeader}>
            <span className="section-label section-label--red" style={{ display: 'inline-block', color: 'rgba(255,255,255,0.55)', margin: '0 auto var(--space-md) auto' }}>Select Amount</span>
            <h2 className="heading-md">Choose Your Contribution</h2>
            <p className="text-body text-body--light" style={{ marginTop: '12px' }}>
              Select a predefined amount below to contribute directly via our secure checkout platform.
            </p>
          </div>
          <div className={styles.grid}>
            {donationOptions.map((opt) => (
              <div key={opt.value} className={styles.card}>
                <div className={styles.amount}>{opt.amount}</div>
                <div className={styles.cardLabel}>Faith Fighters support</div>
                <button
                  onClick={() => handleDonate(opt.value, opt.value)}
                  disabled={loading !== null}
                  className={styles.cardBtn}
                >
                  {loading === opt.value ? 'Loading...' : 'Donate'}
                </button>
              </div>
            ))}
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
