import Newsletter from '@/components/frontend/Newsletter';
import MediaContent from './MediaContent';
import { Video } from '@/lib/types';

async function getVideos(): Promise<Video[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://stage.faithfightersforamerica.com');
        const res = await fetch(`${baseUrl}/api/videos`, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.videos || [];
    } catch {
        return [];
    }
}

export default async function MediaPage() {
    const approvedVideos = await getVideos();

    return (
        <>
            <MediaContent videos={approvedVideos} />

            <Newsletter />
        </>
    );
}
