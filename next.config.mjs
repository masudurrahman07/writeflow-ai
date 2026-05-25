/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${apiUrl}/api/auth/:path*`,
      },
      {
        source: "/api/ai/:path*",
        destination: `${apiUrl}/api/ai/:path*`,
      },
      {
        source: "/api/documents",
        destination: `${apiUrl}/api/documents`,
      },
      {
        source: "/api/documents/:path*",
        destination: `${apiUrl}/api/documents/:path*`,
      },
      {
        source: "/api/users/:path*",
        destination: `${apiUrl}/api/users/:path*`,
      },
      {
        source: "/api/dashboard/:path*",
        destination: `${apiUrl}/api/dashboard/:path*`,
      },
    ];
  },
};

export default nextConfig;
