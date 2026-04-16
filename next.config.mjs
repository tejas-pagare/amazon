const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || process.env.BACKEND_ORIGIN || "http://localhost:3000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
