'use client';

import { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import styles from './Newsletter.module.css';
import { haptics } from '@/lib/haptics';
import { useSiteContent } from '@/hooks/useSiteContent';
import { GLOBAL_DEFAULTS } from './globalContentDefaults';

export default function Newsletter() {
  const content = useSiteContent('global', GLOBAL_DEFAULTS);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    haptics.success();
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <section className={styles.newsletter}>
      <div className={styles.container}>
        <div className={styles.titleArea}>
          <div className={styles.aboutLabelWrapper}>
            <span className={styles.label}>{content.newsletterLabel}</span>
            <div className={styles.labelUnderline} />
          </div>
          <h2 className={styles.title}>{content.newsletterTitle}</h2>
        </div>

        <div className={styles.formArea}>
          <p className={styles.description}>
            {content.newsletterDescription}
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><MdEmail size={17} /></span>
              <input
                type="email"
                placeholder="Enter your email address"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
              />
            </div>
            <button type="submit" className={styles.submitBtn}>
              <MdEmail size={18} />
              {content.newsletterBtnLabel}
            </button>
          </form>
          <p className={styles.noSpam}>{content.newsletterNoSpamText}</p>
        </div>
      </div>
    </section>
  );
}
