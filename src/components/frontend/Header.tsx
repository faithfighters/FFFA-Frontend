'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';
import { haptics } from '@/lib/haptics';
import {
  Home as HomeIcon, Shield, RectangleHorizontal, BarChart3, ShoppingBag, User, Heart, Mail, X,
} from 'lucide-react';
import { FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const navLinks: { label: string; href: string; external?: boolean; icon: React.ReactNode }[] = [
  { label: 'Home', href: '/', icon: <HomeIcon size={20} /> },
  { label: 'About us', href: '/about', icon: <Shield size={20} /> },
  { label: 'Stories', href: '/stories', icon: <RectangleHorizontal size={20} /> },
  { label: 'Campaigns', href: '/campaigns', icon: <BarChart3 size={20} /> },
  { label: 'Store', href: '/store', icon: <ShoppingBag size={20} /> },
  { label: 'Volunteer', href: '/volunteer', icon: <User size={20} /> },
  { label: 'Need Help', href: '/register?intent=help', icon: <Heart size={20} /> },
  { label: 'Contact', href: '/contact', icon: <Mail size={20} /> },
];

const socialLinks = [
  { label: 'YouTube', href: 'https://www.youtube.com/@FaithFightersforAmerica', icon: <FaYoutube size={16} /> },
  { label: 'X', href: '#', icon: <FaXTwitter size={16} /> },
  { label: 'Facebook', href: '#', icon: <FaFacebookF size={16} /> },
  { label: 'TikTok', href: '#', icon: <FaTiktok size={16} /> },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';
  const donateHref = '/donation';

  const handleDonateClick = () => {
    // Navigate directly to the donation page
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navigation on auth pages and coming-soon
  const isAuthPage = pathname === '/subscribe' || pathname === '/coming-soon' || pathname === '/forgot-password';
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isAuthPage ? styles.authPage : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Image
              src="/images/fffa-logo.png"
              alt="Faith Fighters For America"
              width={460}
              height={83}
              priority
            />
          </div>
        </Link>

        <div className={styles.navWrapper}>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.href} className={styles.navItem}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.navLink}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.ctaGroup}>
            {user ? (
              <Link href="/dashboard" className={styles.joinBtn}>
                Hi, {firstName}
              </Link>
            ) : (
              <Link href="/login" className={styles.joinBtn}>Login</Link>
            )}
            <Link href={donateHref} className={styles.topDonateBtn}>
              Donate
            </Link>
          </div>
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => { haptics.menu(); setIsMenuOpen(!isMenuOpen); }}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
        <div className={styles.mobileNavHeader}>
          <Image src="/images/FFFA_logo_Horizontal.svg" alt="Faith Fighters For America" width={140} height={34} className={styles.mobileNavLogo} />
          <button className={styles.mobileNavClose} onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <ul className={styles.mobileNavList}>
          {navLinks.map((link) => (
            <li key={link.href} className={styles.mobileNavItem}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.mobileNavIcon}>{link.icon}</span>
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={`${styles.mobileNavLink} ${pathname === link.href ? styles.mobileNavLinkActive : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.mobileNavIcon}>{link.icon}</span>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          {user && (
            <li className={styles.mobileNavItem}>
              <Link
                href="/dashboard"
                className={`${styles.mobileNavLink} ${pathname === '/dashboard' ? styles.mobileNavLinkActive : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={styles.mobileNavIcon}><User size={20} /></span>
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className={styles.mobileCtas}>
          <Link href="/donation" className={styles.mobileDonateBtn} onClick={() => setIsMenuOpen(false)}>
            Donate Now
          </Link>
          {!user && (
            <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsMenuOpen(false)}>
              Login / Join
            </Link>
          )}
        </div>

        <div className={styles.mobileSocials}>
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={styles.mobileSocialLink}
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </nav>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}
