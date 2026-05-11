// src/app/management/layout.js

export const metadata = {
  title: {
    absolute: 'Hayvan Yönetim Paneli'
  },
  description: 'Hayvan Kayıt Yönetimi, Çiftlik Yönetim Sistemi, Mansur Çiftlik',
  icons: {
    icon: '../favicon.ico',
    apple: '../favicon.ico',
  },
};

export default function ManagementLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  );
}
