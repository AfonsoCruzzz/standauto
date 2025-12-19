/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // O asterisco duplo permite carregar imagens de QUALQUER site https
      },
    ],
  },
};

export default nextConfig;
