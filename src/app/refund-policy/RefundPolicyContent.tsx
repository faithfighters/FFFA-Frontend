'use client';

import PageBanner from '@/components/frontend/PageBanner';
import legalStyles from '../privacy-policy/page.module.css';
import LegalBody from '@/components/shared/LegalBody';
import { useSiteContent } from '@/hooks/useSiteContent';
import { REFUND_DEFAULTS } from './refundDefaults';

export default function RefundPolicyContent() {
    const content = useSiteContent('refund-policy', REFUND_DEFAULTS);

    return (
        <>
            <PageBanner
                title={content.heroTitle}
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: content.heroTitle, href: '/refund-policy' },
                ]}
            />

            <section className={`section ${legalStyles.legalSection}`}>
                <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <p className={legalStyles.lastUpdated}>Last Updated: {content.lastUpdated}</p>

                    <div className={legalStyles.legalContent}>
                        <p>{content.introText}</p>

                        {content.sections.map(section => (
                            <div key={section.heading}>
                                <h2>{section.heading}</h2>
                                <LegalBody text={section.body} />
                            </div>
                        ))}

                        <h2>{content.contactHeading}</h2>
                        <p>
                            {content.contactText}{' '}
                            <a href={`mailto:${content.contactEmail}`}>
                                {content.contactEmail}
                            </a>{' '}
                            or visit our{' '}
                            <a href="/contact">Contact page</a>.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
