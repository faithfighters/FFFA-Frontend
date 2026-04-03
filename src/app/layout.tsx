import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Header from '@/components/frontend/Header';
import Footer from '@/components/frontend/Footer';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Faith Fighters For America – One Nation – One Spirit – One Mission',
  description:
    'Faith Fighters For America unites communities with compassion, making every act of giving a shared and visible moment of kindness. Join our movement today.',
  keywords: ['faith', 'fighters', 'america', 'charity', 'community', 'donate', 'volunteer'],
  openGraph: {
    title: 'Faith Fighters For America',
    description:
      'Uniting communities with compassion. One Nation. One Spirit. One Mission.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
