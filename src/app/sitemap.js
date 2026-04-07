export default function sitemap() {
  const baseUrl = 'https://mansurciftlik.com';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}
