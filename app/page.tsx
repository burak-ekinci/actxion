"use client";

import { useWeb3Store } from "@/store/web3Store";
import { useEffect, useRef, useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useSignMessage,
  useVerifyMessage,
  useAccount,
} from "wagmi";
import { contracts } from "@/contracts";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { wallet, actions } = useWeb3Store();
  const store = useWeb3Store();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { address: wagmiAddress } = useAccount();
  const [authStatus, setAuthStatus] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const [signature, setSignature] = useState<string | null>(null);
  const [messageToSign, setMessageToSign] = useState<string | null>(null);
  const { signMessageAsync } = useSignMessage();

  // onchangewallet
  useEffect(() => {
    if (wallet.address || wagmiAddress) {
      setSignature(null);
      setMessageToSign(null);
      setAuthStatus({
        status: "idle",
        message: "",
      });
    }
    if (store.wallet.isSignedIn) {
      return router.push("/dashboard");
    }
  }, [wallet.address, wagmiAddress]);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      await actions.connect();
    } catch (error) {
      console.error("Cüzdan bağlantısı sırasında hata:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // sign message function
  const signMessage = async () => {
    setIsAuthenticating(true);
    setAuthStatus({
      status: "loading",
      message: "Signing preparations, please wait...",
    });

    try {
      const currentAddress = wagmiAddress;

      // message cekelim
      const response = await fetch(
        `/api/auth/getMessage?address=${currentAddress}`
      );
      const data = await response.json();

      if (!response.ok || !data.valid) {
        setIsAuthenticating(false);
        throw new Error(data.error || "can't get message");
      }

      if (!data.message) {
        console.error("sign error & can't get message");

        setAuthStatus({
          status: "error",
          message: "Can't get message, please sign again",
        });
        setIsAuthenticating(false);
        return;
      }

      // address control again
      if (!currentAddress) {
        setIsAuthenticating(false);
        setAuthStatus({
          status: "error",
          message: "There is no wallet address, please connect wallet",
        });
        return;
      }
      setMessageToSign(data.message);

      // lets sign message
      const signature = await signMessageAsync({
        message: data.message,
      });

      const sendSignature = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: wagmiAddress, signature }),
      });

      const signatureValid = await sendSignature.json();

      if (!sendSignature.ok) {
        setIsAuthenticating(false);
        throw new Error(data.error || "can't get message");
      }

      if (!signatureValid.valid) {
        setIsAuthenticating(false);
        throw new Error(signatureValid.error || "signature is not valid");
      }

      setAuthStatus({
        status: "success",
        message: "Sign in success",
      });
      store.actions.updateWalletState({
        isSignedIn: true,
      });
      return router.push("/dashboard");
      // İmzalama başarılı olduğunda, doğrulama için gereken tüm değerleri döndür
    } catch (error) {
      console.error("İmzalama hatası:", error);
      setIsAuthenticating(false);
      setAuthStatus({
        status: "error",
        message: error instanceof Error ? error.message : "İmzalama başarısız",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4 bg-gray-900">
      <h1 className="text-2xl text-violet-500 font-bold mb-6">
        Wallet & Contract Interactions{" "}
      </h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-xl text-white font-semibold mb-2">Wallet</h2>
          <div className="bg-gray-700 p-3 rounded">
            <p className="text-gray-300">
              <span className="font-medium">Status:</span>{" "}
              {wallet.isConnected ? (
                <span className="text-green-400">• Connected</span>
              ) : (
                <span className="text-yellow-400">• Disconnected</span>
              )}
            </p>

            {wallet.address && (
              <p className="text-gray-300 mt-2 break-all">
                <span className="font-medium">Address:</span>{" "}
                <span className="text-blue-300">{wallet.address}</span>
              </p>
            )}

            {wallet.chain && (
              <p className="text-gray-300 mt-2 break-all">
                <span className="font-medium">Chain:</span>{" "}
                <span className="text-blue-300">{wallet.chain}</span>
              </p>
            )}

            {wallet.isError && (
              <p className="text-red-400 mt-2">
                <span className="font-medium">Error:</span>{" "}
                {wallet.error?.message || "Bilinmeyen hata"}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={connectWallet}
          disabled={isConnecting || wallet.isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            wallet.isConnected
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } ${
            (isConnecting || wallet.isLoading) &&
            "opacity-70 cursor-not-allowed"
          }`}
        >
          {isConnecting || wallet.isLoading
            ? "Connecting..."
            : wallet.isConnected
            ? "Connected"
            : "Connect Wallet"}
        </button>

        {wallet.isConnected && (
          <button
            onClick={() => actions.disconnect()}
            className="w-full mt-3 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            Disconnect Wallet
          </button>
        )}
      </div>

      {/* Kimlik Doğrulama Bölümü */}
      {wallet.isConnected && (
        <div className="card flex flex-col w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-700 p-4 border-b border-gray-600">
            <h3 className="text-lg font-medium text-gray-200">
              Kimlik Doğrulama
            </h3>
          </div>
          <div className="p-6 flex flex-col">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Cüzdanınızla kimliğinizi doğrulamak için, backend'den alınan bir
                nonce değerini imzalamanız gerekiyor.
              </p>

              {authStatus.status !== "idle" && (
                <div
                  className={`mt-3 p-3 rounded ${
                    authStatus.status === "loading"
                      ? "bg-blue-900 text-blue-200"
                      : authStatus.status === "success"
                      ? "bg-green-900 text-green-200"
                      : "bg-red-900 text-red-200"
                  }`}
                >
                  <p>{authStatus.message}</p>
                </div>
              )}

              {messageToSign && (
                <div className="mt-3 p-3 bg-gray-700 rounded">
                  <p className="text-sm text-gray-400">İmzalanacak Mesaj:</p>
                  <p className="text-amber-400 break-all">{messageToSign}</p>
                </div>
              )}

              {signature && (
                <div className="mt-3 p-3 bg-gray-700 rounded">
                  <p className="text-sm text-gray-400">İmza:</p>
                  <p className="text-amber-400 break-all">{signature}</p>
                </div>
              )}
            </div>

            <button
              onClick={signMessage}
              disabled={isAuthenticating}
              className={`w-full py-3 px-4 ${
                isAuthenticating
                  ? " bg-red-400 hover:bg-red-300"
                  : "bg-sky-600 hover:bg-sky-500"
              } text-white rounded-md font-medium transition-colors ${
                isAuthenticating && "opacity-70 cursor-not-allowed"
              }`}
            >
              {isAuthenticating ? "Signing..." : "Sign in"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
