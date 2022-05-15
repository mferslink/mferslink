/** @type {import('next').NextConfig} */
// const withLess = require('@zeit/next-less');
// const withCss = require('@zeit/next-css')
const dev = process.env.NODE_ENV !== 'production';

if (typeof require !== 'undefined') {
  require.extensions['.css'] = () => {};
  require.extensions['.less'] = () => {};
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  cssModules: true,
  reactStrictMode: false,
  lessLoaderOptions: {
    javascriptEnabled: true
  },

  // webpack: webpack,
  // webpack5: false,
  compress: true,
  distDir: 'dist',
  // experimental: {
  //   esmExternals: "loose"
  // },
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'cdn.sanity.io',
      'img0.baidu.com',
      'p6-juejin.byteimg.com',
      'gimg2.baidu.com',
      'www.google.com.hk',
      'pbs.twimg.com'
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/activity',
        permanent: true
      }
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig)
