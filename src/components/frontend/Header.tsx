'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const navLinks = [
  { label: 'About us', href: '/about' },
  { label: 'Media', href: '/media' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Store', href: '/store' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact', href: '/contact' },
  { label: '#FFFA', href: '/join' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Hide navigation on auth pages and coming-soon
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/coming-soon';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isAuthPage ? styles.authPage : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Image
              src="/images/fffa-logo.png"
              alt="FFFA Logo"
              width={105}
              height={150}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>

        <div className={styles.navWrapper}>
          {/* Top White Navigation Bar */}
          <div className={styles.topNav}>
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                {navLinks.map((link, index) => (
                  <li key={link.href} className={styles.navItem}>
                    <Link
                      href={link.href}
                      className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
                    >
                      {link.label}
                    </Link>
                    {index < navLinks.length - 1 && <span className={styles.separator}>|</span>}
                  </li>
                ))}
              </ul>
            </nav>
            <Link href="/join" className={styles.topDonateBtn}>
              Donate
            </Link>
          </div>

          {/* Secondary Actions Bar */}
          <div className={styles.secondaryActions}>
            <Link href="/support" className={styles.supportLink}>
              Support Us
            </Link>
            <div className={styles.actionButtons}>
              <Link href="/coming-soon" className={styles.loginBtn}>
                Login
              </Link>
              <Link href="/coming-soon" className={styles.joinBtn}>
                Join Now
              </Link>
            </div>
          </div>
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
        <ul className={styles.mobileNavList}>
          {navLinks.map((link) => (
            <li key={link.href} className={styles.mobileNavItem}>
              <Link
                href={link.href}
                className={`${styles.mobileNavLink} ${pathname === link.href ? styles.mobileNavLinkActive : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className={styles.mobileNavItem}>
            <Link href="/coming-soon" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
          </li>
          <li className={styles.mobileNavItem}>
            <Link href="/coming-soon" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Join Now</Link>
          </li>
        </ul>
      </nav>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}
