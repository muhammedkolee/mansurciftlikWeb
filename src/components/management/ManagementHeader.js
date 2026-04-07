'use client';

import { User } from 'lucide-react';

export default function ManagementHeader() {
  return (
    <header
      style={{
        height: '64px',
        background: 'white',
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        flexShrink: 0,
      }}
    >
      <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-brown-dark)', margin: 0 }}>
        Yönetim Paneli
      </h1>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'var(--brand-brown-pale)',
          borderRadius: '100px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brand-brown) 0%, var(--brand-blue) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <User size={14} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-brown-dark)' }}>
          Yönetici
        </span>
      </div>
    </header>
  );
}
