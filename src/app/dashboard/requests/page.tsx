'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartHandshake, ChevronRight, X } from 'lucide-react';
import { haptics } from '@/lib/haptics';

interface AssistanceRequest {
    id: string;
    requestTitle: string;
    category: string;
    description: string;
    amountRequested: number;
    amountApproved?: number;
    amountPaid?: number;
    voteCount?: number;
    requiredVotes?: number;
    paymentDate?: string;
    paymentMethod?: string;
    paymentReferenceNumber?: string;
    status: string;
    createdAt: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    beneficiaryName?: string;
    urgencyReason?: string;
    submitterPhone?: string;
    submitterEmail?: string;
    paymentDestination?: {
        type?: string;
        institutionName?: string;
        address?: string;
        phone?: string;
        accountNumber?: string;
    };
    testimonial?: {
        type?: string;
        writtenText?: string;
        videoUrl?: string;
        photoUrl?: string;
        status?: string;
    };
}

const STATUS_LABELS: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    funding_in_progress: 'Funding in Progress',
    payment_scheduled: 'Payment Scheduled',
    payment_completed: 'Payment Completed',
    testimonial_received: 'Testimonial Received',
    case_closed: 'Case Closed',
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    submitted: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' },
    under_review: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    approved: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    funding_in_progress: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
    payment_scheduled: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    payment_completed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
    testimonial_received: { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
    case_closed: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' },
};

const TESTIMONIAL_ELIGIBLE = ['payment_completed'];

export default function MyRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<AssistanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<AssistanceRequest | null>(null);

    useEffect(() => {
        fetch('/api/assistance-requests/mine', { credentials: 'include' })
            .then(r => r.json())
            .then(d => setRequests(d.requests || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ padding: '24px', color: 'rgba(255,255,255,0.6)' }}>Loading…</div>;
    }

    return (
        <div style={{ padding: '20px 20px 40px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>My Assistance Requests</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 24px' }}>
                Track the status of help you've requested from the community.
            </p>

            {requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#15131f', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <HeartHandshake size={36} color="rgba(255,255,255,0.25)" style={{ marginBottom: '12px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: '0 0 16px' }}>No assistance requests yet.</p>
                    <button
                        onClick={() => router.push('/dashboard/submit')}
                        style={{
                            padding: '11px 22px', borderRadius: '50px', border: 'none',
                            background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)',
                            color: '#ffffff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        Request Help
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {requests.map(r => {
                        const sc = STATUS_COLORS[r.status] || STATUS_COLORS.submitted;
                        const canTestify = TESTIMONIAL_ELIGIBLE.includes(r.status);
                        const showVoteProgress = !!r.requiredVotes && r.requiredVotes > 0 &&
                            !['submitted', 'under_review'].includes(r.status);
                        const votePct = showVoteProgress
                            ? Math.min(100, Math.round(((r.voteCount || 0) / r.requiredVotes!) * 100))
                            : 0;
                        const isFullyVoted = showVoteProgress && (r.voteCount || 0) >= r.requiredVotes!;
                        return (
                            <div
                                key={r.id}
                                onClick={() => { haptics.tap(); setSelected(r); }}
                                style={{
                                    background: '#15131f', borderRadius: '16px', padding: '18px 20px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', gap: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{r.requestTitle}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize', marginTop: '2px' }}>{r.category}</div>
                                    </div>
                                    <span style={{
                                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                                        fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                                        background: sc.bg, color: sc.color,
                                    }}>
                                        {STATUS_LABELS[r.status] || r.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                                    Requested ${r.amountRequested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                                {showVoteProgress && (
                                    <div>
                                        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', width: `${votePct}%`, borderRadius: '3px',
                                                background: isFullyVoted ? '#4ade80' : 'linear-gradient(90deg, #F8C38F, #E7421B)',
                                                transition: 'width 0.3s ease',
                                            }} />
                                        </div>
                                        <div style={{ fontSize: '12px', color: isFullyVoted ? '#4ade80' : 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: '4px' }}>
                                            {isFullyVoted
                                                ? 'Fully voted — 100% funded'
                                                : `${r.voteCount || 0} of ${r.requiredVotes} votes (${votePct}%)`}
                                        </div>
                                    </div>
                                )}
                                {canTestify && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F8C38F', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>
                                        Share your testimonial <ChevronRight size={14} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {selected && (
                <RequestDetailModal
                    request={selected}
                    onClose={() => setSelected(null)}
                    onShareTestimonial={() => router.push(`/dashboard/requests/${selected.id}/testimonial`)}
                />
            )}
        </div>
    );
}

function RequestDetailModal({
    request, onClose, onShareTestimonial,
}: {
    request: AssistanceRequest;
    onClose: () => void;
    onShareTestimonial: () => void;
}) {
    const sc = STATUS_COLORS[request.status] || STATUS_COLORS.submitted;
    const canTestify = TESTIMONIAL_ELIGIBLE.includes(request.status);
    const hasTestimonial = request.testimonial?.status === 'submitted';
    const showVoteProgress = !!request.requiredVotes && request.requiredVotes > 0 &&
        !['submitted', 'under_review'].includes(request.status);
    const votePct = showVoteProgress
        ? Math.min(100, Math.round(((request.voteCount || 0) / request.requiredVotes!) * 100))
        : 0;
    const isFullyVoted = showVoteProgress && (request.voteCount || 0) >= request.requiredVotes!;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto',
                    background: '#15131f', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
                    display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                }}
            >
                {/* Left: video */}
                <div style={{
                    flex: '1 1 320px', minWidth: '280px', background: '#000',
                    borderRadius: '24px 0 0 24px', overflow: 'hidden', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', minHeight: '260px',
                }}>
                    {request.videoUrl ? (
                        <video
                            src={request.videoUrl}
                            poster={request.thumbnailUrl}
                            controls
                            style={{ width: '100%', height: '100%', maxHeight: '480px', objectFit: 'contain', background: '#000' }}
                        />
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                            <HeartHandshake size={32} style={{ marginBottom: '8px' }} />
                            <p style={{ fontSize: '13px', margin: 0 }}>No video attached to this request.</p>
                        </div>
                    )}
                </div>

                {/* Right: details */}
                <div style={{ flex: '1 1 320px', minWidth: '280px', padding: '28px 24px', position: 'relative' }}>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px',
                            borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <X size={16} />
                    </button>

                    <span style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: 700, marginBottom: '12px',
                        background: sc.bg, color: sc.color,
                    }}>
                        {STATUS_LABELS[request.status] || request.status}
                    </span>

                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px', paddingRight: '32px' }}>
                        {request.requestTitle}
                    </h2>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize', margin: '0 0 16px' }}>
                        {request.category} · Submitted {new Date(request.createdAt).toLocaleDateString()}
                    </p>

                    {request.description && (
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '20px' }}>
                            {request.description}
                        </p>
                    )}

                    {(request.beneficiaryName || request.urgencyReason || request.submitterPhone || request.submitterEmail) && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                                Request Details
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {request.beneficiaryName && <DetailRow label="Person / Family in Need" value={request.beneficiaryName} />}
                                {request.urgencyReason && <DetailRow label="Urgency Reason" value={request.urgencyReason} />}
                                {request.submitterPhone && <DetailRow label="Your Phone" value={request.submitterPhone} />}
                                {request.submitterEmail && <DetailRow label="Your Email" value={request.submitterEmail} />}
                            </div>
                        </div>
                    )}

                    {request.paymentDestination?.type && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                                Payment Destination
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <DetailRow label="Bill Type" value={request.paymentDestination.type} capitalize />
                                {request.paymentDestination.institutionName && <DetailRow label="Institution / Payee" value={request.paymentDestination.institutionName} />}
                                {request.paymentDestination.phone && <DetailRow label="Phone" value={request.paymentDestination.phone} />}
                                {request.paymentDestination.address && <DetailRow label="Address" value={request.paymentDestination.address} />}
                                {request.paymentDestination.accountNumber && <DetailRow label="Account / Reference #" value={request.paymentDestination.accountNumber} />}
                            </div>
                        </div>
                    )}

                    {showVoteProgress && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Voting Progress
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: isFullyVoted ? '#4ade80' : '#F8C38F' }}>
                                    {isFullyVoted ? 'Fully Voted' : `${votePct}%`}
                                </span>
                            </div>
                            <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${votePct}%`, borderRadius: '4px',
                                    background: isFullyVoted ? '#4ade80' : 'linear-gradient(90deg, #F8C38F, #E7421B)',
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
                                {request.voteCount || 0} of {request.requiredVotes} votes received
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        <DetailStat label="Requested" value={`$${request.amountRequested.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                        {request.amountApproved != null && (
                            <DetailStat label="Approved" value={`$${request.amountApproved.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                        )}
                        {!!request.amountPaid && (
                            <DetailStat label="Paid" value={`$${request.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color="#4ade80" />
                        )}
                        {request.paymentDate && (
                            <DetailStat label="Payment Date" value={new Date(request.paymentDate).toLocaleDateString()} />
                        )}
                        {request.paymentMethod && (
                            <DetailStat label="Payment Method" value={request.paymentMethod.toUpperCase()} />
                        )}
                        {request.paymentReferenceNumber && (
                            <DetailStat label="Reference #" value={request.paymentReferenceNumber} />
                        )}
                    </div>

                    {hasTestimonial && (
                        <div style={{
                            background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                            borderRadius: '14px', padding: '14px', marginBottom: '16px',
                        }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                Your Testimonial
                            </div>
                            {request.testimonial?.writtenText && (
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                                    &ldquo;{request.testimonial.writtenText}&rdquo;
                                </p>
                            )}
                            {request.testimonial?.videoUrl && (
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>🎥 Video testimonial submitted</p>
                            )}
                        </div>
                    )}

                    {canTestify && !hasTestimonial && (
                        <button
                            onClick={onShareTestimonial}
                            style={{
                                width: '100%', padding: '13px', borderRadius: '50px', border: 'none',
                                background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)',
                                color: '#ffffff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            Share Your Testimonial
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>{label}</span>
            <span style={{ color: '#ffffff', fontWeight: 600, textAlign: 'right', textTransform: capitalize ? 'capitalize' : 'none' }}>{value}</span>
        </div>
    );
}

function DetailStat({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                {label}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: color || '#ffffff' }}>{value}</div>
        </div>
    );
}
