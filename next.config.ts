import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/oposiciones/auxiliar-administrativo",
        destination: "/oposiciones/personal-de-apoyo",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
