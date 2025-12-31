/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'
const nextConfig = {
  // 开发模式下不使用静态导出，生产环境才导出
  ...(isDev ? {} : { output: 'export' }),
  // basePath只在生产环境构建时使用（GitHub Pages部署）
  basePath: isDev ? '' : '/eslatin-official-website',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
