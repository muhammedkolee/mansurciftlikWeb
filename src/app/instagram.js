'use client';

import { useState, useEffect } from 'react';

export default function InstagramFeed() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstagramData();
  }, []);

  const fetchInstagramData = async () => {
    try {
      setLoading(true);
      
      // Kendi API route'unuzu çağırın
      const response = await fetch('/api/instagram');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setProfile(data.profile);
      setPosts(data.posts);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Instagram API Hatası:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bağlantı Hatası</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Lütfen ACCESS_TOKEN ve USER_ID değerlerini kontrol edin.</p>
          <button 
            onClick={fetchInstagramData}
            className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Instagram Logo */}
        <div className="flex justify-center">
          <a
            href={`https://instagram.com/${profile?.username}`}
            >
            <svg className="h-12" viewBox="0 0 448 512">
              <defs>
                <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#f09433'}} />
                  <stop offset="25%" style={{stopColor: '#e6683c'}} />
                  <stop offset="50%" style={{stopColor: '#dc2743'}} />
                  <stop offset="75%" style={{stopColor: '#cc2366'}} />
                  <stop offset="100%" style={{stopColor: '#bc1888'}} />
                </linearGradient>
              </defs>
              <path fill="url(#instagram-gradient)" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
          </a>
        </div>

        {/* Profil Bilgileri */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Profil Fotoğrafı */}
            <div className="flex-shrink-0">
              <a 
                href={`https://instagram.com/${profile?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-3 border-black hover:border-pink-500 transition-all cursor-pointer"
              >
                {profile?.profile_picture_url ? (
                  <img 
                    src={profile.profile_picture_url} 
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </a>
            </div>

            {/* Profil Detayları */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <a 
                  href={`https://instagram.com/${profile?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl md:text-3xl font-light hover:text-green-400 transition-colors"
                >
                  {profile?.username || 'username'}
                </a>
              </div>

              {/* İstatistikler */}
              <div className="flex justify-center md:justify-start gap-8 mb-4">
                <div className="text-center md:text-left">
                  <span className="font-semibold text-gray-800">
                    {profile?.media_count || 0}
                  </span>
                  <span className="text-gray-600 ml-1">gönderi</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-semibold text-gray-800">
                    {profile?.followers_count?.toLocaleString('tr-TR') || 0}
                  </span>
                  <span className="text-gray-600 ml-1">takipçi</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-semibold text-gray-800">
                    {profile?.follows_count || 0}
                  </span>
                  <span className="text-gray-600 ml-1">takip</span>
                </div>
              </div>

              {/* Biyografi */}
              {profile?.biography && (
                <div className="text-gray-700 whitespace-pre-line">
                  {profile.biography}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gönderiler Bölümü */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
            </svg>
            <span className="font-semibold text-gray-700">GÖNDERİLER</span>
          </div>

          {/* Gönderiler Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden bg-gray-100 group cursor-pointer"
                >
                  <img
                    src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
                    alt={post.caption?.substring(0, 50) || 'Instagram post'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-4 text-white">
                      {post.like_count !== undefined && (
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span className="font-semibold">{post.like_count}</span>
                        </div>
                      )}
                      {post.comments_count !== undefined && (
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                          </svg>
                          <span className="font-semibold">{post.comments_count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Henüz gönderi yok</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}