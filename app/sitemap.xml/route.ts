export async function GET() {
  const base = 'https://example.com';
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc></url>
  <url><loc>${base}/fortune</loc></url>
  <url><loc>${base}/fortune/seamsi</loc></url>
  <url><loc>${base}/fortune/lagna</loc></url>
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}


