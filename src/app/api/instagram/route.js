import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
    const USER_ID = process.env.IG_USER_ID;

    if (!ACCESS_TOKEN || !USER_ID) {
      return NextResponse.json(
        { error: 'Token veya User ID bulunamadı' },
        { status: 500 }
      );
    }

    // 1. Profil Bilgileri İçin URL Değişimi:
    const profileResponse = await fetch(
      `https://graph.facebook.com/v18.0/${USER_ID}?fields=id,username,name,profile_picture_url,biography,followers_count,follows_count&access_token=${ACCESS_TOKEN}`
    );
    const profileData = await profileResponse.json();

    if (profileData.error) {
      return NextResponse.json(
        { error: profileData.error.message },
        { status: 400 }
      );
    }

    // Son 9 gönderiyi al
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=9&access_token=${ACCESS_TOKEN}`
    );
    const mediaData = await mediaResponse.json();

    if (mediaData.error) {
      return NextResponse.json(
        { error: mediaData.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      profile: profileData,
      posts: mediaData.data || []
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}