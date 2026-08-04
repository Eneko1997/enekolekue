import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/oposiciones/auxiliar-administrativo",
        destination: "/oposiciones/personal-de-apoyo",
        permanent: true,
      },
      {
        // /fechas-opes se sustituye por /convocatorias (redirección permanente 308).
        source: "/fechas-opes",
        destination: "/convocatorias",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
