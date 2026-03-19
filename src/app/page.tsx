'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, HeartHandshake, BookOpen } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import styles from './page.module.css';

// Reusable animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <main className={styles.main}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBgWrapper}>
          <Image
            src="/images/hero-flag.png"
            alt="American flag background"
            fill
            className={styles.heroBg}
            priority
            quality={100}
          />
          <div className={styles.heroGradient} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="container">
            <motion.h1 className={styles.heroTitle} variants={staggerContainer}>
              <motion.span className={styles.heroLine1} variants={fadeInUp}>One Nation.</motion.span>
              <motion.span className={styles.heroLine2} variants={fadeInUp}>One Spirit.</motion.span>
              <motion.span className={styles.heroLine3} variants={fadeInUp}>One Mission.</motion.span>
            </motion.h1>

            <motion.p className={styles.heroQuote} variants={fadeInUp}>
              "Faith Fighters For America unites communities with compassion,
              making every act of giving a shared and visible moment of kindness."
            </motion.p>

            <motion.div className={styles.heroCtas} variants={fadeInUp}>
              <Link href="/join" className="btn btn--primary">
                DONATE NOW
                <span className="btn-arrow">→</span>
              </Link>
              <Link href="/about" className="btn btn--outline">
                OUR MISSION
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== WHO WE ARE SECTION ===== */}
      <section className={`section section--dark ${styles.whoWeAre}`}>
        <div className="container">
          <div className={styles.whoWeAreGrid}>
            <motion.div
              className={styles.whoWeAreText}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <span className="section-label section-label--red">Who We Are</span>
              <h2 className="heading-lg">Restoring the Fabric of Our Nation</h2>
              <div className={styles.whoWeAreContent}>
                <p className="text-body">
                  Faith Fighters For America unites communities with compassion, making every act of giving a shared and visible moment of kindness.
                </p>
                <p className="text-body text-body--light">
                  Our vision is to create a transparent movement where everyone can see and celebrate how helping neighbors becomes a story that inspires us all. We believe in the power of faith-driven action to bridge divides and elevate the standard of community care.
                </p>
              </div>
              <Link href="/about" className="btn btn--secondary mt-8">
                READ FULL STORY
              </Link>
            </motion.div>

            <motion.div
              className={styles.whoWeAreImage}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Image
                src="/images/praying-hands.png"
                alt="Praying hands painted with American flag"
                width={600}
                height={700}
                className={styles.prayingHands}
                quality={95}
              />
              <div className={styles.imageGlow}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DO SECTION ===== */}
      <section className={`section ${styles.whatWeDo}`}>
        <div className="container">
          <motion.div
            className={styles.whatWeDoHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="section-label">Our Promises</span>
            <h2 className="heading-lg">Pillars of Action</h2>
          </motion.div>

          <motion.div
            className={styles.whatWeDoGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              {
                icon: ShieldCheck,
                title: "Transparent Givings",
                desc: "Every donation is handled with honesty and absolute accountability, ensuring your support makes a documented real impact."
              },
              {
                icon: HeartHandshake,
                title: "Community Action",
                desc: "We work hand in hand with local organizations to inspire change, provide immediate relief, and strengthen the spirit of unity."
              },
              {
                icon: BookOpen,
                title: "Impact Stories",
                desc: "We share powerful, video-verified stories of faith and hope that remind us what it means to stand together as one nation."
              }
            ].map((feature, idx) => (
              <motion.div key={idx} className="card" variants={fadeInUp}>
                <div className="card__icon">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h4 className="card__title">{feature.title}</h4>
                <p className="card__text">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== UNITED BY FAITH SECTION ===== */}
      <section className={`section section--navy ${styles.unitedByFaith}`}>
        <div className="container">
          <div className={styles.unitedGrid}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="section-label section-label--red">Our Commitment</span>
              <h2 className="heading-lg">United By Faith.<br />Driven By Impact.</h2>
              <p className="text-body mt-6 mb-10" style={{ maxWidth: '600px' }}>
                We're building a national movement of everyday Americans stepping up to strengthen communities, restore unity, and stand for what matters. When we pool our resources, the impact is undeniable.
              </p>

              <div className={styles.statGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statValue}>80<span className={styles.statPercent}>%</span></div>
                  <div className={styles.statLabel}>Directly to Charities</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statValue}>100<span className={styles.statPercent}>%</span></div>
                  <div className={styles.statLabel}>Voter Controlled</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className={styles.unitedDecoration}></div>
      </section>

      {/* ===== IMPACT STORY SECTION ===== */}
      <section className={styles.impactStory}>
        <div className={styles.impactImage}>
          <Image
            src="/images/handshake-flag.png"
            alt="Handshake with American flag painted hands"
            fill
            className={styles.impactBg}
            quality={90}
          />
          <div className={styles.impactImageOverlay}></div>
        </div>
        <motion.div
          className={styles.impactContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className={styles.impactCard}>
            <span className="section-label section-label--red">Field Report</span>
            <h2 className="heading-md" style={{ color: "var(--color-dark)", marginBottom: "var(--space-md)" }}>
              Restoring Hope Across State Lines
            </h2>
            <p className="text-body" style={{ color: "var(--color-gray-700)", marginBottom: "var(--space-xl)" }}>
              Through extreme transparent outreach, prayer, and collective financial effort, Faith Fighters for America helps bring comfort, unity, and renewed belief to families in need — proving that when faith leads, profound change follows.
            </p>
            <Link href="/media" className="btn btn--dark">
              WATCH VIDEOS
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <Newsletter />
    </main>
  );
}
