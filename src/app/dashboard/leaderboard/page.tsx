'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import styles from './page.module.css';

interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    plan?: 'faith_fighter' | 'faith_hero' | 'faith_builder' | string;
    votesTotal: number;
    votesCast: number;
    image?: string;
    subscription?: {
        plan: string;
        amount: number;
        status: string;
    } | null;
}

const getLeaderboardRole = (rank: number, votes: number): string => {
    if (rank === 1) return 'Champion';
    if (votes >= 1300) return 'Supporter';
    if (votes >= 900) return 'Hope Giver';
    if (votes >= 700) return 'Believer';
    return 'Change Maker';
};

const getInitials = (name: string): string => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getRoleColor = (role: string): string => {
    switch (role) {
        case 'Champion':
            return '#ff7b5a';
        case 'Supporter':
            return 'rgba(255, 255, 255, 0.5)';
        case 'Hope Giver':
            return '#c084fc';
        case 'Believer':
            return '#60a5fa';
        default:
            return '#4ade80';
    }
};

export default function DashboardLeaderboardPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<'donations' | 'votes'>('votes');

    useEffect(() => {
        fetch('/api/leaderboard/members', { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => setMembers(data.members || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const getMemberDonationAmount = (member: Member): number => {
        if (member.subscription?.status === 'active') return member.subscription.amount;
        if (member.plan === 'faith_fighter') return 100;
        if (member.plan === 'faith_hero') return 50;
        if (member.plan === 'faith_builder') return 25;
        return 0;
    };

    const sortedMembers = [...members]
        .map((member) => ({ ...member, donationAmount: getMemberDonationAmount(member) }))
        .sort((a, b) => {
            if (activeCategory === 'donations') {
                return b.donationAmount - a.donationAmount || b.votesCast - a.votesCast;
            }
            return b.votesCast - a.votesCast || b.donationAmount - a.donationAmount;
        });

    const topThree = sortedMembers.slice(0, 3);
    const listMembers = sortedMembers.slice(3);

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', background: '#0b0a12', minHeight: '100vh' }}>
                Loading leaderboard data...
            </div>
        );
    }

    return (
        <div className={styles.leaderboardContainer}>
            {/* Background sunset flag image & overlay */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/images/login_backgrounf_img.svg"
                alt=""
                className={styles.bgImage}
                aria-hidden
            />
            <div className={styles.bgOverlay} />

            {/* Hero sunset banner */}
            <div className={styles.leaderboardHero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Leaderboard</h1>
                    <div className={styles.tabContainer}>
                        <button
                            type="button"
                            onClick={() => setActiveCategory('votes')}
                            className={`${styles.tabButton} ${activeCategory === 'votes' ? styles.tabActive : styles.tabInactive}`}
                        >
                            Votes Leader
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveCategory('donations')}
                            className={`${styles.tabButton} ${activeCategory === 'donations' ? styles.tabActive : styles.tabInactive}`}
                        >
                            Donation Leaders
                        </button>
                    </div>
                </div>
            </div>

            {/* Podium (Top 3) */}
            {sortedMembers.length > 0 && (
                <div className={styles.podiumContainer}>
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <PodiumMemberCard
                            member={topThree[1]}
                            rank={2}
                            activeCategory={activeCategory}
                            scoreValue={activeCategory === 'donations' ? topThree[1].donationAmount : topThree[1].votesCast}
                        />
                    )}
                    {/* Rank 1 */}
                    {topThree[0] && (
                        <PodiumMemberCard
                            member={topThree[0]}
                            rank={1}
                            activeCategory={activeCategory}
                            scoreValue={activeCategory === 'donations' ? topThree[0].donationAmount : topThree[0].votesCast}
                        />
                    )}
                    {/* Rank 3 */}
                    {topThree[2] && (
                        <PodiumMemberCard
                            member={topThree[2]}
                            rank={3}
                            activeCategory={activeCategory}
                            scoreValue={activeCategory === 'donations' ? topThree[2].donationAmount : topThree[2].votesCast}
                        />
                    )}
                </div>
            )}

            {/* Standings List (4-10+) */}
            <div className={styles.standingsContainer}>
                {sortedMembers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(19, 17, 28, 0.55)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        No standings found.
                    </div>
                ) : (
                    <div className={styles.standingsCard}>
                        {listMembers.map((member, index) => {
                            const rank = index + 4;
                            const score = activeCategory === 'donations' ? member.donationAmount : member.votesCast;
                            const role = getLeaderboardRole(rank, activeCategory === 'donations' ? member.votesCast : score);
                            return (
                                <div key={member.id} className={styles.standingRow}>
                                    <div className={styles.rowLeft}>
                                        <span className={styles.standingRank}>{rank}</span>
                                        {member.image && member.image.trim() !== '' && member.image !== 'null' && member.image !== 'undefined' ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className={styles.standingAvatar}
                                            />
                                        ) : (
                                            <div className={`${styles.standingInitials} ${styles.standingAvatar}`}>
                                                {getInitials(member.name)}
                                            </div>
                                        )}
                                        <div className={styles.standingInfoBlock}>
                                            <span className={styles.standingName}>{member.name}</span>
                                            <span className={styles.standingRole} style={{ color: getRoleColor(role) }}>
                                                {role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.standingScore}>
                                        <Flame size={15} color="#e7421b" fill="#e7421b" />
                                        <span>
                                            {activeCategory === 'donations' ? `$${score.toLocaleString()}` : score.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function PodiumMemberCard({
    member,
    rank,
    activeCategory,
    scoreValue,
}: {
    member: Member;
    rank: 1 | 2 | 3;
    activeCategory: 'donations' | 'votes';
    scoreValue: number;
}) {
    const role = getLeaderboardRole(rank, activeCategory === 'donations' ? member.votesCast : scoreValue);
    
    return (
        <div className={`${styles.podiumCard} ${styles[`podiumCardRank${rank}`]}`}>
            <div className={styles.avatarWrapper}>
                {/* Rank Badge circle */}
                <div className={`${styles.rankBadge} ${styles[`rankBadge${rank}`]}`}>
                    {rank}
                </div>
                {member.image && member.image.trim() !== '' && member.image !== 'null' && member.image !== 'undefined' ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={member.image}
                        alt={member.name}
                        className={`${styles.podiumAvatar} ${styles[`podiumAvatarRank${rank}`]}`}
                    />
                ) : (
                    <div className={`${styles.podiumInitials} ${styles[`podiumAvatarRank${rank}`]} ${styles[`podiumInitialsRank${rank}`]}`}>
                        {getInitials(member.name)}
                    </div>
                )}
            </div>
            
            <div className={styles.podiumName}>{member.name}</div>
            
            <div className={styles.podiumRole} style={{ color: getRoleColor(role) }}>
                {role}
            </div>
            
            <div className={styles.podiumScore}>
                <span className={styles.scoreValue}>
                    <Flame size={16} color="#e7421b" fill="#e7421b" />
                    {activeCategory === 'donations' ? `$${scoreValue.toLocaleString()}` : scoreValue.toLocaleString()}
                </span>
                <span className={styles.scoreLabel}>
                    {activeCategory === 'donations' ? 'Donated' : 'Votes'}
                </span>
            </div>
        </div>
    );
}
