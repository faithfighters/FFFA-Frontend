import Image from 'next/image';
import PageBanner from '@/components/PageBanner';
import Newsletter from '@/components/Newsletter';
import { Video } from '@/lib/types';
import styles from './page.module.css';

async function getVideos(): Promise<Video[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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

    const featured = approvedVideos[0];

    return (
        <>
            <PageBanner
                title="Media"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Media', href: '/media' },
                ]}
            />

            {/* Featured Video */}
            <section className={`section ${styles.featured}`}>
                <div className="container">
                    <span className="section-label">Featured</span>
                    <h2 className="heading-lg">Latest From Our Community</h2>
                    {featured ? (
                        <div className={styles.featuredGrid}>
                            <div className={styles.featuredVideo}>
                                <div className={styles.videoThumb}>
                                    <Image src={featured.thumbnailUrl || '/images/hero-flag.png'} alt={featured.title} fill className={styles.thumbImg} />
                                    <div className={styles.playBtn}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.featuredInfo}>
                                <span className={styles.tag}>{featured.causeTag}</span>
                                <h3 className={styles.featuredTitle}>{featured.title}</h3>
                                <p className={styles.featuredDesc}>{featured.description}</p>
                                <p className={styles.featuredMeta}>
                                    By {featured.authorName} · {new Date(featured.submittedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-gray-400)' }}>
                            No videos yet. Be the first to submit a story!
                        </div>
                    )}
                </div>
            </section>

            {/* Video Grid */}
            <section className={`section section--light ${styles.gallery}`}>
                <div className="container">
                    <span className="section-label">All Videos</span>
                    <h2 className="heading-lg">Stories of Impact</h2>
                    <div className={styles.videoGrid}>
                        {approvedVideos.map((video) => (
                            <div key={video.id} className={styles.videoCard}>
                                <div className={styles.videoThumbSmall}>
                                    <Image src={video.thumbnailUrl || '/images/hero-flag.png'} alt={video.title} fill className={styles.thumbImg} />
                                    <div className={styles.playBtnSmall}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    </div>
                                </div>
                                <div className={styles.videoInfo}>
                                    <span className={styles.tagSmall}>{video.causeTag}</span>
                                    <h4 className={styles.videoTitle}>{video.title}</h4>
                                    <p className={styles.videoMeta}>
                                        {video.authorName} · {new Date(video.submittedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
