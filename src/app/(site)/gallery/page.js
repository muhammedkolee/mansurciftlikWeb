// Server component - provides metadata, wraps client gallery
import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Galeri | Mansur Çiftlik',
  description:
    'Mansur Çiftlik fotoğraf galerisi. Simental ve Angus ırklarımızdan, doğal yaşam alanımızdan ve çiftliğimizden kareler.',
  openGraph: {
    title: 'Galeri | Mansur Çiftlik',
    description: 'Çiftliğimizden kareler — hayvanlarımız, doğamız ve yaşamımız',
    images: [{ url: '/mansurciftlik_kapak.jpg', width: 1200, height: 630, alt: 'Mansur Çiftlik Galeri' }],
  },
};

export default function GaleriPage() {
  return <GalleryClient />;
}
