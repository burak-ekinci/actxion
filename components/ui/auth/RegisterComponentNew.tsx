"use client";
import { useWeb3Store } from "@/store/web3Store";
import { useEffect, useState } from "react";
import {
  useSignMessage,
  useAccount,
} from "wagmi";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";
import { WalletIcon } from "@heroicons/react/24/outline";
import { Signature } from "lucide-react";
import { signIn } from "@/app/auth";
import { toast } from "react-toastify";

export default function RegisterComponent() {
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
  const [showWalletSignPopup, setShowWalletSignPopup] = useState(false);
  const { signMessageAsync } = useSignMessage();

  // Email/Password registration states
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);

  // Email/Password registration function
  const handleEmailRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch("/api/auth/v1/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        setRegisterData({ email: "", password: "", confirmPassword: "" });
        router.push("/login");
      } else {
        toast.error(data.error || "Kayıt başarısız");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Kayıt sırasında bir hata oluştu");
    } finally {
      setIsRegistering(false);
    }
  };

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
      setShowWalletSignPopup(true);
    } catch (error) {
      console.error("Cüzdan bağlantısı sırasında hata:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const closeWalletSignPopup = () => {
    setShowWalletSignPopup(false);
    setAuthStatus({ status: "idle", message: "" });
    setSignature(null);
    setMessageToSign(null);
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

      const response = await fetch(
        `/api/auth/getMessage?address=${currentAddress}`
      );
      const data = await response.json();

      if (!response.ok || !data.valid) {
        setIsAuthenticating(false);
        throw new Error(data.error || "can't get message");
      }

      const signedMessage = await signMessageAsync({
        message: data.message,
      });

      setSignature(signedMessage);
      setMessageToSign(data.message);

      setAuthStatus({
        status: "loading",
        message: "Verifying signature...",
      });

      // Verify signature
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: currentAddress,
          message: data.message,
          signature: signedMessage,
          nonce: data.nonce,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.valid) {
        setAuthStatus({
          status: "success",
          message: "Sign in success",
        });
        store.actions.updateWalletState({
          isSignedIn: true,
        });
        setShowWalletSignPopup(false);
        return router.push("/dashboard");
      } else {
        throw new Error(verifyData.error || "Verification failed");
      }
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
    <>
      <div className="flex h-screen flex-col justify-center py-10 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src="/actxion-logo.png"
            className="mx-auto h-32 w-auto"
          />
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            {/* Email/Password Registration Form */}
            <form onSubmit={handleEmailRegistration} className="space-y-6">
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    autoComplete="new-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Create a password"
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    autoComplete="new-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Confirm your password"
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>

            {/* Wallet Connection Section */}
            <div>
              <div className="mt-10 flex items-center gap-x-6">
                <div className="w-full flex-1 border-t border-gray-200" />
                <p className="text-sm/6 font-medium text-nowrap text-gray-900">
                  Or continue with
                </p>
                <div className="w-full flex-1 border-t border-gray-200" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="#"
                  onClick={connectWallet}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent"
                >
                  <WalletIcon className="h-5 w-5" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </a>

                <a
                  href="/login"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent"
                >
                  Sign In Instead
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Sign Popup */}
        {showWalletSignPopup && (
          <Dialog open={showWalletSignPopup} onClose={closeWalletSignPopup} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Signature className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Sign Message to Continue
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Please sign the message below to authenticate your wallet and complete registration.
                        </p>
                      </div>

                      {/* Wallet Info */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900">
                            Wallet Status:
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            wallet.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {wallet.isConnected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                        {wallet.address && (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Address:
                            </p>
                            <p className="text-xs text-gray-500 font-mono break-all">
                              {wallet.address}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Auth Status */}
                      {authStatus.status !== "idle" && (
                        <div
                          className={`mb-4 p-3 rounded-lg ${
                            authStatus.status === "loading"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : authStatus.status === "success"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          <p className="text-sm">{authStatus.message}</p>
                        </div>
                      )}

                      {/* Message to Sign */}
                      {messageToSign && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-[#ff7b00] text-[#ff7b00]">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            Message to Sign:
                          </p>
                          <p className="text-sm text-gray-700 break-all">
                            {messageToSign}
                          </p>
                        </div>
                      )}

                      {/* Sign Button */}
                      <div className="flex flex-col space-y-3">
                        <button
                          onClick={signMessage}
                          disabled={isAuthenticating || !wallet.isConnected}
                          className={`w-full flex  duration-200 justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-black transition-colors ${
                            wallet.isConnected && !isAuthenticating
                              ? "hover:bg-[#ff7b00a1] bg-[#ff8d23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isAuthenticating ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Signing...
                            </>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Signature className="h-5 w-5" />
                              <span className="text-sm/6 font-semibold">
                                Sign in with Wallet
                              </span>
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={closeWalletSignPopup}
                          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        )}

        <div className="mt-6 text-center text-sm/6 text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </div>
      </div>
    </>
  );
}
