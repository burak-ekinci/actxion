// src/components/providers/client-providers.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useWeb3Store } from "@/store/web3Store";
import { useAccount, useChainId } from "wagmi";
import { chainConfig } from "viem/zksync";
import CHAIN_IDS from "@/lib/constants";
import { wagmiConfig } from "@/lib/wagmi-config";
import { useRouter } from "next/navigation";

interface Web3ProvidersProps {
  children: ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  const { wallet, actions } = useWeb3Store();
  const { isConnected, address, connector } = useAccount();
  const chainId = useChainId();
  const store = useWeb3Store();
  const router = useRouter();
  const [pendingAccountsChanged, setPendingAccountsChanged] = useState<
    string[] | null
  >(null);

  // otomatik baglanti yapacak eger bagli ise
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      wallet.isConnected &&
      !wallet.address
    ) {
      actions.connect();
    }
  }, [wallet.isConnected, wallet.address, actions]);

  // Hesap değişikliği durumunda state güncellemesi için ayrı bir useEffect
  useEffect(() => {
    if (pendingAccountsChanged !== null) {
      const newAddress =
        pendingAccountsChanged.length > 0 ? pendingAccountsChanged[0] : null;

      // Eğer hesap varsa (bağlıysa)
      if (newAddress) {
        // Güncel chain ID'yi al (bu async bir işlem olduğu için ayrı bir fonksiyon olarak düşünelim)
        const getCurrentChainInfo = async () => {
          try {
            // Chain ID'yi al (burada connector veya provider'dan alabiliriz)
            const connector = wagmiConfig.connectors[0];
            const chainId = await connector.getChainId();
            const chainInfo = CHAIN_IDS.find(
              (chain) => chain.chainId === chainId
            );

            // Wallet state'ini güncelle
            store.actions.updateWalletState({
              address: newAddress,
              isConnected: true,
              isLoading: false,
              isError: false,
              error: null,
              chain: chainInfo?.name || null,
            });
          } catch (error) {
            console.error("Chain ID alınırken hata oluştu:", error);
            // Sadece adres bilgisini güncelle, chain bilgisini değiştirme
            store.actions.updateWalletState({
              address: newAddress,
              isConnected: true,
              isLoading: false,
              isError: false,
              error: null,
            });
          }
        };

        getCurrentChainInfo();
      } else {
        // Hesap yoksa bağlantıyı kes
        store.actions.updateWalletState({
          address: null,
          isConnected: false,
          isSignedIn: false,
          isLoading: false,
          isError: false,
          error: null,
          chain: null,
        });
      }

      // İşlem tamamlandı, state'i temizle
      setPendingAccountsChanged(null);
    }
  }, [pendingAccountsChanged, store.actions]);

  // Ethereum olaylarını dinle
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      // State güncellemesini doğrudan yapmak yerine, pending state'e kaydet
      setPendingAccountsChanged(accounts);
    };

    const handleChainChanged = async () => {
      console.log(CHAIN_IDS.find((chain) => chain.chainId === chainId));
      actions.switchChain(chainId);
      // window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("connect", () => {
      actions.connect();
    });

    window.ethereum.on("disconnect", () => {
      actions.disconnect();
      store.actions.updateWalletState({
        address: null,
        isConnected: false,
        isSignedIn: false,
        isLoading: false,
        isError: false,
        error: null,
        chain: null,
      });
      return router.push("/");
    });

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("disconnect", () => {
        actions.disconnect();
        store.actions.updateWalletState({
          address: null,
          isConnected: false,
          isSignedIn: false,
          isLoading: false,
          isError: false,
          error: null,
          chain: null,
        });
        return router.push("/");
      });
      window.ethereum.removeListener("connect", () => {
        actions.connect();
      });
    };
  }, [wallet.address, actions, address, router, store.actions]);

  return <>{children}</>;
}
