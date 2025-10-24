/** @type {import('next').NextConfig} */
const nextConfig = {
  // เปลี่ยนเป็น SSR/CSR ปกติระหว่างพัฒนา เพื่อลดความซับซ้อน
  // ถ้าจะกลับไป SSG อีกครั้ง ค่อยใส่ output: 'export' กลับเข้ามา
  images: { unoptimized: true },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore legacy Vite pages under src/pages by restricting pages router extensions
  pageExtensions: ['page.tsx', 'page.ts'],
};

export default nextConfig;


