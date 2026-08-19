'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import PageBanner from '@/components/frontend/PageBanner';
import Newsletter from '@/components/frontend/Newsletter';
import { useSiteContent } from '@/hooks/useSiteContent';
import { FAQS_DEFAULTS, FaqItem } from './faqsContent';
import styles from './page.module.css';

function groupByCategory(faqs: FaqItem[]) {
    const map = new Map<string, FaqItem[]>();
    for (const faq of faqs) {
        if (!map.has(faq.category)) map.set(faq.category, []);
        map.get(faq.category)!.push(faq);
    }
    return Array.from(map.entries()).map(([category, items]) => ({ category, faqs: items }));
}

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`${styles.faqItem} ${open ? styles.faqOpen : ''}`}>
            <button className={styles.faqQuestion} onClick={() => setOpen(!open)}>
                <span>{q}</span>
                <span className={styles.faqIcon}>{open ? '−' : '+'}</span>
            </button>
            {open && <div className={styles.faqAnswer}><p>{a}</p></div>}
        </div>
    );
}

export default function FAQsPage() {
    const content = useSiteContent('faqs', FAQS_DEFAULTS);
    const faqCategories = groupByCategory(content.faqs);

    return (
        <>
            <PageBanner
                title={content.title}
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'FAQs', href: '/faqs' },
                ]}
            />

            <section className={`section ${styles.faqSection}`}>
                <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                        <span className="section-label section-label--red" style={{ display: 'inline-block', color: 'rgba(255,255,255,0.55)' }}>{content.eyebrow}</span>
                        <h2 className="heading-lg">{content.title}</h2>
                        <p className="text-body" style={{ color: 'rgba(255,255,255,0.65)' }}>
                            {content.subtitle}
                        </p>
                    </div>

                    {faqCategories.map((cat) => (
                        <div key={cat.category} className={styles.faqCategory}>
                            <h3 className={styles.categoryTitle}>{cat.category}</h3>
                            <div className={styles.faqList}>
                                {cat.faqs.map((faq) => (
                                    <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className={styles.contactCta}>
                        <p>{content.ctaText}</p>
                        <a href="/contact" className="btn btn--primary">
                            {content.ctaBtnLabel} <span className="btn-arrow">→</span>
                        </a>
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
