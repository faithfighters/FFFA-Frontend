'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, ArrowRight, CalendarDays, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  coverImage: string;
  galleryImages: string[];
  status: 'upcoming' | 'past';
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/events', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setAllEvents(d.events || []))
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();

  const getEventStatus = (event: Event): 'ongoing' | 'upcoming' | 'past' => {
    if (!event.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
      return event.status as 'ongoing' | 'upcoming' | 'past';
    }
    const [year, month, day] = event.date.split('-').map(Number);
    let start = new Date(year, month - 1, day, 0, 0, 0);
    let end = new Date(year, month - 1, day, 23, 59, 59);

    if (event.startTime) {
      const [sh, sm] = event.startTime.split(':').map(Number);
      start = new Date(year, month - 1, day, sh || 0, sm || 0);
    }
    if (event.endTime) {
      const [eh, em] = event.endTime.split(':').map(Number);
      end = new Date(year, month - 1, day, eh || 23, em || 59);
    }

    if (now >= start && now <= end) return 'ongoing';
    if (now < start) return 'upcoming';
    return 'past';
  };

  const filteredEvents = allEvents.filter(ev => {
    const status = getEventStatus(ev);
    if (activeTab === 'upcoming') {
      return status === 'upcoming' || status === 'ongoing';
    } else {
      return status === 'past';
    }
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const statusA = getEventStatus(a);
    const statusB = getEventStatus(b);
    if (activeTab === 'upcoming') {
      if (statusA === 'ongoing' && statusB !== 'ongoing') return -1;
      if (statusB === 'ongoing' && statusA !== 'ongoing') return 1;
    }
    return a.date.localeCompare(b.date);
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', marginBottom: 6, lineHeight: 1 }}>Events</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Stay connected with community events and gatherings.</p>
        </div>

        {/* Live count pill */}
        {!loading && activeTab === 'upcoming' && sortedEvents.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(231, 66, 27, 0.15)',
            border: '1px solid rgba(231, 66, 27, 0.35)',
            borderRadius: 40, padding: '8px 16px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E7421B', animation: 'evPulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center' }}>
              <span style={{
                background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
                fontSize: 16,
                marginRight: 5
              }}>{sortedEvents.length}</span>
              Upcoming Event{sortedEvents.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 12, width: 'fit-content' }}>
        {(['upcoming', 'past'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 22px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14,
              color: activeTab === tab ? '#ffffff' : 'rgba(255,255,255,0.5)',
              background: activeTab === tab ? 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)' : 'transparent',
              boxShadow: activeTab === tab ? '0 4px 12px rgba(231,66,27,0.3)' : 'none',
              transition: 'all 0.18s',
              textTransform: 'capitalize',
              fontFamily: 'inherit',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', height: 320, animation: 'evShimmer 1.4s ease-in-out infinite alternate' }} />
          ))}
        </div>
      ) : sortedEvents.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <EventGrid events={sortedEvents} onSelect={setSelectedEvent} getEventStatus={getEventStatus} />
      )}

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} status={getEventStatus(selectedEvent)} />
      )}

      <style>{`
        @keyframes evPulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:.5; transform:scale(1.3) } }
        @keyframes evShimmer { from { opacity:.6 } to { opacity:1 } }
      `}</style>
    </div>
  );
}

/* ── Grid layout: first card featured (spans 2 cols), rest standard ── */
function EventGrid({ events, onSelect, getEventStatus }: { events: Event[]; onSelect: (e: Event) => void; getEventStatus: (e: Event) => 'ongoing' | 'upcoming' | 'past' }) {
  const [featured, ...rest] = events;
  // Single event: full-width; 2 events: 2-col; 3+ events: 3-col with featured spanning 2
  const single = events.length === 1;
  const two    = events.length === 2;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: single ? '1fr' : two ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 20 }}>
      <div style={{ gridColumn: single || two ? '1' : 'span 2' }}>
        <EventCard event={featured} onClick={() => onSelect(featured)} status={getEventStatus(featured)} featured={!single && !two} />
      </div>
      {rest.slice(0, two ? 1 : undefined).map(ev => (
        <EventCard key={ev.id} event={ev} onClick={() => onSelect(ev)} status={getEventStatus(ev)} />
      ))}
    </div>
  );
}

/* ── Event card ── */
function EventCard({ event, onClick, featured = false, status }: { event: Event; onClick: () => void; featured?: boolean; status: 'ongoing' | 'upcoming' | 'past' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        height: featured ? 380 : 300,
        background: '#0f172a',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.18)' : '0 4px 16px rgba(0,0,0,0.08)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'transform 0.25s, box-shadow 0.25s',
      }}
    >
      {/* Cover image */}
      {event.coverImage ? (
        <img
          src={event.coverImage}
          alt={event.title}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1a0a0a 100%)',
        }} />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.92) 100%)',
      }} />

      {/* Status badge */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
        <span style={{
          padding: '5px 12px',
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.7px',
          background: status === 'ongoing'
            ? 'linear-gradient(135deg, #10b981, #047857)'
            : status === 'upcoming'
              ? 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)'
              : 'linear-gradient(135deg, #00B1EB 0%, #007bb6 100%)',
          color: 'white',
          backdropFilter: 'blur(8px)',
          border: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: status === 'ongoing' ? 5 : 0,
        }}>
          {status === 'ongoing' && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff', animation: 'evPulse 1.5s infinite' }} />
          )}
          {status}
        </span>
      </div>

      {/* Bottom content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: featured ? '28px 28px' : '20px 22px', zIndex: 2 }}>
        <h3 style={{
          fontSize: featured ? 22 : 16,
          fontWeight: 800,
          color: 'white',
          marginBottom: 10,
          lineHeight: 1.2,
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            <Calendar size={13} color="#E7421B" style={{ flexShrink: 0 }} />
            <span>{formatDateForDisplay(event.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            <MapPin size={13} color="#E7421B" style={{ flexShrink: 0 }} />
            <span style={{ textTransform: 'capitalize' }}>{event.location}</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 700, color: 'white',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}>
          View Details <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyState({ tab }: { tab: string }) {
  return (
    <div style={{
      textAlign: 'center', padding: '72px 40px',
      background: '#15131f', borderRadius: 24,
      border: '1.5px dashed rgba(255,255,255,0.1)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'rgba(231, 66, 27, 0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <CalendarDays size={32} color="#E7421B" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
        No {tab} events
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, maxWidth: 280, margin: '0 auto' }}>
        {tab === 'upcoming'
          ? 'Check back soon — new community events will appear here.'
          : 'No past events to show yet.'}
      </p>
    </div>
  );
}

/* ── Event detail modal ── */
function EventModal({ event, onClose, status }: { event: Event; onClose: () => void; status: 'ongoing' | 'upcoming' | 'past' }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'evFadeIn 0.18s ease-out',
      }}
    >
      <div style={{
        background: '#15131f', borderRadius: 24,
        width: '100%', maxWidth: 660,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        animation: 'evSlideUp 0.22s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
            width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          <X size={18} color="rgba(255,255,255,0.8)" />
        </button>

        {/* Cover */}
        <div style={{ height: 260, borderRadius: '24px 24px 0 0', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 20, left: 28 }}>
            <span style={{
              padding: '5px 14px', borderRadius: 20,
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px',
              background: status === 'ongoing'
                ? 'linear-gradient(135deg, #10b981, #047857)'
                : status === 'upcoming'
                  ? 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)'
                  : 'linear-gradient(135deg, #00B1EB 0%, #007bb6 100%)',
              color: 'white',
              backdropFilter: 'blur(8px)',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: status === 'ongoing' ? 5 : 0,
            }}>
              {status === 'ongoing' && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff', animation: 'evPulse 1.5s infinite' }} />
              )}
              {status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px 36px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', marginBottom: 22, lineHeight: 1.2 }}>
            {event.title}
          </h2>

          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { icon: <Calendar size={16} color="white" />, label: 'Date', value: formatDateForDisplay(event.date) },
              { icon: <MapPin size={16} color="white" />, label: 'Location', value: event.location },
              ...(event.startTime ? [{ icon: <Clock size={16} color="white" />, label: 'Time', value: `${formatTimeForDisplay(event.startTime)} – ${formatTimeForDisplay(event.endTime)}` }] : []),
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(231, 66, 27, 0.25)',
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', textTransform: label === 'Location' ? 'capitalize' : 'none' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

          {/* Description */}
          <div style={{ marginBottom: event.galleryImages?.length ? 28 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>About This Event</div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, margin: 0 }}>
              {event.description || 'No description provided.'}
            </p>
          </div>

          {/* Gallery */}
          {event.galleryImages?.length > 0 && (
            <div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '24px 0 20px' }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                Gallery · {event.galleryImages.length} Photos
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                {event.galleryImages.map((img, i) => (
                  <div key={i} style={{ height: 96, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                    <img src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes evFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes evSlideUp { from { transform:translateY(24px);opacity:0 } to { transform:translateY(0);opacity:1 } }
      `}</style>
    </div>
  );
}

/* ── Helpers ── */
function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (!isNaN(date.getTime()))
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  return dateStr;
}

function formatTimeForDisplay(timeStr: string): string {
  if (!timeStr) return '';
  const match = timeStr.match(/^(\d{2}):(\d{2})$/);
  if (match) {
    let h = parseInt(match[1], 10);
    const min = match[2];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${min} ${ampm}`;
  }
  return timeStr;
}
