export const metadata = {
  title: 'Mansur Çiftlik | Simental Damızlık Düve & Angus Yetiştiriciliği',
  description:
    'Mansur Simental Damızlık Düve ve Angus Yetiştiriciliği. Doğal ortamda yetiştirilen hayvanlardan kaliteli süt, tereyağı ve peynir.',
  openGraph: {
    title: 'Mansur Çiftlik | Simental Damızlık Düve & Angus Yetiştiriciliği',
    description: 'Doğal ortamda yetiştirilen hayvanlardan kaliteli süt, tereyağı ve peynir ürünleri.',
    images: [{ url: '/mansurciftlik_profil.jpg', width: 1200, height: 630, alt: 'Mansur Çiftlik' }],
  },
};

import HomeClient from './HomeClient';

export default function HomePage() {
  return <HomeClient />;
}
