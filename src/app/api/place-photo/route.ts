import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const photoRef = searchParams.get('ref');
    const query = searchParams.get('query');

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_PLACES_API_KEY is required to fetch direct Google Maps place photos.' },
        { status: 400 }
      );
    }

    if (photoRef) {
      const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${apiKey}`;
      const res = await fetch(googlePhotoUrl);
      const buffer = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || 'image/jpeg';

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        },
      });
    }

    if (query) {
      // Find place by query to get photo reference
      const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        query
      )}&inputtype=textquery&fields=photos,geometry,name&key=${apiKey}`;

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.candidates && searchData.candidates[0]?.photos?.[0]?.photo_reference) {
        const ref = searchData.candidates[0].photos[0].photo_reference;
        const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${apiKey}`;
        const res = await fetch(googlePhotoUrl);
        const buffer = await res.arrayBuffer();
        const contentType = res.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
    }

    return NextResponse.json({ success: false, error: 'No photo found for place' }, { status: 404 });
  } catch (error: any) {
    console.error('Place photo proxy error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
