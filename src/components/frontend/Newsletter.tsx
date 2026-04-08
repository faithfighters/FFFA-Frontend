'use client';

import { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <section className={styles.newsletter}>
      <div className={styles.container}>
        <div className={styles.titleArea}>
          <div className={styles.aboutLabelWrapper}>
            <span className={styles.label}>NEWSLETTER</span>
            <div className={styles.labelUnderline} />
          </div>
          <h2 className={styles.title}>STAY CONNECTED TO THE MOVEMENT</h2>
        </div>

        <div className={styles.formArea}>
          <p className={styles.description}>
            Get inspiring stories, volunteer opportunities, community updates, and behind-the-scenes access delivered straight to your inbox.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email address"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitBtn}>
              <MdEmail size={18} />
              JOIN THE MISSION
            </button>
          </form>
          <p className={styles.noSpam}>No spam. Just purpose-driven updates.</p>
        </div>
      </div>
    </section>
  );
}
