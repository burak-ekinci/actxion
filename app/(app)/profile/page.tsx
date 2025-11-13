"use client";

import MainLayout from "@/components/ui/shared/MainLayout";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWeb3Store } from "@/store/web3Store";
import { useSignMessage } from "wagmi";
import { toast } from "react-toastify";
import { WalletIcon, LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { wallet, actions } = useWeb3Store();
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isDisconnectingWallet, setIsDisconnectingWallet] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const { signMessageAsync } = useSignMessage();

  // Kullanıcının wallet bilgilerini getir
  useEffect(() => {
    const fetchUserWallet = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/v1/user/profile");
          if (response.ok) {
            const data = await response.json();
            setUserWalletAddress(data.walletAddress || null);
          }
        } catch (error) {
          console.error("Wallet bilgisi alınırken hata:", error);
        }
      }
      setIsLoading(false);
    };

    if (status !== "loading") {
      fetchUserWallet();
    }
  }, [session, status]);

  const connectWallet = async () => {
    if (!wallet.isConnected) {
      toast.error("Önce cüzdanınızı bağlayın");
      return;
    }

    setIsConnectingWallet(true);
    try {
      // İmza için mesaj al
      const response = await fetch(
        `/api/auth/getMessage?address=${wallet.address}`
      );
      const data = await response.json();

      if (!response.ok || !data.valid) {
        throw new Error(data.error || "Mesaj alınamadı");
      }

      // Mesajı imzala
      const signature = await signMessageAsync({
        message: data.message,
      });

      // Wallet'i bağla
      const connectResponse = await fetch("/api/v1/user/wallet/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: wallet.address,
          signature,
        }),
      });

      const connectData = await connectResponse.json();

      if (!connectResponse.ok) {
        throw new Error(connectData.error || "Wallet bağlama başarısız");
      }

      setUserWalletAddress(wallet.address);
      toast.success("Wallet başarıyla bağlandı!");
    } catch (error) {
      console.error("Wallet bağlama hatası:", error);
      toast.error(
        error instanceof Error ? error.message : "Wallet bağlama başarısız"
      );
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const disconnectWallet = async () => {
    setIsDisconnectingWallet(true);
    try {
      const response = await fetch("/api/v1/user/wallet/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Wallet bağlantısı kaldırılamadı");
      }

      setUserWalletAddress(null);
      toast.success("Wallet bağlantısı kaldırıldı!");
    } catch (error) {
      console.error("Wallet bağlantısı kaldırma hatası:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Wallet bağlantısı kaldırılamadı"
      );
    } finally {
      setIsDisconnectingWallet(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Lütfen giriş yapın</p>
      </div>
    );
  }

  // TypeScript için session.user kontrolü
  if (!session.user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Kullanıcı bilgileri bulunamadı</p>
      </div>
    );
  }

  // Güvenli kullanım için user'ı değişkene atayalım
  const user = session.user as NonNullable<typeof session.user>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Kullanıcı Bilgileri */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Kullanıcı Bilgileri
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user!.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ad
                </label>
                <p className="mt-1 text-sm text-gray-900">{user!.name}</p>
              </div>
            </div>
          </div>

          {/* Wallet Bağlantısı */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Wallet Bağlantısı
            </h2>

            {userWalletAddress ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <WalletIcon className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Wallet Bağlı
                      </p>
                      <p className="text-xs text-green-600 font-mono">
                        {userWalletAddress}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    disabled={isDisconnectingWallet}
                    className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    {isDisconnectingWallet
                      ? "Kaldırılıyor..."
                      : "Bağlantıyı Kaldır"}
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    Bu wallet ile giriş yapabilirsiniz. Farklı bir wallet
                    bağlamak için önce mevcut bağlantıyı kaldırın.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>
                    Wallet bağlayarak Sign in with Ethereum özelliğini
                    kullanabilirsiniz.
                  </p>
                </div>

                {!wallet.isConnected ? (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center">
                      <WalletIcon className="h-5 w-5 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        Önce cüzdanınızı bağlayın
                      </p>
                    </div>
                    <button
                      onClick={() => actions.connect()}
                      className="px-3 py-1 text-sm bg-yellow-600 text-white hover:bg-yellow-700 rounded-md transition-colors"
                    >
                      Cüzdan Bağla
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center">
                      <WalletIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Cüzdan Bağlı
                        </p>
                        <p className="text-xs text-blue-600 font-mono">
                          {wallet.address}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={connectWallet}
                      disabled={isConnectingWallet}
                      className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      {isConnectingWallet
                        ? "Bağlanıyor..."
                        : "Bu Wallet'i Bağla"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
