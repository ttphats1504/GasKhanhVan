/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: [
    'rc-util',
    '@ant-design',
    'kitchen-flow-editor',
    '@ant-design/pro-editor',
    'zustand',
    'leva',
    'antd',
    'rc-pagination',
    'rc-picker',
  ],
}

export default nextConfig
