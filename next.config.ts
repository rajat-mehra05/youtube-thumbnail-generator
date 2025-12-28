import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for Server Actions to handle base64 images
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Default is 1mb, we need more for AI-generated images
    },
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
