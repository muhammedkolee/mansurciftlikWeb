export default function sitemap() {
  const baseUrl = 'https://mansurciftlik.com';

  // Gelecekte bir veritabanından (örneğin ilanlar veya bloglar) 
  // veri çekmek istersen burayı genişletebilirsin.
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ];
}