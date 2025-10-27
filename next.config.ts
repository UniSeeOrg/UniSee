import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  //Had errors when loading
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'logo.clearbit.com',
        },
      ],
    }
};

export default nextConfig;
