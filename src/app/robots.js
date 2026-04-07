export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/management/', '/api/'],
    },
    sitemap: 'https://mansurciftlik.com/sitemap.xml',
  };
}
