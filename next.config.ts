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
      {
        // La ficha única de GV se dividió en una por escala.
        source: "/convocatorias/ope-gobierno-vasco-2026",
        destination: "/convocatorias/ope-gobierno-vasco-administrativo-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
