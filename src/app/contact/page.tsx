import type { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
    title: 'Contact Us – Faith Fighters For America',
    description: 'Questions, ideas, or want to get involved? Reach out and join us in strengthening faith and unity across America.',
};

export default function ContactPage() {
    return <ContactContent />;
}
