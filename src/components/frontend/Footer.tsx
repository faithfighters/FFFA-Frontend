'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaFacebookF, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import styles from './Footer.module.css';

const importantLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Give Away', href: '/giveaway' },
];

const quickLinks = [
    { label: 'About us', href: '/about' },
    { label: 'Media', href: '/media' },
    { label: 'Store', href: '/store' },
    { label: 'Stories', href: '/stories' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Volunteer', href: '/volunteer' },
    { label: 'Contact', href: '/contact' },
    { label: '#FFFA', href: '/' },
];

export default function Footer() {
    const pathname = usePathname();
    if (pathname === '/coming-soon') return null;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    {/* Column 1: Brand */}
                    <div className={styles.brand}>
                        <Image
                            src="/images/logo-white.png"
                            alt="FFFA Logo"
                            width={100}
                            height={120}
                            style={{ objectFit: 'contain' }}
                        />
                        <p className={styles.brandDescription}>
                            Faith Fighters For America unites communities with compassion, making every act of giving a shared and visible moment of kindness.
                        </p>
                    </div>

                    {/* Column 2: Important */}
                    <div className={styles.column}>
                        <span className={styles.columnTitle}>IMPORTANT</span>
                        <ul className={styles.linkList}>
                            {importantLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div className={styles.column}>
                        <span className={styles.columnTitle}>QUICK LINKS</span>
                        <ul className={styles.linkList}>
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Us */}
                    <div className={styles.column}>
                        <span className={styles.columnTitle}>CONTACT US</span>
                        <div className={styles.contactItem}>
                            <MdLocationOn size={20} color="#ec1d3c" />
                            <span>1751 Mound St, Suite 201 Sarasota FL, 34236</span>
                        </div>
                        <div className={styles.contactItem}>
                            <MdEmail size={20} color="#ec1d3c" />
                            <span>info@faithfightersforamerica.com</span>
                        </div>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialLink}><FaXTwitter size={14} /></a>
                            <a href="#" className={styles.socialLink}><FaFacebookF size={14} /></a>
                            <a href="#" className={styles.socialLink}><FaTiktok size={14} /></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                <p>© {new Date().getFullYear()} FFFA. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
}
