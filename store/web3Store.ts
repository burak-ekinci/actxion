import { WalletState } from "@/types/wallet";
import { createPublicClient, createWalletClient } from "viem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { wagmiConfig, chains } from "@/lib/wagmi-config";
import CHAIN_IDS from "@/lib/constants";

interface Web3Store {
  wallet: WalletState;
  publicClient: ReturnType<typeof createPublicClient> | null;
  walletClient: ReturnType<typeof createWalletClient> | null;
  actions: {
    test: () => string;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    switchChain: (chainId: number) => Promise<void>;
    updateWalletState: (walletUpdate: Partial<WalletState>) => void;
  };
}

export const useWeb3Store = create<Web3Store>()(
  persist(
    immer((set, get) => ({
      wallet: {
        address: null,
        isConnected: false,
        isSignedIn: false,
        isLoading: false,
        isError: false,
        error: null,
        chain: null,
      },
      publicClient: null,
      walletClient: null,
      actions: {
        test: () => "test",
        connect: async () => {
          try {
            // Eğer zaten bağlıysa, tekrar bağlanmaya çalışma
            const { wallet } = get();
            if (wallet.isConnected) {
              console.log("Zaten bağlı");
              return;
            }

            set((state) => {
              state.wallet.isLoading = true;
              state.wallet.isSignedIn = false;
              state.wallet.isError = false;
              state.wallet.error = null;
            });

            // Wagmi v2 ile doğrudan bağlantı - sadece metaMask connector'ını kullan
            const connector = wagmiConfig.connectors[0];
            const result = await connector.connect();

            const chainId = await connector.getChainId();
            const chain = CHAIN_IDS.find((chain) => chain.chainId === chainId);

            set((state) => {
              state.wallet.address = result.accounts[0];
              state.wallet.isConnected = true;
              state.wallet.isSignedIn = false;
              state.wallet.isLoading = false;
              state.wallet.isError = false;
              state.wallet.error = null;
              state.wallet.chain = chain!.name;
            });
          } catch (error) {
            console.error("Bağlantı hatası:", error);
            set((state) => {
              state.wallet.error = error as Error;
              state.wallet.isLoading = false;
              state.wallet.isSignedIn = false;
              state.wallet.isError = true;
              state.wallet.isConnected = false;
            });
            throw error;
          }
        },

        disconnect: async () => {
          try {
            set((state) => {
              state.wallet.isLoading = true;
              state.wallet.isError = false;
              state.wallet.error = null;
            });

            // Bağlantıyı kesme işlemi
            const connector = wagmiConfig.connectors[0];
            await connector.disconnect();

            set((state) => {
              state.wallet.address = null;
              state.wallet.isConnected = false;
              state.wallet.isLoading = false;
              state.wallet.isError = false;
              state.wallet.error = null;
              state.wallet.chain = null;
            });
          } catch (error) {
            console.error("Bağlantı kesme hatası:", error);
            set((state) => {
              state.wallet.error = error as Error;
              state.wallet.isLoading = false;
              state.wallet.isError = true;
            });
            throw error;
          }
        },

        switchChain: async (chainId: number) => {
          try {
            const connector = wagmiConfig.connectors[0];
            const chainId = await connector.getChainId();
            const chain = CHAIN_IDS.find((chain) => chain.chainId === chainId);

            set((state) => {
              state.wallet.chain = chain!.name;
            });
          } catch (error) {
            console.error("C swithch error:", error);
          }
        },

        updateWalletState: (walletUpdate: Partial<WalletState>) => {
          set((state) => {
            Object.assign(state.wallet, walletUpdate);
          });
        },
      },
    })),
    {
      name: "web3-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wallet: {
          address: state.wallet.address,
          isConnected: state.wallet.isConnected,
          isSignedIn: state.wallet.isSignedIn,
          isLoading: state.wallet.isLoading,
          chain: state.wallet.chain,
        },
      }),
    }
  )
);
