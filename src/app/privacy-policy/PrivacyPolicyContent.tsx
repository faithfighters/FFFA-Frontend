'use client';

import styles from './page.module.css';
import LegalBody from '@/components/shared/LegalBody';
import { useSiteContent } from '@/hooks/useSiteContent';
import { PRIVACY_DEFAULTS } from './privacyDefaults';

export default function PrivacyPolicyContent() {
    const content = useSiteContent('privacy-policy', PRIVACY_DEFAULTS);

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroDots} />
                <div className="container">
                    <div className={styles.heroInner}>
                        <span className={styles.eyebrow}>Legal</span>
                        <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
                    </div>
                </div>
            </section>

            <section className={`section ${styles.legalSection}`}>
                <div className="container">
                    <p className={styles.lastUpdated}>Last Updated: {content.lastUpdated}</p>

                    <div className={styles.legalContent}>
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
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
