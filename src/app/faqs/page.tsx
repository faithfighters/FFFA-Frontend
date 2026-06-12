'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import PageBanner from '@/components/frontend/PageBanner';
import Newsletter from '@/components/frontend/Newsletter';
import styles from './page.module.css';

const faqCategories = [
    {
        category: 'Donations',
        faqs: [
            {
                q: 'How are donations used?',
                a: 'Donations directly support faith-based initiatives, community outreach programs, and charitable causes voted on by our members. 80% of all subscription revenue goes directly to causes, and 20% supports platform operations.',
            },
            {
                q: 'Are my donations tax-deductible?',
                a: 'Yes. All donations made to Faith Fighters For America are fully tax-deductible as allowed by law. You will receive an official tax receipt via email immediately after your donation.',
            },
            {
                q: 'Can I set up recurring gifts?',
                a: 'Yes. You can set up monthly, quarterly, or annual recurring donation options when selecting your membership plan.',
            },
            {
                q: 'Can I make a memorial donation?',
                a: 'Yes. We accept donations made in honor or memory of loved ones. Please contact us at info@faithfightersforamerica.com for arrangements.',
            },
            {
                q: 'What payment methods are accepted?',
                a: 'We accept credit and debit cards, PayPal, and secure online transfers via Stripe.',
            },
        ],
    },
    {
        category: 'Membership',
        faqs: [
            {
                q: 'How do I sign up?',
                a: 'Complete the online membership form at our Join The Movement page. Choose your plan, create your account, and you\'re ready to start making an impact.',
            },
            {
                q: 'What are the membership benefits?',
                a: 'Benefits vary by tier. All members receive exclusive updates, event invitations, participation opportunities, voting rights, impact reports, and access to community features.',
            },
            {
                q: 'Is there a free membership?',
                a: 'Yes. A free membership option is available with optional voluntary donations. Paid plans unlock voting rights and additional benefits.',
            },
            {
                q: 'Who is eligible to join?',
                a: 'Individuals and faith-based organizations throughout the United States are welcome to join.',
            },
            {
                q: 'Can I change my membership plan?',
                a: 'Yes. You can upgrade or downgrade your plan at any time by logging into your account and visiting the subscription management section.',
            },
        ],
    },
    {
        category: 'Store',
        faqs: [
            {
                q: 'What products are available?',
                a: 'Our store will feature apparel, accessories, and faith-inspired items. Products are launching soon — subscribe to our newsletter for alerts.',
            },
            {
                q: 'What is the return policy?',
                a: 'We offer a 14-day return window for unused items in their original condition.',
            },
            {
                q: 'Do you ship internationally?',
                a: 'We currently ship within the United States only.',
            },
            {
                q: 'Are store purchases tax-deductible?',
                a: 'No. Store purchases are not tax-deductible. Only direct donations qualify for tax deductions.',
            },
        ],
    },
    {
        category: 'Tax & Receipts',
        faqs: [
            {
                q: 'Is FFFA a registered nonprofit?',
                a: 'Yes. Faith Fighters For America is registered as a nonprofit organization under U.S. law.',
            },
            {
                q: 'When will I receive my tax receipt?',
                a: 'Official tax receipts are emailed immediately after each donation.',
            },
            {
                q: 'Can I get an annual donation statement?',
                a: 'Yes. Annual statements are available upon request. Contact our finance department at info@faithfightersforamerica.com.',
            },
        ],
    },
    {
        category: 'Contact & Support',
        faqs: [
            {
                q: 'How can I contact you?',
                a: 'You can reach us via our online contact form or by emailing contact@faithfightersforamerica.org. We respond within 24–48 business hours.',
            },
            {
                q: 'How do I volunteer?',
                a: 'Visit our Volunteer page to explore opportunities and submit your application. A coordinator will reach out to connect you.',
            },
            {
                q: 'I\'m having a technical issue. Who do I contact?',
                a: 'Email our support team at info@faithfightersforamerica.com with a description of the issue, or use the contact form on our Contact page.',
            },
        ],
    },
];

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
    return (
        <>
            <PageBanner
                title="FAQs"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'FAQs', href: '/faqs' },
                ]}
            />

            <section className={`section ${styles.faqSection}`}>
                <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                        <span className="section-label section-label--red" style={{ display: 'inline-block' }}>Help Center</span>
                        <h2 className="heading-lg">Frequently Asked Questions</h2>
                        <p className="text-body">
                            Find answers to the most common questions about donations, membership, and our platform.
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
                        <p>Still have questions?</p>
                        <a href="/contact" className="btn btn--primary">
                            Contact Us <span className="btn-arrow">→</span>
                        </a>
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
