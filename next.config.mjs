/** @type {import('next').NextConfig} */
const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(
  /\/+$/,
  ""
);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/login",
        destination: `${apiUrl}/api/auth/login`,
      },
      {
        source: "/api/auth/register",
        destination: `${apiUrl}/api/auth/register`,
      },
      {
        source: "/api/auth/me",
        destination: `${apiUrl}/api/auth/me`,
      },
      {
        source: "/api/auth/refresh-token",
        destination: `${apiUrl}/api/auth/refresh-token`,
      },
      {
        source: "/api/auth/google",
        destination: `${apiUrl}/api/auth/google`,
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
      {
        source: "/api/items",
        destination: `${apiUrl}/api/items`,
      },
      {
        source: "/api/items/:path*",
        destination: `${apiUrl}/api/items/:path*`,
      },
      {
        source: "/api/reviews/:path*",
        destination: `${apiUrl}/api/reviews/:path*`,
      },
    ];
  },
};

export default nextConfig;
