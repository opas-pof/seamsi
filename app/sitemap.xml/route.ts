export async function GET() {
  const base = 'https://horoscope.kapook.com/fortune';
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc></url>
  <url><loc>${base}/seamsi</loc></url>
  <url><loc>${base}/lagna</loc></url>
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}


