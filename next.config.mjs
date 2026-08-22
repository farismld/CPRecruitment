/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Ganti dengan project-ref Supabase Anda, contoh: abcdxyzproject.supabase.co
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    // Build tetap jalan walau ada warning lint minor (tidak untuk error TypeScript)
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
