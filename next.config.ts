import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Pino-pretty'yi shim ile değiştir
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': require.resolve('./shims/pino-pretty.js'),
      '@react-native-async-storage/async-storage': require.resolve('./shims/react-native-async-storage.js'),
    };

    return config;
  },
};

export default nextConfig;
