export interface User {
    id: string;
    name: string;
    email: string;
    role: 'member' | 'admin';
    userType?: 'donor' | 'recipient';
    plan?: 'faith_builder' | 'faith_hero' | 'faith_fighter';
    votesRemaining?: number;
    votesTotal?: number;
    boosterVotesRemaining?: number;
    joinedAt: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    image?: string;
}

export interface Cause {
    id: string;
    name: string;
    description: string;
    category: string;
    totalVotes: number;
    goalAmount: number;
    raisedAmount: number;
    image?: string;
    status: 'active' | 'funded' | 'closed';
    createdAt: string;
    submittedBy?: string;
}

export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    authorId: string;
    authorName: string;
    causeTag: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    beneficiaryName?: string;
    urgencyReason?: string;
    targetAmount?: number;
    isFeatured?: boolean;
    billPayStatus?: 'pending' | 'paid';
    submitterPhone?: string;
    submitterEmail?: string;
    paymentDestination?: {
        type: 'hospital' | 'utility' | 'rent' | 'other';
        institutionName?: string;
        address?: string;
        phone?: string;
        accountNumber?: string;
    };
    voteCount?: number;
    requiredVotes?: number;
}

export interface VotingCycle {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'closed' | 'upcoming';
    causes: string[];
}

export interface Vote {
    id: string;
    userId: string;
    causeId: string;
    cycleId: string;
    count: number;
    createdAt: string;
}

export interface Subscription {
    id: string;
    userId: string;
    plan: 'faith_builder' | 'faith_hero' | 'faith_fighter';
    amount: number;
    status: 'active' | 'cancelled' | 'past_due';
    startDate: string;
    nextBillingDate: string;
    stripeSubscriptionId?: string;
}

export interface Payout {
    id: string;
    causeId: string;
    causeName: string;
    amount: number;
    paymentMethod: 'ach' | 'check' | 'paypal';
    status: 'pending' | 'processing' | 'paid';
    cycleId: string;
    createdAt: string;
    processedAt?: string;
}

const _FAITH_FIGHTER_PLAN = {
    name: 'Faith Fighter',
    price: 30,
    votes: 30,
    features: [
        'Full platform access (live streams, impact reports, stories)',
        '30 donation votes per cycle — use them anytime',
        'Exclusive community updates and newsletters',
        'Behind-the-scenes previews of upcoming projects',
        'Voting & Participation — vote on and propose community initiatives',
        'Priority access to virtual town halls',
        'Exclusive Freedom Roundtable sessions with leadership (quarterly)',
        'Official badge: "Faith Fighter"',
        'Annual digital certificate of contribution',
        'Personalized thank-you video from the team',
        '15% discount on all merch + free exclusive annual merch item',
    ],
} as const;

export const PLAN_CONFIG = {
    faith_fighter: _FAITH_FIGHTER_PLAN,
    // Legacy aliases — existing DB records may still reference these plan keys
    faith_builder: _FAITH_FIGHTER_PLAN,
    faith_hero: _FAITH_FIGHTER_PLAN,
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;
