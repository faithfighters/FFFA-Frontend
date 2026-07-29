'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import styles from './Footer.module.css';

const exploreLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Stories & Media', href: '/stories' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Store', href: '/store' },
];

const getInvolvedLinks = [
    { label: 'Donate', href: '/donation' },
    { label: 'Volunteer', href: '/volunteer' },
    { label: 'Need Help', href: '/register?intent=help' },
    { label: 'Contact', href: '/contact' },
];

const legalLinks = [
    { label: 'Privacy', href: '/privacy-policy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
];

const socialLinks = [
    { label: 'YouTube', href: 'https://www.youtube.com/@FaithFightersforAmerica', icon: <FaYoutube size={14} /> },
    { label: 'X', href: '#', icon: <FaXTwitter size={14} /> },
    { label: 'Facebook', href: '#', icon: <FaFacebookF size={14} /> },
    { label: 'TikTok', href: '#', icon: <FaTiktok size={14} /> },
];

export default function Footer() {
    const pathname = usePathname();
    const hideOnRoutes = ['/coming-soon', '/login', '/register', '/subscribe'];
    if (hideOnRoutes.includes(pathname) || pathname.startsWith('/dashboard')) return null;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    {/* Column 1: Brand */}
                    <div className={styles.brand}>
                        <Image
                            src="/images/logo-white.png"
                            alt="Faith Fighters For America"
                            width={100}
                            height={120}
                            style={{ objectFit: 'contain' }}
                        />
                        <p className={styles.brandDescription}>
                            Uniting communities with compassion — making every act of giving a shared and
                            visible moment of kindness.
                        </p>
                    </div>

                    {/* Column 2: Explore */}
                    <div className={styles.column}>
                        <span className={styles.columnTitle}>Explore</span>
                        <ul className={styles.linkList}>
                            {exploreLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Get Involved */}
                    <div className={styles.column}>
                        <span className={styles.columnTitle}>Get Involved</span>
                        <ul className={styles.linkList}>
                            {getInvolvedLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Reach Us */}
                    <div className={styles.column}>
                        <span className={styles.columnTitle}>Reach Us</span>
                        <div className={styles.contactItem}>
                            <MdLocationOn size={20} color="#F8C38F" />
                            <span>1751 Mound St, Suite 201, Sarasota, FL 34236</span>
                        </div>
                        <div className={styles.contactItem}>
                            <MdEmail size={20} color="#F8C38F" />
                            <span>info@faithfightersforamerica.com</span>
                        </div>
                        <div className={styles.socials}>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target={social.href.startsWith('http') ? '_blank' : undefined}
                                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className={styles.socialLink}
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                <p>
                    © {new Date().getFullYear()} Faith Fighters For America
                    {legalLinks.map((link) => (
                        <Link key={link.label} href={link.href} className={styles.legalLink}>{link.label}</Link>
                    ))}
                </p>
            </div>
        </footer>
    );
}
