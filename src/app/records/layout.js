// src/app/records/layout.js

export const metadata = {
  title: 'Mansur Çiftlik | Kayıt Paneli',
  description: 'Süt Kayıt Defteri, Süt Kayıt, Dijital Süt Kayıt, Dijital Kayıt',
  icons: {
    icon: '../../../public/icon.ico',
    apple: '../../../public/icon.ico',
  },
};

export default function RecordsLayout({ children }) {
  return (
    <section>
      {/* Buraya records subdomainine özel navbar falan da koyabilirsin */}
      {children}
    </section>
  );
}