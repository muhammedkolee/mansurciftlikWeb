import ManagementHeader from '@/components/management/ManagementHeader';
import ManagementSidebar from '@/components/management/ManagementSidebar';

export const metadata = {
  title: {
    default: 'Yönetim Paneli | Mansur Çiftlik',
    template: '%s | Yönetim Paneli',
  },
};

export default function ManagementLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FB' }}>
      <ManagementSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ManagementHeader />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
