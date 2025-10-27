import type { Metadata } from 'next';
import { seoRegistry } from '@/lib/seo';

export const metadata: Metadata = {
  title: seoRegistry.lagna.title,
  description: seoRegistry.lagna.description,
  keywords: seoRegistry.lagna.keywords?.join(', '),
  openGraph: {
    title: seoRegistry.lagna.ogTitle,
    description: seoRegistry.lagna.ogDescription,
    images: [{ url: seoRegistry.lagna.image }],
    url: '/fortune/lagna',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: seoRegistry.lagna.ogTitle,
    description: seoRegistry.lagna.ogDescription,
    images: [seoRegistry.lagna.image]
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
