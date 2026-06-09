/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Статический экспорт: Timeweb раздаёт папку out/ (Директория сборки = /out)
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig

