'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Fraunces } from 'next/font/google';
import { Sparkles, ArrowRight, Play, Star, ShieldCheck, HeartHandshake, BookOpen, ChevronRight, Users, Heart } from 'lucide-react';
import Newsletter from '@/components/frontend/Newsletter';
import { useAuth } from '@/context/AuthContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { HOME_DEFAULTS } from './homeContent';
import { STORIES, STORY_IMG, PRODUCTS } from './homeData';
import styles from './page.module.css';

const fraunces = Fraunces({
    subsets: ['latin'],
    weight: ['600', '700', '800'],
    style: ['normal', 'italic'],
    variable: '--font-fraunces',
    display: 'swap',
});

const HERO_VIDEO = 'https://faithfightersamerica.com/video13.mp4';

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// Icons aren't CMS-editable in this phase — matched positionally to
// content.whatWeDo, whose title/desc text does come from the CMS.
const WHAT_WE_DO_ICONS = [ShieldCheck, HeartHandshake, BookOpen];

function VideoFacade({ src, caption, poster, onOpen, inline }: { src: string; caption: string; poster: string; onOpen: () => void; inline?: boolean }) {
    const [playingInline, setPlayingInline] = useState(false);

    if (inline && playingInline) {
        return (
            <div className={styles.videoFacade} style={{ background: '#000' }}>
                <video className={styles.videoFacadeMedia} style={{ objectFit: 'contain' }} src={src} controls autoPlay playsInline />
            </div>
        );
    }

    return (
        <div className={styles.videoFacade} onClick={() => (inline ? setPlayingInline(true) : onOpen())}>
            <video className={styles.videoFacadeMedia} src={`${src}#t=2`} poster={poster} muted playsInline preload="metadata" />
            <div className={styles.videoFacadeOverlay}>
                <motion.div className={styles.videoPlayBtn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Play size={22} fill="white" color="white" />
                </motion.div>
                <span className={styles.videoFacadeCaption}>{caption}</span>
            </div>
        </div>
    );
}

export default function Home() {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [playingCampaign, setPlayingCampaign] = useState<string | null>(null);

    const handleCampaignVideoClick = (key: string, video: string) => {
        if (window.matchMedia('(min-width: 1024px)').matches) {
            setPlayingCampaign(key);
        } else {
            setLightboxSrc(video);
        }
    };
    const { user } = useAuth();
    const campaignsHref = user ? '/dashboard/campaigns' : '/login';
    const content = useSiteContent('home', HOME_DEFAULTS);

    return (
        <main className={`${fraunces.variable} ${styles.main}`}>

            {/* ===== HERO ===== */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroGrid}>
                        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                            <motion.div variants={fadeInUp} className={styles.heroBadge}>
                                <Sparkles size={14} />
                                <span>{content.heroBadgeText}</span>
                            </motion.div>

                            <motion.h1 className={styles.heroTitle} variants={staggerContainer}>
                                <motion.span className={styles.heroLineNation} variants={fadeInUp}>{content.heroTitleLine1}</motion.span>
                                <motion.span className={styles.heroLineSpirit} variants={fadeInUp}>{content.heroTitleLine2}</motion.span>
                                <motion.span className={styles.heroLineMission} variants={fadeInUp}>{content.heroTitleLine3}</motion.span>
                            </motion.h1>

                            <motion.p className={styles.heroLead} variants={fadeInUp}>
                                {content.heroLead}
                            </motion.p>

                            <motion.div variants={fadeInUp} className={styles.heroTrust}>
                                <span>{content.heroTrustText}</span>
                            </motion.div>
                        </motion.div>

                        <motion.div className={styles.heroMedia} variants={fadeInRight} initial="hidden" animate="visible">
                            <VideoFacade src={HERO_VIDEO} caption={content.heroVideoCaption} poster={content.heroVideoPoster} onOpen={() => setLightboxSrc(HERO_VIDEO)} inline />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== JOIN NOW CTA ===== */}
            <div className="container">
                <motion.div
                    className={styles.joinNowStrip}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <Link href={user ? '/dashboard' : '/register?intent=donate'} className={styles.joinNowBigBtn}>
                        {user ? 'Go to Dashboard' : content.joinNowLabel} <ArrowRight size={20} />
                    </Link>
                    {!user && (
                        <Link href="/register?intent=help" className={styles.needHelpBtn}>
                            {content.needHelpLabel}
                        </Link>
                    )}
                </motion.div>
            </div>

            {/* ===== MOBILE-ONLY VIDEO ===== */}
            <section className={styles.mobileVideoSection}>
                <div className="container">
                    <VideoFacade src={HERO_VIDEO} caption={content.heroVideoCaption} poster={content.heroVideoPoster} onOpen={() => setLightboxSrc(HERO_VIDEO)} />
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className={styles.testimonials}>
                <div className="container">
                    <motion.div
                        className={styles.testimonialGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {content.testimonials.map((t) => (
                            <motion.div key={t.name} className={styles.testimonialCard} variants={fadeInUp}>
                                <div className={styles.starsRow}>
                                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#E24B34" color="#E24B34" />)}
                                </div>
                                <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                                <p className={styles.testimonialBio}>{t.bio}</p>
                                <div className={styles.testimonialWho}>
                                    <span className={styles.testimonialAvatar}>{t.initials}</span>
                                    <div>
                                        <b>{t.name}</b>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== WHAT WE DO ===== */}
            <section className={styles.whatWeDo}>
                <div className="container">
                    <motion.div
                        className={styles.sectionHeader}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeInUp}
                    >
                        <span className={styles.eyebrow}>{content.whatWeDoEyebrow}</span>
                        <h2 className={styles.sectionTitle}>{content.whatWeDoTitle}</h2>
                    </motion.div>

                    <motion.div
                        className={styles.whatWeDoGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={staggerContainer}
                    >
                        {content.whatWeDo.map((feature, i) => {
                            const Icon = WHAT_WE_DO_ICONS[i] ?? ShieldCheck;
                            return (
                                <motion.div
                                    key={feature.title}
                                    className={styles.whatWeDoCard}
                                    variants={fadeInUp}
                                    whileHover={{ y: -8 }}
                                >
                                    <div className={styles.whatWeDoIcon}>
                                        <Icon size={24} />
                                    </div>
                                    <h4 className={styles.whatWeDoTitle}>{feature.title}</h4>
                                    <p className={styles.whatWeDoText}>{feature.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ===== ACTIVE CAMPAIGNS ===== */}
            <section className={styles.campaigns}>
                <div className="container">
                    <motion.div
                        className={styles.sectionHeader}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeInUp}
                    >
                        <span className={styles.eyebrow}>{content.campaignsEyebrow}</span>
                        <h2 className={styles.sectionTitle}>{content.campaignsTitle}</h2>
                    </motion.div>

                    <motion.div
                        className={styles.campaignGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={staggerContainer}
                    >
                        {STORIES.slice(0, 3).map((story) => (
                            <motion.div key={story.key} className={styles.campaignCard} variants={fadeInUp}>
                                {playingCampaign === story.key ? (
                                    <div className={styles.campaignThumb} style={{ background: '#000' }}>
                                        <video
                                            src={story.video}
                                            controls
                                            autoPlay
                                            playsInline
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.campaignThumb}>
                                        <Image src={STORY_IMG[story.key]} alt={story.title} fill className={styles.campaignImg} />
                                        <button
                                            className={styles.campaignPlayBtn}
                                            onClick={() => handleCampaignVideoClick(story.key, story.video)}
                                            aria-label={`Watch ${story.title}`}
                                        >
                                            <Play size={20} fill="white" color="white" />
                                        </button>
                                        <span className={styles.campaignBadge}>✓ Funded</span>
                                    </div>
                                )}
                                <div className={styles.campaignBody}>
                                    <h4>{story.title}</h4>
                                    <p>{story.desc}</p>
                                    <Link href={campaignsHref} className={styles.campaignBtn}>Support this mission</Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className={styles.sectionCta}
                    >
                        <Link href={campaignsHref} className={styles.seeAllBtn}>
                            {content.campaignsSeeAllLabel} <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ===== OUR PURPOSE ===== */}
            <section className={styles.purpose}>
                <div className="container">
                    <motion.div
                        className={styles.purposeInner}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className={styles.purposeEyebrow}>{content.purposeEyebrow}</span>
                        <h2 className={styles.purposeTitle}>
                            {content.purposeTitle}
                        </h2>
                        <p className={styles.purposeLead}>
                            {content.purposeLead}
                        </p>
                        <div className={styles.purposeStats}>
                            <div className={styles.purposeStat}>
                                <Users size={26} />
                                <span>{content.purposeStat1}</span>
                            </div>
                            <div className={styles.purposeStat}>
                                <Heart size={26} />
                                <span>{content.purposeStat2}</span>
                            </div>
                            <div className={styles.purposeStat}>
                                <HeartHandshake size={26} />
                                <span>{content.purposeStat3}</span>
                            </div>
                        </div>
                        <div className={styles.purposeTagline}>
                            {content.purposeTagline}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== OFFICIAL STORE ===== */}
            <section className={styles.store}>
                <div className="container">
                    <motion.div
                        className={styles.sectionHeader}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeInUp}
                    >
                        <span className={styles.eyebrow}>{content.storeEyebrow}</span>
                        <h2 className={styles.sectionTitle}>{content.storeTitle}</h2>
                        <p className={styles.sectionSub}>{content.storeSubtitle}</p>
                    </motion.div>

                    <motion.div
                        className={styles.storeGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={staggerContainer}
                    >
                        {PRODUCTS.map((product) => (
                            <motion.a
                                key={product.name}
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.storeCard}
                                variants={fadeInUp}
                                whileHover={{ y: -8 }}
                            >
                                <div className={styles.storeImgWrap}>
                                    <Image src={product.img} alt={product.name} fill className={styles.storeImg} />
                                </div>
                                <div className={styles.storeInfo}>
                                    <b>{product.name}</b>
                                    <span className={styles.storePrice}>${product.price}</span>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className={styles.sectionCta}
                    >
                        <a href="https://shop.faithfightersforamerica.com/" target="_blank" rel="noopener noreferrer" className={styles.visitStoreBtn}>
                            {content.storeCtaLabel} <ChevronRight size={16} />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ===== NEWSLETTER ===== */}
            <Newsletter />

            {/* ===== VIDEO LIGHTBOX ===== */}
            {lightboxSrc && (
                <div onClick={() => setLightboxSrc(null)} className={styles.lightboxOverlay}>
                    <div onClick={(e) => e.stopPropagation()} className={styles.lightboxInner}>
                        <button onClick={() => setLightboxSrc(null)} aria-label="Close video" className={styles.lightboxClose}>
                            ✕
                        </button>
                        <video src={lightboxSrc} controls autoPlay playsInline className={styles.lightboxVideo} />
                    </div>
                </div>
            )}
        </main>
    );
}
