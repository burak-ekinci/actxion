import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, metaMask, safe } from "@wagmi/connectors";

// Wagmi yapılandırmasını oluştur
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],

  connectors: [injected(), metaMask(), safe()],

  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },

  // Porto'yu devre dışı bırak
  experimental: {
    disablePorto: true,
  },
});

export const chains = [mainnet, sepolia];
