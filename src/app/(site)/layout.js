import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import NavigationProgress from '@/components/NavigationProgress';
import { AppProvider } from '@/contexts/AppContext';

export default function SiteLayout({ children }) {
  return (
    <AppProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavigationProgress />
        <SiteHeader />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <SiteFooter />
      </div>
    </AppProvider>
  );
}
