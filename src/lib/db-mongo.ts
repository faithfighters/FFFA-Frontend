/**
 * MongoDB-based database layer
 * Mirrors the API of the file-based db.ts but uses MongoDB for persistence
 */

import { getDatabase } from './mongodb';
import { User, Cause, Video, VotingCycle, Vote, Subscription, Payout } from './types';

export interface StoredUser extends User {
  passwordHash: string;
}

// Collection names
const COLLECTIONS = {
  users: 'users',
  causes: 'causes',
  videos: 'videos',
  cycles: 'votingCycles',
  votes: 'votes',
  subscriptions: 'subscriptions',
  payouts: 'payouts',
};

// ===== USERS =====
export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const db = await getDatabase();
  return db.collection<StoredUser>(COLLECTIONS.users).findOne({
    email: { $regex: `^${email.toLowerCase()}$`, $options: 'i' },
  });
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const db = await getDatabase();
  return db.collection<StoredUser>(COLLECTIONS.users).findOne({ id });
}

export async function createUser(user: StoredUser): Promise<StoredUser> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.users).insertOne(user);
  return user;
}

export async function updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser | null> {
  const db = await getDatabase();
  const result = await db
    .collection<StoredUser>(COLLECTIONS.users)
    .findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' });
  return result.value || null;
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const db = await getDatabase();
  return db.collection<StoredUser>(COLLECTIONS.users).find({}).toArray();
}

// ===== CAUSES =====
export async function getCauseById(id: string): Promise<Cause | null> {
  const db = await getDatabase();
  return db.collection<Cause>(COLLECTIONS.causes).findOne({ id });
}

export async function getAllCauses(): Promise<Cause[]> {
  const db = await getDatabase();
  return db.collection<Cause>(COLLECTIONS.causes).find({}).toArray();
}

export async function createCause(cause: Cause): Promise<Cause> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.causes).insertOne(cause);
  return cause;
}

export async function updateCause(id: string, updates: Partial<Cause>): Promise<Cause | null> {
  const db = await getDatabase();
  const result = await db
    .collection<Cause>(COLLECTIONS.causes)
    .findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' });
  return result.value || null;
}

// ===== VOTING CYCLES =====
export async function getActiveCycle(): Promise<VotingCycle | null> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  return db.collection<VotingCycle>(COLLECTIONS.cycles).findOne({
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
}

export async function getAllCycles(): Promise<VotingCycle[]> {
  const db = await getDatabase();
  return db.collection<VotingCycle>(COLLECTIONS.cycles).find({}).toArray();
}

export async function createCycle(cycle: VotingCycle): Promise<VotingCycle> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.cycles).insertOne(cycle);
  return cycle;
}

// ===== VOTES =====
export async function getVotesByUser(userId: string, cycleId: string): Promise<Vote[]> {
  const db = await getDatabase();
  return db
    .collection<Vote>(COLLECTIONS.votes)
    .find({ userId, cycleId })
    .toArray();
}

export async function createVotes(votes: Vote[]): Promise<Vote[]> {
  if (votes.length === 0) return [];
  const db = await getDatabase();
  await db.collection(COLLECTIONS.votes).insertMany(votes);
  return votes;
}

export async function deleteVotesByUserCycle(userId: string, cycleId: string): Promise<void> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.votes).deleteMany({ userId, cycleId });
}

export async function getVotesByCause(causeId: string, cycleId: string): Promise<Vote[]> {
  const db = await getDatabase();
  return db
    .collection<Vote>(COLLECTIONS.votes)
    .find({ causeId, cycleId })
    .toArray();
}

// ===== VIDEOS =====
export async function getVideoById(id: string): Promise<Video | null> {
  const db = await getDatabase();
  return db.collection<Video>(COLLECTIONS.videos).findOne({ id });
}

export async function getAllVideos(): Promise<Video[]> {
  const db = await getDatabase();
  return db.collection<Video>(COLLECTIONS.videos).find({ status: 'approved' }).toArray();
}

export async function createVideo(video: Video): Promise<Video> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.videos).insertOne(video);
  return video;
}

export async function updateVideo(id: string, updates: Partial<Video>): Promise<Video | null> {
  const db = await getDatabase();
  const result = await db
    .collection<Video>(COLLECTIONS.videos)
    .findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' });
  return result.value || null;
}

export async function getVideosByStatus(status: string): Promise<Video[]> {
  const db = await getDatabase();
  return db.collection<Video>(COLLECTIONS.videos).find({ status }).toArray();
}

// ===== SUBSCRIPTIONS =====
export async function getSubscriptionByUser(userId: string): Promise<Subscription | null> {
  const db = await getDatabase();
  return db.collection<Subscription>(COLLECTIONS.subscriptions).findOne({ userId });
}

export async function createSubscription(subscription: Subscription): Promise<Subscription> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.subscriptions).insertOne(subscription);
  return subscription;
}

export async function updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | null> {
  const db = await getDatabase();
  const result = await db
    .collection<Subscription>(COLLECTIONS.subscriptions)
    .findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' });
  return result.value || null;
}

// ===== PAYOUTS =====
export async function getPayoutsByCycle(cycleId: string): Promise<Payout[]> {
  const db = await getDatabase();
  return db.collection<Payout>(COLLECTIONS.payouts).find({ cycleId }).toArray();
}

export async function createPayout(payout: Payout): Promise<Payout> {
  const db = await getDatabase();
  await db.collection(COLLECTIONS.payouts).insertOne(payout);
  return payout;
}

export async function updatePayout(id: string, updates: Partial<Payout>): Promise<Payout | null> {
  const db = await getDatabase();
  const result = await db
    .collection<Payout>(COLLECTIONS.payouts)
    .findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' });
  return result.value || null;
}
