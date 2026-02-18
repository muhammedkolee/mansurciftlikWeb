export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Gizli tutmak istediğin bir klasör varsa
    },
    sitemap: 'https://mansurciftlik.com/sitemap.xml',
  }
}