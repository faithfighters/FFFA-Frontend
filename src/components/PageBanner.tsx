import Link from 'next/link';
import styles from './PageBanner.module.css';

interface PageBannerProps {
    title: string;
    backgroundImage?: string;
    breadcrumbs?: { label: string; href: string }[];
}

export default function PageBanner({ title, backgroundImage, breadcrumbs }: PageBannerProps) {
    return (
        <section
            className={styles.banner}
            style={{
                backgroundImage: backgroundImage
                    ? `linear-gradient(rgba(11, 14, 20, 0.6), rgba(11, 14, 20, 0.6)), url(${backgroundImage})`
                    : undefined,
            }}
        >
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                {breadcrumbs && (
                    <nav className={styles.breadcrumbs}>
                        {breadcrumbs.map((crumb, i) => (
                            <span key={crumb.href} className={styles.crumbWrap}>
                                {i > 0 && <span className={styles.separator}>/</span>}
                                {i === breadcrumbs.length - 1 ? (
                                    <span className={styles.crumbActive}>{crumb.label}</span>
                                ) : (
                                    <Link href={crumb.href} className={styles.crumb}>
                                        {crumb.label}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
            </div>
        </section>
    );
}
