/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zzaxgeamstxeeqxqhtem.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
