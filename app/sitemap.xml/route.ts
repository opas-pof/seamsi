import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://example.com';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/fortune`, lastModified: new Date() },
    { url: `${base}/fortune/seamsi`, lastModified: new Date() },
    { url: `${base}/fortune/lagna`, lastModified: new Date() },
  ];
}


