import { getDashboardStats, getDashboardLists } from '@/actions/dashboard';
import Link from 'next/link';
import { Beef, Baby, Users, Activity, ArrowRight, Clock } from 'lucide-react';

export const metadata = { title: 'Dashboard' };

export default async function ManagementDashboard() {
    const [stats, lists] = await Promise.all([
        getDashboardStats(),
        getDashboardLists(),
    ]);

    const statCards = [
        { label: 'İnek', value: stats.cowCount, icon: <Beef size={22} />, color: 'var(--brand-blue)', bg: 'var(--brand-blue-pale)' },
        { label: 'Buzağı', value: stats.calfCount, icon: <Baby size={22} />, color: '#16A34A', bg: '#F0FDF4' },
        { label: 'Düve', value: stats.heiferCount, icon: <Users size={22} />, color: '#D97706', bg: '#FFFBEB' },
        { label: 'Dana', value: stats.bullCount, icon: <Activity size={22} />, color: '#DC2626', bg: '#FEF2F2' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: 'var(--brand-brown-dark)', margin: 0 }}>
                    Dashboard
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--brand-gray)', marginTop: '4px' }}>
                    Çiftlik genel durumu
                </p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #F3F4F6',
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: card.bg,
                                color: card.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {card.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: 'var(--brand-gray)', marginBottom: '2px' }}>{card.label}</div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: 'var(--brand-brown-dark)', lineHeight: 1 }}>
                                {card.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {[
                    { href: '/management/animals', label: 'Tüm Hayvanlar', color: 'var(--brand-brown)' },
                    { href: '/management/animals?type=cow', label: 'İnekler', color: 'var(--brand-blue)' },
                    { href: '/management/animals?type=calf', label: 'Buzağılar', color: '#16A34A' },
                    { href: '/management/animals?type=heifer', label: 'Düveler', color: '#D97706' },
                    { href: '/management/animals?type=bull', label: 'Danalar', color: '#DC2626' },
                    { href: '/management/vaccines', label: 'Aşı Takibi', color: '#7C3AED' },
                ].map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            background: 'white',
                            border: `1.5px solid ${link.color}30`,
                            color: link.color,
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                        }}
                    >
                        {link.label}
                        <ArrowRight size={12} />
                    </Link>
                ))}
            </div>

            {/* Data Lists */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Closest Heifers */}
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #F9FAFB', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} style={{ color: '#7C3AED' }} />
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-brown-dark)', margin: 0 }}>Yaklaşan Düveler</h3>
                    </div>
                    <div style={{ padding: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                        {lists.closestHeifers.length > 0 ? (
                            lists.closestHeifers.map((h, i) => (
                                <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: '#F5F3FF', marginBottom: '6px', borderLeft: '3px solid #7C3AED' }}>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>{h.Name}</div>
                                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{h.EarringNo} — {h.Date} gün</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>Yaklaşan düve bulunmuyor</div>
                        )}
                    </div>
                </div>

                {/* Closest Cows */}
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #F9FAFB', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} style={{ color: 'var(--brand-blue)' }} />
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-brown-dark)', margin: 0 }}>Yaklaşan İnekler</h3>
                    </div>
                    <div style={{ padding: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                        {lists.closestCows.length > 0 ? (
                            lists.closestCows.map((c, i) => (
                                <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--brand-blue-pale)', marginBottom: '6px', borderLeft: '3px solid var(--brand-blue)' }}>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>{c.Name}</div>
                                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{c.EarringNo} — {c.Date} gün</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>Yaklaşan inek bulunmuyor</div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #F9FAFB', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={16} style={{ color: '#16A34A' }} />
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-brown-dark)', margin: 0 }}>Son Güncellemeler</h3>
                    </div>
                    <div style={{ padding: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                        {lists.info.length > 0 ? (
                            lists.info.map((item, i) => (
                                <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: '#F0FDF4', marginBottom: '6px', borderLeft: '3px solid #16A34A' }}>
                                    <div style={{ fontSize: '13px', color: '#374151' }}>{item.Info}</div>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                                        {new Date(item.CreatedAt).toLocaleDateString('tr-TR')} {new Date(item.CreatedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>Güncelleme yok</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
