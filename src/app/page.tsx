'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, HeartHandshake, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Newsletter from '@/components/frontend/Newsletter';
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
            src="/images/coming-soon-bg.png"
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
              <motion.span className={`${styles.heroLine1} ${styles.redText}`} variants={fadeInUp}>ONE NATION.</motion.span>
              <motion.span className={`${styles.heroLine2} ${styles.whiteText}`} variants={fadeInUp}>ONE SPIRIT.</motion.span>
              <motion.span className={`${styles.heroLine3} ${styles.blueText}`} variants={fadeInUp}>ONE MISSION.</motion.span>
            </motion.h1>

            <motion.p className={styles.heroQuote} variants={fadeInUp}>
              Faith Fighters For America unites communities with compassion, making
              every act of giving a shared and visible moment of kindness.
            </motion.p>

            <motion.div className={styles.heroCtas} variants={fadeInUp}>
              <Link href="/coming-soon" className={styles.heroDonateBtn}>
                Donate
              </Link>
              <Link href="/coming-soon" className={styles.heroJoinBtn}>
                Join Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== WHO WE ARE SECTION ===== */}
      {/* ===== IMPACT OVERVIEW (LMS) SECTION ===== */}
      <section className={styles.lmsOverview}>
        <div className="container">
          <div className={styles.lmsGrid}>
            <motion.div
              className={styles.lmsVideoWrapper}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.videoCard}>
                <Image
                  src="/images/video-thumbnail.png"
                  alt="Impact Video"
                  width={394}
                  height={700}
                  className={styles.videoImg}
                />
                <div className={styles.videoOverlay}>
                  <div className={styles.playIcon}>
                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div className={styles.volumeIcon}>
                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className={styles.lmsContent}>
              <motion.div
                className={styles.statsCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className={styles.statItem}>
                  <span className={styles.statNumberRed}>963</span>
                  <span className={styles.statLabel}>MISSION TASKED TO LAST YEAR</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumberNavy}>$126,477</span>
                  <span className={styles.statLabel}>DONATED LAST YEAR</span>
                </div>
              </motion.div>

              <motion.div
                className={styles.quoteBlock}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className={styles.lmsQuoteText}>
                  &ldquo;I couldn&rsquo;t even begin to imagine what my outcome would have been if it wasn&rsquo;t for Faith Fighters For America.&rdquo;
                </h3>
                <p className={styles.lmsSubDesc}>
                  Mum-of-four Nikki Benstead, from Goldsithney, needed the help of the charity when her horse spooked and reared up, falling over backwards on top of Nikki and rolling over her.
                </p>

                <div className={styles.lmsCtas}>
                  <Link href="/coming-soon" className={styles.donatePill}>Donate</Link>
                  <Link href="/coming-soon" className={styles.joinPill}>Join Now</Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DO SECTION ===== */}
      <section className={styles.whatWeDo}>
        <div className="container">
          <motion.div 
            className={styles.whatWeDoHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className={styles.labelWrapper}>
              <span className={styles.whatWeDoLabel}>OUR PROMISES</span>
              <div className={styles.redUnderline} />
            </div>
            <h2 className={styles.whatWeDoTitle}>WHAT WE DO</h2>
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
                desc: "Every donation is handled with honesty and accountability, ensuring your support makes a real impact."
              },
              {
                icon: HeartHandshake,
                title: "Community Actions",
                desc: "We work hand in hand with local communities to inspire change and strengthen the spirit of unity."
              },
              {
                icon: BookOpen,
                title: "Stories",
                desc: "We share powerful stories of faith and hope that remind us what it means to stand together as one nation."
              }
            ].map((feature, idx) => (
              <motion.div key={idx} className={styles.whatWeDoCard} variants={fadeInUp}>
                <div className={styles.whatWeDoCardIconCircle}>
                  <feature.icon size={24} />
                </div>
                <h4 className={styles.whatWeDoCardTitle}>{feature.title}</h4>
                <p className={styles.whatWeDoCardText}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== UNITED BY FAITH SECTION ===== */}
      <section className={styles.unitedByFaith}>
        <div className="container">
          <div className={styles.unitedGrid}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <div className={styles.labelWrapper}>
                <span className={styles.unitedLabel}>ISSUES</span>
                <div className={styles.aboutUnderline} />
              </div>
              <h2 className={styles.unitedTitle}>UNITED BY FAITH. DRIVEN BY IMPACT</h2>
              <p className={styles.unitedText}>
                We&rsquo;re building a national movement of everyday Americans stepping up to strengthen communities, restore unity, and stand for what matters.
              </p>
              <div className={styles.unitedTabs}>
                <button className={styles.unitedTab}>People-Powered Community</button>
                <button className={styles.unitedTab}>United by Faith</button>
                <button className={styles.unitedTab}>Strength Through Unity</button>
              </div>
            </motion.div>
            <motion.div
              className={styles.unitedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/images/shaking-hands.png"
                alt="Handshake"
                width={500}
                height={400}
                className={styles.unitedHands}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== REEL CAMPAIGN SECTION ===== */}
      <section className={styles.reelCampaign}>
        <div className="container">
          <div className={styles.reelGrid}>
            <motion.div 
              className={styles.reelLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className={styles.reelMainTitle}>
                <span className={styles.redText}>TOGETHER</span>
                <span className={styles.navyText}>WE CAN</span>
                <span className={styles.blueText}>SAVE LIVES</span>
              </h2>
              <p className={styles.reelDesc}>
                Mum-of-four Nikki Benstead, from Goldsithney, needed the help of the charity when her horse spooked and reared up, falling over backwards on top of Nikki and rolling over her.
              </p>
              <Link href="/vote" className={styles.castVoteBtn}>Cast Vote</Link>
            </motion.div>

            <div className={styles.reelCarouselArea}>
              <button 
                className={`${styles.reelNavBtn} ${styles.reelNavLeft}`}
                onClick={() => {
                  const container = document.getElementById('reels-container');
                  if (container && container.firstElementChild) {
                    const scrollAmount = (container.firstElementChild as HTMLElement).offsetWidth + 20;
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                  }
                }}
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div 
                id="reels-container"
                className={styles.reelCardGrid}
              >
                {[
                  { img: 'reel1.png', title: "University 'security guard' needs money for medical...", progress: 65 },
                  { img: 'reel2.png', title: "Emergency fund needed for pro athlete, badly injured in game...", progress: 35 },
                  { img: 'reel3.png', title: "Fire fighter fund collection for Sarasota neighbourhood fire...", progress: 65 },
                  { img: 'reel1.png', title: "Local community support for educational supplies...", progress: 80 },
                  { img: 'reel2.png', title: "Healing hands: Medical outreach for remote clinics...", progress: 45 },
                  { img: 'reel3.png', title: "Youth sports scholarship fund for underprivileged kids...", progress: 90 },
                  { img: 'reel1.png', title: "Mental health awareness seminar: Donate to support...", progress: 55 }
                ].map((reel, idx) => (
                  <motion.div 
                    key={idx} 
                    className={styles.reelCard}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                  >
                    <div className={styles.reelThumbWrapper}>
                      <Image src={`/images/${reel.img}`} alt={reel.title} width={226} height={400} className={styles.reelThumb} />
                    </div>
                    <p className={styles.reelCardTitle}>{reel.title}</p>
                    <div className={styles.reelProgressWrapper}>
                      <div className={styles.reelProgressBg}>
                        <div className={styles.reelProgressFill} style={{ width: `${reel.progress}%` }}>
                          <span className={styles.fireEmoji}>🔥</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                className={`${styles.reelNavBtn} ${styles.reelNavRight}`}
                onClick={() => {
                  const container = document.getElementById('reels-container');
                  if (container && container.firstElementChild) {
                    const scrollAmount = (container.firstElementChild as HTMLElement).offsetWidth + 20;
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                  }
                }}
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMPACT STORY SECTION ===== */}
      <section className={styles.impactStory}>
        <div className="container">
          <div className={styles.impactGrid}>
            <motion.div 
               className={styles.impactImages}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className={styles.impactImgWrapperMain}>
                <Image 
                  src="/images/flag-2.png" 
                  alt="American Flag" 
                  fill 
                  className={styles.impactImgBlend} 
                />
              </div>
              <div className={styles.impactImgWrapperSub}>
                <Image 
                  src="/images/prayer-hands-2.png" 
                  alt="Praying Hands" 
                  fill 
                  className={styles.impactImg} 
                />
              </div>
            </motion.div>
            <motion.div 
              className={styles.impactContent}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className={styles.impactLabelArea}>
                <span className={styles.impactLabel}>IMPACT STORY</span>
                <div className={styles.impactLine} />
              </div>
              <h2 className={styles.impactTitle}>FAITH IN ACTION: RESTORING HOPE IN OUR COMMUNITIES</h2>
              <p className={styles.impactText}>
                Through outreach, prayer, and collective effort, Faith Fighters for America helps bring comfort, unity, and renewed belief to families in need &mdash; proving that when faith leads, change follows.
              </p>
              <Link href="/stories" className={styles.readMoreBtnRed}>
                READ MORE <span>&rarr;</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.store}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className={styles.storeLabelArea}>
              <span className={styles.impactLabel}>STORE</span>
              <div className={styles.impactUnderline} />
            </div>
            <h2 className={styles.storeTitle}>GEAR THAT GIVES BACK</h2>
            <p className={styles.storeSubtitle}>
              Get ready to wear your faith proudly — our official FFFA store is launching soon with apparel and accessories that inspire unity, courage, and American spirit.
            </p>
            <Link href="/store" className={styles.viewAllBtn}>VIEW ALL &gt;</Link>
          </motion.div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <Newsletter />
    </main>
  );
}
