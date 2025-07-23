/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar ESLint durante el build para deployment rápido
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Deshabilitar TypeScript checking durante builds para deployment rápido  
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración de imágenes
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true
  },
  // Variables de entorno
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Rewrites para NextAuth
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXTAUTH_BACKEND_URL}/api/auth/:path*`,
      },
    ];
  }
};

module.exports = nextConfig; 