'use client';

import { useState, useEffect } from 'react';

export default function InstagramFeed() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Facebook gönderileri için iframe kodları
  const facebookPosts = [
    '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1559537305070906%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1143490220821957%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1163300838558319%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1971692356751706%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4136342449960460%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1764937190792419%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>'
  ];

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
      {/* GELİŞTİRME BİLGİLENDİRMESİ */}
      <div className="bg-blue-400 text-white py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-medium">
            🚧 Bu site şu anda geliştirme aşamasındadır. Çeşitli sorunlar, buglar vb. diğer şeyler oluşabilir.
          </p>
        </div>
      </div>
      {/* INSTAGRAM BÖLÜMÜ */}
      <div className="bg-white pb-12">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Instagram Logo */}
          <div className="flex justify-center items-center gap-3 mb-8">
            <a href={`https://instagram.com/${profile?.username}`}>
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
            <img src="/instagram.png" alt="Instagram" className="h-10" />
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

      {/* FACEBOOK BÖLÜMÜ */}
      <div className="bg-white border-t-8 border-gray-100 py-12">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Facebook Logo */}
          <div className="flex justify-center items-center gap-3 mb-8">
            <svg className="h-12" viewBox="0 0 320 512" fill="#1877F2">
              <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
            </svg>
            <img src="/facebook.png" alt="Facebook" className="h-10" />
          </div>

          {/* Profil Bilgileri */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            {/* Kapak Fotoğrafı Alanı */}
            <div className="h-48 md:h-64 rounded-t-lg relative overflow-hidden">
              <img 
                src="/mansurciftlik_kapak.jpg" 
                alt="Kapak Fotoğrafı" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-20 md:-mt-24">
                {/* Profil Fotoğrafı */}
                <div className="flex-shrink-0 z-10">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src="/mansurciftlik_profil.jpg" 
                      alt="Profil Fotoğrafı" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Sayfa Bilgileri */}
                <div className="flex-1 text-center md:text-left w-full mt-1 md:mt-18">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Mansur Simental-Fleckvieh Damızlık Düve İşletmesi
                  </h1>
                  <p className="text-gray-600 mb-3">
                    <span className="font-semibold">1.1 B</span> takipçi
                  </p>
                  <div className="text-gray-700 mb-3">
                    {/* Buraya sayfa açıklaması eklenebilir */}
                    👨‍🌾22.07.2018
                    🎖️Ari İşletme 📍Yapraklı/Çankırı
                    🇹🇷🇩🇪 🐂Simental ve Angus
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <a href='tel:+905060281318' className='font-bold'>+90 506 028 13 18</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gönderiler Bölümü */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
              </svg>
              <span className="font-semibold text-gray-700">GÖNDERİLER</span>
            </div>

            {/* Facebook Gönderileri Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {facebookPosts.map((iframeCode, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex items-center justify-center min-h-[400px]"
                >
                  {iframeCode ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: iframeCode }}
                      className="w-full h-full flex items-center justify-center"
                    />
                  ) : (
                    <div className="text-center p-8 text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                      <p className="text-sm">Gönderi {index + 1}</p>
                      <p className="text-xs mt-1">iframe kodu eklenecek</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* FOOTER BÖLÜMÜ */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Hakkımızda */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Hakkımızda</h3>
              <p className="text-sm leading-relaxed mb-4">
                Genetik, olmazsa olmazımızdır.
              </p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/mansurciftligi" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                  <a href="https://instagram.com/mansurciftlikk" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                      <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                <a href="https://tiktok.com/@mansur.ciftlik" target="_blank" rel="noopener noreferrer" class="hover:text-black transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Hızlı Linkler */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Ana Sayfa</a></li>
                <li><a href="#" className="hover:text-white transition">Hakkımızda (Yakında)</a></li>
                <li><a href="#" className="hover:text-white transition">Ürünlerimiz (Yakında)</a></li>
                <li><a href="#" className="hover:text-white transition">Galeri (Yakında)</a></li>
                <li><a href="#" className="hover:text-white transition">İletişim (Yakında)</a></li>
              </ul>
            </div>

            {/* İletişim Bilgileri */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">İletişim</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Müsellim Köyü Mansurlu Mah. Yapraklı/Çankırı</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href='tel:+905060281318'>+90 506 028 13 18</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href='mailto:mansurciftlikk@gmail.com'>mansurciftlikk@gmail.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span>Haftanın 7 günü: 06:00 - 20:00</span>
                </li>
              </ul>
            </div>

            {/* Yönetim Ekibi */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Yönetim Ekibi</h3>
              <div className="space-y-4">
                {/* CEO 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Mustafa Köle</h4>
                    <p className="text-xs text-gray-400">CEO & Kurucu</p>
                    <a className='text-sm' href='tel:+905060281318'>+90 506 028 13 18</a>
                  </div>
                </div>
                
                {/* CEO 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Mehmet Emre Köle</h4>
                    <p className="text-xs text-gray-400">CEO & Sosyal Medya Yöneticisi</p>
                    <a className='text-sm' href='tel:+905439445568'>+90 543 944 55 68</a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Alt Çizgi ve Copyright */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>&copy; 2018 Mansur Çiftlik. Tüm hakları saklıdır.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">Gizlilik Politikası (Yakında)</a>
                <a href="#" className="hover:text-white transition">Kullanım Şartları (Yakında)</a>
                <a href="#" className="hover:text-white transition">KVKK (Yakında)</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}