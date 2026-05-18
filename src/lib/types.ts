export interface User {
    id: string;
    name: string;
    email: string;
    role: 'member' | 'admin';
    plan?: 'faith_builder' | 'faith_hero' | 'faith_fighter';
    votesRemaining?: number;
    votesTotal?: number;
    joinedAt: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
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

export const PLAN_CONFIG = {
    faith_builder: {
        name: 'Basic',
        price: 39.95,
        votes: 1,
        features: [
            'Full platform access',
            '1 donation vote per cycle',
            'Live-streamed acts of kindness',
            'Impact reports access',
            'Profile badge',
            '5% merchandise discount',
            'Community updates & exclusive newsletters',
        ],
    },
    faith_hero: {
        name: 'Standard',
        price: 59.95,
        votes: 2,
        features: [
            'All Basic benefits',
            '2 donation votes per cycle',
            'Priority town hall access',
            'Behind-the-scenes content previews',
            '10% merchandise discount',
            'Annual digital recognition certificate',
        ],
    },
    faith_fighter: {
        name: 'Premium',
        price: 79.95,
        votes: 3,
        features: [
            'All Standard benefits',
            '3 donation votes per cycle',
            'Propose local initiatives',
            'Quarterly Freedom Roundtable livestreams',
            '15% merchandise discount',
            'Exclusive annual merchandise item',
            'Personalized thank-you video from leadership',
        ],
    },
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;
