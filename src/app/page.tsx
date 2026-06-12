'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, BookOpen, ChevronLeft, ChevronRight, Film, Play, ArrowRight, Star, Users, DollarSign, Zap, Flame, Shirt, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Newsletter from '@/components/frontend/Newsletter';
import VideoPlayerModal from '@/components/shared/VideoPlayerModal';
import styles from './page.module.css';
import { useState, useEffect, useRef } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl: string;
  authorId?: string;
  authorName: string;
  causeTag: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function Home() {
  const { user } = useAuth();
  const [reelVideos, setReelVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [votesRemaining, setVotesRemaining] = useState(0);
  const [votesTotal, setVotesTotal] = useState(0);
  const [hoveredReel, setHoveredReel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    fetch('/api/videos')
      .then(r => r.json())
      .then(data => setReelVideos(data.videos || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/votes', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const used = (data.userVotes as { count: number }[] ?? []).reduce((s, v) => s + v.count, 0);
        const total = data.votesTotal ?? 0;
        setVotesTotal(total);
        setVotesRemaining(Math.max(0, total - used));
      })
      .catch(() => {});
  }, [user]);

  const donateHref = !user ? '/join' : '/dashboard';

  const unitedTabs = ['People-Powered Community', 'United by Faith', 'Strength Through Unity'];

  return (
    <main className={styles.main}>

      {/* ===== HERO ===== */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBgWrapper}>
          <motion.div style={{ y: prefersReducedMotion ? 0 : heroY }} className={styles.heroBgInner}>
            <Image
              src="/images/coming-soon-bg.png"
              alt="American flag background"
              fill
              className={styles.heroBg}
              priority
              quality={100}
            />
          </motion.div>
          <div className={styles.heroGradient} />
          {/* Extra depth overlay */}
          <div className={styles.heroGradient2} />
        </div>

        <motion.div
          className={styles.heroContent}
          style={{ opacity: prefersReducedMotion ? 1 : heroOpacity }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="container">
            {/* Eyebrow */}
            <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FF003F" color="#FF003F" />)}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Trusted by thousands across America</span>
            </motion.div>

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
              <Link href={donateHref} className={styles.heroDonateBtn}>
                <DollarSign size={16} /> Donate Now
              </Link>
              <Link href="/join" className={styles.heroJoinBtn}>
                Join Now <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Floating stats */}
            <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '12px', marginTop: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: <Users size={16} />, value: '10,000+', label: 'Members' },
                { icon: <DollarSign size={16} />, value: '$126K+', label: 'Donated' },
                { icon: <Zap size={16} />, value: '963', label: 'Missions' },
              ].map((stat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50px', padding: '8px 16px' }}>
                  <span style={{ color: '#FF003F' }}>{stat.icon}</span>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: '14px' }}>{stat.value}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 3 }}
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={prefersReducedMotion ? {} : { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
        </motion.div>
      </section>

      {/* ===== IMPACT OVERVIEW ===== */}
      <section className={styles.lmsOverview}>
        <div className="container">
          <div className={styles.lmsGrid}>
            <motion.div
              className={styles.lmsVideoWrapper}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
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
                  <motion.div
                    className={styles.playIcon}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Play size={28} fill="white" color="white" />
                  </motion.div>
                  <div className={styles.volumeIcon}>
                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                  </div>
                </div>
                {/* Shine sweep on hover */}
                <div className={styles.videoShine} />
              </div>
            </motion.div>

            <div className={styles.lmsContent}>
              <motion.div
                className={styles.statsCard}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <motion.div className={styles.statItem} whileHover={{ scale: 1.02 }}>
                  <motion.span
                    className={styles.statNumberRed}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >963</motion.span>
                  <span className={styles.statLabel}>MISSIONS LAST YEAR</span>
                </motion.div>
                <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)', margin: '0 8px' }} />
                <motion.div className={styles.statItem} whileHover={{ scale: 1.02 }}>
                  <motion.span
                    className={styles.statNumberNavy}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >$126,477</motion.span>
                  <span className={styles.statLabel}>DONATED LAST YEAR</span>
                </motion.div>
              </motion.div>

              <motion.div
                className={styles.quoteBlock}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.2 } as never}
              >
                <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FF003F" color="#FF003F" />)}
                </div>
                <h3 className={styles.lmsQuoteText}>
                  &ldquo;I couldn&rsquo;t even begin to imagine what my outcome would have been if it wasn&rsquo;t for Faith Fighters For America.&rdquo;
                </h3>
                <p className={styles.lmsSubDesc}>
                  Mum-of-four Nikki Benstead, from Goldsithney, needed the help of the charity when her horse spooked and reared up, falling over backwards on top of Nikki and rolling over her.
                </p>
                <div className={styles.lmsCtas}>
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link href={donateHref} className={styles.donatePill}>Donate</Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link href="/join" className={styles.joinPill}>Join Now</Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DO ===== */}
      <section className={styles.whatWeDo}>
        <div className="container">
          <motion.div
            className={styles.whatWeDoHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
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
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {[
              { icon: ShieldCheck, title: 'Transparent Givings', desc: 'Every donation is handled with honesty and accountability, ensuring your support makes a real impact.' },
              { icon: HeartHandshake, title: 'Community Actions', desc: 'We work hand in hand with local communities to inspire change and strengthen the spirit of unity.' },
              { icon: BookOpen, title: 'Stories', desc: 'We share powerful stories of faith and hope that remind us what it means to stand together as one nation.' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className={styles.whatWeDoCard}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  className={styles.whatWeDoCardIconCircle}
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <feature.icon size={24} />
                </motion.div>
                <h4 className={styles.whatWeDoCardTitle}>{feature.title}</h4>
                <p className={styles.whatWeDoCardText}>{feature.desc}</p>
                <div className={styles.cardArrow}><ArrowRight size={16} /></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== UNITED BY FAITH ===== */}
      <section className={styles.unitedByFaith}>
        <div className="container">
          <div className={styles.unitedGrid}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInLeft}
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
                {unitedTabs.map((tab, i) => (
                  <motion.button
                    key={i}
                    className={`${styles.unitedTab} ${activeTab === i ? styles.unitedTabActive : ''}`}
                    onClick={() => setActiveTab(i)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {tab}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <motion.div
              className={styles.unitedImage}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={scaleIn}
            >
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }}>
                <Image
                  src="/images/shaking-hands.png"
                  alt="Handshake"
                  width={500}
                  height={400}
                  className={styles.unitedHands}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== REEL CAMPAIGN ===== */}
      <section className={styles.reelCampaign}>
        <div className="container">
          <div className={styles.reelGrid}>
            <motion.div
              className={styles.reelLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInLeft}
            >
              <h2 className={styles.reelMainTitle}>
                <span className={styles.redText}>TOGETHER</span>
                <span className={styles.navyText}>WE CAN</span>
                <span className={styles.blueText}>SAVE LIVES</span>
              </h2>
              <p className={styles.reelDesc}>
                Mum-of-four Nikki Benstead, from Goldsithney, needed the help of the charity when her horse spooked and reared up, falling over backwards on top of Nikki and rolling over her.
              </p>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href="/dashboard/campaigns" className={styles.castVoteBtn}>
                  Cast Vote <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            <div className={styles.reelCarouselArea}>
              <motion.button
                className={`${styles.reelNavBtn} ${styles.reelNavLeft}`}
                whileHover={{ scale: 1.1, backgroundColor: '#dc2626' }}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  const container = document.getElementById('reels-container');
                  if (container && container.firstElementChild) {
                    container.scrollBy({ left: -((container.firstElementChild as HTMLElement).offsetWidth + 20), behavior: 'smooth' });
                  }
                }}
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </motion.button>

              <div id="reels-container" className={styles.reelCardGrid}>
                {(reelVideos.length === 0
                  ? [
                      { img: 'reel1.png', title: "University 'security guard' needs money for medical...", progress: 65, id: 'p1' },
                      { img: 'reel2.png', title: 'Emergency fund needed for pro athlete, badly injured...', progress: 35, id: 'p2' },
                      { img: 'reel3.png', title: 'Fire fighter fund collection for Sarasota neighbourhood...', progress: 65, id: 'p3' },
                    ].map((reel, idx) => (
                      <motion.div
                        key={reel.id}
                        className={styles.reelCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                      >
                        <div className={styles.reelThumbWrapper}>
                          <Image src={`/images/${reel.img}`} alt={reel.title} width={226} height={400} className={styles.reelThumb} />
                          <div className={styles.reelPlayOverlay}>
                            <div className={styles.reelPlayBtn}><Play size={20} fill="white" color="white" /></div>
                          </div>
                        </div>
                        <p className={styles.reelCardTitle}>{reel.title}</p>
                        <div className={styles.reelProgressWrapper}>
                          <div className={styles.reelProgressBg}>
                            <motion.div
                              className={styles.reelProgressFill}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${reel.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + idx * 0.1 }}
                            >
                              <Flame size={14} color="#f97316" className={styles.fireEmoji} />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  : reelVideos.map((video, idx) => (
                      <motion.div
                        key={video.id}
                        className={styles.reelCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                        whileHover={{ y: -8 }}
                        onHoverStart={() => setHoveredReel(video.id)}
                        onHoverEnd={() => setHoveredReel(null)}
                        onClick={() => setSelectedVideo(video)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.reelThumbWrapper} style={{ position: 'relative', overflow: 'hidden' }}>
                          {video.thumbnailUrl ? (
                            <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s', transform: hoveredReel === video.id ? 'scale(1.06)' : 'scale(1)' }} />
                          ) : video.videoUrl ? (
                            <video src={video.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} preload="metadata" muted playsInline />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1f2e' }}>
                              <Film size={32} color="rgba(255,255,255,0.3)" />
                            </div>
                          )}
                          <div className={styles.reelPlayOverlay} style={{ opacity: hoveredReel === video.id ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                            <div className={styles.reelPlayBtn}><Play size={20} fill="white" color="white" /></div>
                          </div>
                          {/* Cause tag */}
                          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', color: 'white', fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {video.causeTag}
                          </div>
                        </div>
                        <p className={styles.reelCardTitle}>{video.title}</p>
                        <div className={styles.reelProgressWrapper}>
                          <div className={styles.reelProgressBg}>
                            <motion.div
                              className={styles.reelProgressFill}
                              initial={{ width: 0 }}
                              whileInView={{ width: '50%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            >
                              <Flame size={14} color="#f97316" className={styles.fireEmoji} />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>

              <motion.button
                className={`${styles.reelNavBtn} ${styles.reelNavRight}`}
                whileHover={{ scale: 1.1, backgroundColor: '#dc2626' }}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  const container = document.getElementById('reels-container');
                  if (container && container.firstElementChild) {
                    container.scrollBy({ left: (container.firstElementChild as HTMLElement).offsetWidth + 20, behavior: 'smooth' });
                  }
                }}
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMPACT STORY ===== */}
      <section className={styles.impactStory}>
        <div className="container">
          <div className={styles.impactGrid}>
            <motion.div
              className={styles.impactImages}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={scaleIn}
            >
              <div className={styles.impactImgWrapperMain}>
                <Image src="/images/flag-2.png" alt="American Flag" fill className={styles.impactImgBlend} />
              </div>
              <motion.div
                className={styles.impactImgWrapperSub}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <Image src="/images/prayer-hands-2.png" alt="Praying Hands" fill className={styles.impactImg} />
              </motion.div>
            </motion.div>

            <motion.div
              className={styles.impactContent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInRight}
            >
              <div className={styles.impactLabelArea}>
                <span className={styles.impactLabel}>IMPACT STORY</span>
                <div className={styles.impactLine} />
              </div>
              <h2 className={styles.impactTitle}>FAITH IN ACTION: RESTORING HOPE IN OUR COMMUNITIES</h2>
              <p className={styles.impactText}>
                Through outreach, prayer, and collective effort, Faith Fighters for America helps bring comfort, unity, and renewed belief to families in need &mdash; proving that when faith leads, change follows.
              </p>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link href="/stories" className={styles.readMoreBtnRed}>
                  READ MORE <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STORE ===== */}
      <section className={styles.store}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', background: 'linear-gradient(135deg, #0b1626 0%, #1a0a0a 50%, #0d0d1a 100%)', padding: 'clamp(32px, 5vw, 80px) clamp(24px, 5vw, 64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px', flexWrap: 'wrap' }}
          >
            {/* Background glows */}
            <div style={{ position: 'absolute', top: '-80px', right: '200px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(220,38,38,0.18)', filter: 'blur(100px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            {/* Stars pattern */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

            {/* Left: text */}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
              <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '2px', background: '#FF003F' }} />
                <span style={{ color: '#FF003F', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Official Store</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} style={{ fontFamily: 'var(--font-roboto)', fontWeight: 900, fontSize: 'clamp(32px,4vw,52px)', lineHeight: 1.05, textTransform: 'uppercase', color: 'white', marginBottom: '20px' }}>
                GEAR THAT{' '}
                <span style={{ background: 'linear-gradient(90deg, #FF003F, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GIVES BACK</span>
              </motion.h2>
              <motion.p variants={fadeInUp} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', lineHeight: 1.7, marginBottom: '36px' }}>
                Wear your faith proudly — our official FFFA store is launching soon with apparel and accessories that inspire unity, courage, and American spirit. Every purchase funds a mission.
              </motion.p>
              <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/store" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'linear-gradient(135deg, #FF003F, #dc2626)', color: 'white', borderRadius: '50px', fontWeight: 800, fontSize: '14px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,0,63,0.4)', fontFamily: 'var(--font-roboto)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Shop Now <ArrowRight size={15} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/store" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', fontFamily: 'var(--font-roboto)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    View All
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right: product mockup cards */}
            <motion.div variants={fadeInRight} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { label: 'Faith Hoodie', price: '$49', icon: <Shirt size={44} color="rgba(255,255,255,0.7)" />, color: '#1e293b', badge: 'NEW' },
                { label: 'FFFA Cap', price: '$29', icon: <ShoppingBag size={44} color="rgba(255,255,255,0.7)" />, color: '#1a0a0f', badge: 'HOT' },
                { label: 'Unity Tee', price: '$35', icon: <Shirt size={44} color="rgba(255,255,255,0.7)" />, color: '#0f172a', badge: null },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10, boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}
                  style={{
                    background: item.color, borderRadius: '20px', padding: '28px 20px 20px',
                    border: '1px solid rgba(255,255,255,0.08)', width: '130px',
                    textAlign: 'center', cursor: 'pointer', transition: 'box-shadow 0.3s',
                    marginBottom: i === 1 ? '0' : '20px',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {item.badge && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: item.badge === 'NEW' ? '#10b981' : '#FF003F', color: 'white', fontSize: '12px', fontWeight: 800, padding: '2px 7px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.badge}</div>
                  )}
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '12px', marginBottom: '6px' }}>{item.label}</div>
                  <div style={{ color: '#FF003F', fontWeight: 900, fontSize: '16px' }}>{item.price}</div>
                  <div style={{ marginTop: '12px', padding: '7px', background: 'rgba(255,255,255,0.07)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600 }}>Coming Soon</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <Newsletter />

      {selectedVideo && (
        <VideoPlayerModal
          videos={reelVideos}
          initialIndex={reelVideos.findIndex(v => v.id === selectedVideo.id)}
          onClose={() => setSelectedVideo(null)}
          currentUserId={user?.id}
          votesRemaining={votesRemaining}
          votesTotal={votesTotal}
          onVoteCast={(newRemaining) => setVotesRemaining(newRemaining)}
        />
      )}
    </main>
  );
}
