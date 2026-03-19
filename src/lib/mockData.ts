// This file is kept for legacy reference only.
// All data is now served from /api/* routes backed by data/db.json.
// Do not import from this file in new code.

import { User, Cause, Video, VotingCycle, Subscription } from './types';

export const MOCK_USERS: User[] = [
    {
        id: 'user-1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'member',
        plan: 'faith_fighter',
        votesRemaining: 3,
        votesTotal: 3,
        joinedAt: '2025-06-15',
    },
    {
        id: 'admin-1',
        name: 'Kevin Jones',
        email: 'admin@faithfightersforamerica.com',
        role: 'admin',
        plan: undefined,
        votesRemaining: 0,
        votesTotal: 0,
        joinedAt: '2024-01-01',
    },
];

export const MOCK_CAUSES: Cause[] = [
    {
        id: 'cause-1',
        name: 'Veterans Housing Initiative',
        description: 'Providing stable housing for homeless veterans across America.',
        category: 'Veterans',
        totalVotes: 142,
        goalAmount: 25000,
        raisedAmount: 18400,
        image: '/images/hero-flag.png',
        status: 'active',
        createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'cause-2',
        name: 'Youth Mentorship Programs',
        description: 'After-school mentoring programs grounded in faith and community values.',
        category: 'Youth',
        totalVotes: 98,
        goalAmount: 15000,
        raisedAmount: 9200,
        image: '/images/praying-hands.png',
        status: 'active',
        createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'cause-3',
        name: 'Community Food Banks',
        description: 'Fighting hunger in underserved communities through local food banks.',
        category: 'Food Security',
        totalVotes: 87,
        goalAmount: 10000,
        raisedAmount: 7800,
        image: '/images/handshake-flag.png',
        status: 'active',
        createdAt: '2026-01-01T00:00:00.000Z',
    },
];

export const MOCK_VIDEOS: Video[] = [
    {
        id: 'vid-1',
        title: 'A Veteran Finds Home',
        description: 'Watch how FFFA helped a Marine veteran secure stable housing.',
        thumbnailUrl: '/images/hero-flag.png',
        videoUrl: '#',
        authorId: 'user-1',
        authorName: 'John Smith',
        causeTag: 'Veterans',
        status: 'approved',
        submittedAt: '2025-11-10T00:00:00.000Z',
    },
    {
        id: 'vid-4',
        title: 'Hurricane Relief in Action',
        description: 'FFFA volunteers responding within 24 hours of landfall.',
        thumbnailUrl: '/images/hero-flag.png',
        videoUrl: '#',
        authorId: 'user-1',
        authorName: 'Lisa Martinez',
        causeTag: 'Disaster Relief',
        status: 'pending',
        submittedAt: '2025-12-01T00:00:00.000Z',
    },
];

export const MOCK_VOTING_CYCLE: VotingCycle = {
    id: 'cycle-1',
    name: 'Q1 2026 Donation Cycle',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    status: 'active',
    causes: ['cause-1', 'cause-2', 'cause-3'],
};

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
    {
        id: 'sub-1',
        userId: 'user-1',
        plan: 'faith_fighter',
        amount: 79.95,
        status: 'active',
        startDate: '2025-06-15',
        nextBillingDate: '2026-04-15',
    },
];
