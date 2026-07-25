'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import VideoPlayerModal from '@/components/shared/VideoPlayerModal';
import { Video } from '@/lib/types';
import styles from './page.module.css';

type MediaVideo = Video & {
    createdAt?: string;
    submittedAt?: string;
};

interface MediaContentProps {
    videos: MediaVideo[];
}

function getVideoDate(video: MediaVideo) {
    return video.submittedAt || video.createdAt || new Date().toISOString();
}

function formatVideoDate(video: MediaVideo) {
    const date = new Date(getVideoDate(video));
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
}

function VideoPreview({ video, large = false }: { video: MediaVideo; large?: boolean }) {
    if (video.thumbnailUrl) {
        return (
            <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className={styles.thumbImg}
                sizes={large ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 640px) 100vw, 33vw'}
            />
        );
    }

    if (video.videoUrl) {
        return (
            <video
                src={video.videoUrl}
                className={styles.thumbVideo}
                preload="metadata"
                muted
                playsInline
            />
        );
    }

    return <span className={styles.emptyThumb}>No preview</span>;
}

export default function MediaContent({ videos }: MediaContentProps) {
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const featured = videos.find(v => v.isFeatured) ?? videos[0];

    const playerVideos = useMemo(
        () => videos.map((video) => ({
            ...video,
            createdAt: getVideoDate(video),
        })),
        [videos],
    );

    const selectedIndex = selectedVideoId
        ? Math.max(0, playerVideos.findIndex((video) => video.id === selectedVideoId))
        : 0;

    const openVideo = (video: MediaVideo) => {
        if (!video.videoUrl) return;
        setSelectedVideoId(video.id);
    };

    return (
        <>
            <section className={`section ${styles.featured}`}>
                <div className="container">
                    <span className="section-label">Featured</span>
                    <h2 className="heading-lg">Latest From Our Community</h2>
                    {featured ? (
                        <div className={styles.featuredGrid}>
                            <button
                                type="button"
                                className={`${styles.videoThumb} ${styles.videoButton}`}
                                onClick={() => openVideo(featured)}
                                aria-label={`Play ${featured.title}`}
                            >
                                <VideoPreview video={featured} large />
                                <span className={styles.playBtn}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="white" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                </span>
                            </button>
                            <div className={styles.featuredInfo}>
                                <span className={styles.tag}>{featured.causeTag}</span>
                                <h3 className={styles.featuredTitle}>{featured.title}</h3>
                                <p className={styles.featuredDesc}>{featured.description}</p>
                                <p className={styles.featuredMeta}>
                                    By {featured.authorName}{formatVideoDate(featured) ? ` · ${formatVideoDate(featured)}` : ''}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            No videos yet. Be the first to submit a story!
                        </div>
                    )}
                </div>
            </section>

            <section className={`section section--light ${styles.gallery}`}>
                <div className="container">
                    <span className="section-label">All Videos</span>
                    <h2 className="heading-lg">Stories of Impact</h2>
                    <div className={styles.videoGrid}>
                        {videos.map((video) => (
                            <button
                                key={video.id}
                                type="button"
                                className={styles.videoCard}
                                onClick={() => openVideo(video)}
                                aria-label={`Play ${video.title}`}
                            >
                                <span className={styles.videoThumbSmall}>
                                    <VideoPreview video={video} />
                                    <span className={styles.playBtnSmall}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    </span>
                                </span>
                                <span className={styles.videoInfo}>
                                    <span className={styles.tagSmall}>{video.causeTag}</span>
                                    <span className={styles.videoTitle}>{video.title}</span>
                                    <span className={styles.videoMeta}>
                                        {video.authorName}{formatVideoDate(video) ? ` · ${formatVideoDate(video)}` : ''}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {selectedVideoId && (
                <VideoPlayerModal
                    videos={playerVideos}
                    initialIndex={selectedIndex}
                    onClose={() => setSelectedVideoId(null)}
                />
            )}
        </>
    );
}
