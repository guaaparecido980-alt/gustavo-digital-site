import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Export estatico: o build vira HTML puro em out/, que o GitHub Pages serve
  // sem precisar de servidor Node. Mantem o dominio e o deploy atuais.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
