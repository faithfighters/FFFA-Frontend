'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Newsletter from '@/components/frontend/Newsletter';

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

const products = [
    { name: "Men's Faith Tee", price: '30', img: '/images/serve-img.jpg', url: `${SHOP}products/wake-up-with-faith-mens-shirts` },
    { name: "Women's Faith Tank", price: '25', img: '/images/serve-img-2.jpg', url: `${SHOP}products/wake-up-with-faith-female-tanktops` },
    { name: 'Faith Fighters Hat', price: '25', img: '/images/serve-img-3.jpg', url: `${SHOP}products/wake-up-with-faith-hats` },
    { name: 'Wake Up With Faith Coffee', price: '25', img: '/images/serve-img-4.jpg', url: `${SHOP}products/wake-up-with-faith-cofee` },
];

export default function StorePage() {
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
                            <span className={styles.eyebrow}>Official Store</span>
                            <h1 className={styles.heroTitle}>Wear the Mission</h1>
                            <p className={styles.heroLead}>
                                Every purchase funds faith-driven initiatives that uplift communities and
                                strengthen America&apos;s spirit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PRODUCT GRID ===== */}
            <section className={`section ${styles.productsSection}`}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <span className={styles.eyebrow}>Shop the Collection</span>
                        <h2 className={styles.sectionTitle}>Wear your faith</h2>
                        <p className={styles.sectionSub}>Tap a product to shop it directly.</p>
                    </div>

                    <div className={styles.productGrid}>
                        {products.map((product) => (
                            <a
                                key={product.name}
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.productCard}
                            >
                                <div className={styles.productImage}>
                                    <Image
                                        src={product.img}
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
                        Visit the Full Store
                    </a>
                </div>
            </section>

            {/* ===== BENEFIT ROWS ===== */}
            <section className={`section ${styles.benefitsSection}`}>
                <div className="container">
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitRow}>
                            <div className={styles.benefitIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                            </div>
                            <div>
                                <h4>Ships to all 50 states</h4>
                                <p>Fast, tracked delivery nationwide.</p>
                            </div>
                        </div>
                        <div className={styles.benefitRow}>
                            <div className={`${styles.benefitIcon} ${styles.benefitIconRed}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                            </div>
                            <div>
                                <h4>Funds the mission</h4>
                                <p>Proceeds support faith-driven missions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
