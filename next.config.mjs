/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // the next/image optimizer needs a server
  trailingSlash: true,           // /projects/ -> /projects/index.html
};

export default nextConfig;
