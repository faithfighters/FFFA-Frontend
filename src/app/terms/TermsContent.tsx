'use client';

import legalStyles from '../privacy-policy/page.module.css';
import LegalBody from '@/components/shared/LegalBody';
import { useSiteContent } from '@/hooks/useSiteContent';
import { TERMS_DEFAULTS } from './termsDefaults';

export default function TermsContent() {
    const content = useSiteContent('terms', TERMS_DEFAULTS);

    return (
        <>
            <section className={legalStyles.hero}>
                <div className={legalStyles.heroDots} />
                <div className="container">
                    <div className={legalStyles.heroInner}>
                        <span className={legalStyles.eyebrow}>Legal</span>
                        <h1 className={legalStyles.heroTitle}>{content.heroTitle}</h1>
                    </div>
                </div>
            </section>

            <section className={`section ${legalStyles.legalSection}`}>
                <div className="container">
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
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
