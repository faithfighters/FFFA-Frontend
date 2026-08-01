import type { Metadata } from 'next';
import VolunteerContent from './VolunteerContent';

export const metadata: Metadata = {
    title: 'Volunteer – Faith Fighters For America',
    description: 'One hour a week or a full weekend — bring your time and talents and make a real difference.',
};

export default function VolunteerPage() {
    return <VolunteerContent />;
}
