'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Newsletter from '@/components/frontend/Newsletter';
import { useSiteContent } from '@/hooks/useSiteContent';
import { STORE_DEFAULTS } from './storeContent';

const DESKTOP_HERO_IMAGES = [
    '/images/desktop1.png',
    '/images/desktop2.png',
    '/images/desktop3.png',
];

const MOBILE_HERO_IMAGES = [
    '/images/hands_bg_team.svg',
    '/images/america_hands_join.png',
    '/images/team_img.svg',
];

const SHOP = 'https://shop.faithfightersforamerica.com/';

export default function StorePage() {
    const content = useSiteContent('store', STORE_DEFAULTS);
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroImageIndex((prev) => (prev + 1) % DESKTOP_HERO_IMAGES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* ===== HERO ===== */}
            <section className={styles.hero}>
                <div className={`${styles.heroBgContainer} ${styles.heroBgDesktopOnly}`}>
                    {DESKTOP_HERO_IMAGES.map((src, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className={`${styles.heroBgImage} ${index === currentHeroImageIndex ? styles.heroBgActive : ''}`}
                        />
                    ))}
                </div>
                <div className={`${styles.heroBgContainer} ${styles.heroBgMobileOnly}`}>
                    {MOBILE_HERO_IMAGES.map((src, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className={`${styles.heroBgImage} ${index === currentHeroImageIndex ? styles.heroBgActive : ''}`}
                        />
                    ))}
                </div>
                <div style={{ position: 'relative', zIndex: 3, width: '100%' }}>
                    <div className="container">
                        <div className={styles.heroInner}>
                            <span className={styles.eyebrow}>{content.heroEyebrow}</span>
                            <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
                            <p className={styles.heroLead}>
                                {content.heroLead}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PRODUCT GRID ===== */}
            <section className={`section ${styles.productsSection}`}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <span className={styles.eyebrow}>{content.productsEyebrow}</span>
                        <h2 className={styles.sectionTitle}>{content.productsTitle}</h2>
                        <p className={styles.sectionSub}>{content.productsSubtitle}</p>
                    </div>

                    <div className={styles.productGrid}>
                        {content.products.map((product) => (
                            <a
                                key={product.name}
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.productCard}
                            >
                                <div className={styles.productImage}>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className={styles.productInfo}>
                                    <b>{product.name}</b>
                                    <span className={styles.productPrice}>${product.price}</span>
                                </div>
                            </a>
                        ))}
                    </div>

                    <a href={SHOP} target="_blank" rel="noopener noreferrer" className={styles.fullStoreBtn}>
                        {content.fullStoreBtnLabel}
                    </a>
                </div>
            </section>

            {/* ===== BENEFIT ROWS ===== */}
            <section className={`section ${styles.benefitsSection}`}>
                <div className="container">
                    <div className={styles.benefitsGrid}>
                        {content.benefits.map((benefit, i) => (
                            <div className={styles.benefitRow} key={benefit.title}>
                                <div className={i === 1 ? `${styles.benefitIcon} ${styles.benefitIconRed}` : styles.benefitIcon}>
                                    {i === 0 ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                                    )}
                                </div>
                                <div>
                                    <h4>{benefit.title}</h4>
                                    <p>{benefit.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
