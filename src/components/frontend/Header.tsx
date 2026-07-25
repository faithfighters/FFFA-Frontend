'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';
import { haptics } from '@/lib/haptics';

const navLinks = [
  { label: 'About us', href: '/about' },
  { label: 'Media', href: '/media' },
  { label: 'Store', href: 'https://shop.faithfightersforamerica.com/', external: true },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact', href: '/contact' },
  { label: '#FFFA', href: '/join' },
  { label: 'Need Help', href: '/register?intent=help' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
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
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/subscribe' || pathname === '/coming-soon' || pathname === '/forgot-password';
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return null;

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
                    {index < navLinks.length - 1 && <span className={styles.separator}>|</span>}
                  </li>
                ))}
              </ul>
            </nav>
            <Link
              href={donateHref}
              className={styles.topDonateBtn}
            >
              Donate
            </Link>
          </div>

          {/* Secondary Actions Bar */}
          <div className={styles.secondaryActions}>
            <Link href="/support" className={styles.supportLink}>
              Support Us
            </Link>
            <div className={styles.actionButtons}>
              {user ? (
                <>
                  <Link href="/dashboard" className={styles.loginBtn}>
                    Hi, {firstName}
                  </Link>
                  <button className={styles.joinBtn} onClick={() => logout()} style={{ border: 'none', cursor: 'pointer' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.loginBtn}>Login</Link>
                  <Link href="/register?intent=donate" className={styles.joinBtn}>Join Now</Link>
                </>
              )}
            </div>
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
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={`${styles.mobileNavLink} ${pathname === link.href ? styles.mobileNavLinkActive : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li className={styles.mobileNavItem}>
            <Link
              href={user ? '/dashboard' : '/login'}
              className={`${styles.mobileNavLink} ${pathname === '/dashboard' ? styles.mobileNavLinkActive : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          {user ? (
            <li className={styles.mobileNavItem}>
              <button className={styles.mobileNavLink} onClick={() => { haptics.warning(); logout(); setIsMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                Logout ({firstName})
              </button>
            </li>
          ) : (
            <>
              <li className={styles.mobileNavItem}>
                <Link href="/login" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
              </li>
              <li className={styles.mobileNavItem}>
                <Link href="/register?intent=donate" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Join Now</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}
