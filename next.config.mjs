/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [new URL('https://yxxlgucwhstgexncksnp.supabase.co/**')],
  },
}

export default nextConfig
