import type { Metadata } from 'next';
import SeamsiClient from './seamsi-client';
import { seoRegistry } from '@/lib/seo';

export const metadata: Metadata = {
  title: seoRegistry.seamsi.title,
  description: seoRegistry.seamsi.description,
  keywords: seoRegistry.seamsi.keywords?.join(', '),
  openGraph: {
    title: seoRegistry.seamsi.ogTitle,
    description: seoRegistry.seamsi.ogDescription,
    images: [{ url: seoRegistry.seamsi.image }],
    url: '/seamsi',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: seoRegistry.seamsi.ogTitle,
    description: seoRegistry.seamsi.ogDescription,
    images: [seoRegistry.seamsi.image]
  }
};

export default function Page() {
  return <SeamsiClient />;
}


