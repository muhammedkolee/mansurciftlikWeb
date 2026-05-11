"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#ffffff;font-family:'DM Sans',sans-serif;}
  @keyframes spin{to{transform:rotate(360deg);}}

  .data-table{width:100%;border-collapse:collapse;font-size:13px;}
  .data-table thead th{background:#374151;color:#fff;padding:10px 10px;text-align:left;font-weight:600;font-size:12px;letter-spacing:0.03em;white-space:nowrap;cursor:pointer;user-select:none;}
  .data-table thead th:hover{background:#4b5563;}
  .data-table tbody tr{border-bottom:1px solid #e5e7eb;}
  .data-table tbody td{padding:8px 10px;color:#1f2937;vertical-align:middle;}

  .search-input{width:100%;padding:11px 14px 11px 40px;border:1.5px solid #d1d5db;border-radius:10px;font-size:14px;font-family:inherit;background:#fff;outline:none;color:#111827;transition:border-color 0.2s;}
  .search-input:focus{border-color:#2c5f2e;}
  .search-input::placeholder{color:#9ca3af;}

  .action-btn{border:none;background:none;cursor:pointer;padding:7px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:background 0.15s;font-size:16px;min-width:34px;min-height:34px;}
  .action-btn:hover{filter:brightness(0.85);}
  .action-btn:active{transform:scale(0.92);}

  .page-header{background:#fff;border-radius:14px;padding:14px 16px;margin-bottom:14px;border:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
  .page-title{font-size:17px;font-weight:700;color:#111827;}
  .add-btn{display:flex;align-items:center;gap:6px;padding:10px 16px;background:#2c5f2e;color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap;}
  .add-btn:hover{background:#1e4220;}
  .legend-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0;}
`;


// ── Header ───────────────────────────────────────────────────────
export function ManagementHeader({ user, onSignOut, title }) {
  return (
    <div style={{ background: '#2c5f2e', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, textDecoration: 'none', lineHeight: 1 }}>←</Link>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{title}</div>
          {user && <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{user.email}</div>}
        </div>
      </div>
      <button onClick={onSignOut} style={{ padding: '7px 12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
        Çıkış
      </button>
    </div>
  );
}

// ── Action Buttons ────────────────────────────────────────────────
export function ActionBtns({ onView, onEdit, onTrash, extra }) {
  return (
    <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      {extra}
      {onView && (
        <button className="action-btn" style={{ background: '#eff6ff', color: '#2563eb' }} onClick={onView} title="Bilgi">
          ℹ️
        </button>
      )}
      {onEdit && (
        <button className="action-btn" style={{ background: '#fffbeb', color: '#d97706' }} onClick={onEdit} title="Düzenle">
          ✏️
        </button>
      )}
      {onTrash && (
        <button className="action-btn" style={{ background: '#fef2f2', color: '#dc2626' }} onClick={onTrash} title="Çöp Kutusuna Taşı">
          🗑️
        </button>
      )}
    </div>
  );
}

// ── DataTable ─────────────────────────────────────────────────────
export function DataTable({ columns, data, rowColor }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = data.filter(row => {
    if (!search.trim()) return true;
    return columns.some(col => {
      const val = col.searchValue ? col.searchValue(row) : row[col.key];
      return val && String(val).toLowerCase().includes(search.toLowerCase());
    });
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const col = columns.find(c => c.key === sortKey);
    const va = col?.sortValue ? col.sortValue(a) : a[sortKey];
    const vb = col?.sortValue ? col.sortValue(b) : b[sortKey];
    if (va == null) return 1; if (vb == null) return -1;
    const cmp = String(va).localeCompare(String(vb), 'tr', { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input type="text" placeholder="Küpe No veya İsim ara..." className="search-input" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} onClick={() => col.sortable !== false && handleSort(col.key)} style={{ cursor: col.sortable === false ? 'default' : 'pointer' }}>
                    {col.header}{col.sortable !== false && <span style={{ opacity: sortKey === col.key ? 1 : 0.3, marginLeft: 3, fontSize: 10 }}>{sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: 14 }}>Kayıt bulunamadı.</td></tr>
              ) : sorted.map((row, idx) => (
                <tr key={row.Id || idx} style={{ background: rowColor ? rowColor(row, idx) : (idx % 2 === 0 ? '#fff' : '#fafafa') }}>
                  {columns.map(col => (
                    <td key={col.key}>{col.render ? col.render(row, idx) : (row[col.key] ?? '-')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginTop: 6, fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>
        {filtered.length !== data.length ? `${filtered.length} / ${data.length}` : `${data.length}`} kayıt
      </div>
    </div>
  );
}

// ── Auth Hook ─────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabaseManagement.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      setLoading(false);
    });
  }, [router]);

  const signOut = useCallback(async () => {
    await supabaseManagement.auth.signOut();
    router.push('/login');
  }, [router]);

  return { user, loading, signOut };
}
