// src/app/records/layout.js

export const metadata = {
  title: {
    absolute: 'Süt Kayıt Defteri'
  },
  description: 'Süt Kayıt Defteri, Süt Kayıt, Dijital Süt Kayıt, Dijital Kayıt',
  icons: {
    icon: '../favicon.ico',
    apple: '../favicon.ico',
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