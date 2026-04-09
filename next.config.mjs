/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@xmtp/node-sdk",
    "@xmtp/node-bindings",
    "ethers",
    "@quillai-network/mandates-core",
    "ulid",
  ],

  webpack(config, { isServer }) {
    // Force native/ESM-only server packages to be treated as externals
    const nativeExternals = [
      "@xmtp/node-sdk",
      "@xmtp/node-bindings",
    ];

    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        ({ request }, callback) => {
          if (nativeExternals.some((pkg) => request?.startsWith(pkg))) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];
    }

    return config;
  },
};

export default nextConfig;
