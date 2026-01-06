/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'
// 通过环境变量控制部署目标：'github' 或 'server'（默认）
const deployTarget = process.env.DEPLOY_TARGET || 'server'
// 如果设置了NEXT_DIST_DIR环境变量（HTTPS服务），使用独立的构建目录
const distDir = process.env.NEXT_DIST_DIR || '.next'

const nextConfig = {
  // 开发模式下不使用静态导出，生产环境才导出
  ...(isDev ? {} : { output: 'export' }),
  // basePath配置：
  // - GitHub Pages: '/eslatin-official-website'
  // - 自己的服务器: ''（根路径）
  basePath: isDev ? '' : (deployTarget === 'server' ? '' : '/eslatin-official-website'),
  // 如果使用HTTPS服务，使用独立的构建目录
  ...(distDir !== '.next' ? { distDir } : {}),
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
