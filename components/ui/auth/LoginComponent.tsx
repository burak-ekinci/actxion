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
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import { WalletIcon } from "@heroicons/react/24/outline";
import { Signature } from "lucide-react";
import Link from "next/link";
import { signIn, getCsrfToken } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

const signInSchema = z.object({
  email: z.string().email("Geçersiz email adresi"),
  password: z.string().min(1, "Şifre gerekli"),
});
type SignInFormData = z.infer<typeof signInSchema>;
export default function LoginComponent() {
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
  const [csrfToken, setCsrfToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // CSRF token'ı al
  useEffect(() => {
    const getToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token || "");
    };
    getToken();
  }, []);

  const [signature, setSignature] = useState<string | null>(null);
  const [messageToSign, setMessageToSign] = useState<string | null>(null);
  const [showWalletSignPopup, setShowWalletSignPopup] = useState(false);
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
      // Wallet bağlantısı başarılı olduğunda popup'u göster
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
      setShowWalletSignPopup(false); // Popup'u kapat
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

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        toast.error("Giriş başarısız: " + response.error);
      } else {
        toast.success("Giriş başarılı!");
        router.push("/discover");
      }
    } catch (error) {
      toast.error("Giriş sırasında bir hata oluştu");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
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
            <form
              action="/api/auth/callback/credentials"
              method="POST"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <input name="csrfToken" type="hidden" value={csrfToken} />
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    {...register("email")}
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    {...register("password")}
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-indeterminate:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label
                    htmlFor="remember-me"
                    className="block text-sm/6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm/6">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>
              </div>
            </form>

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
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm/6 font-semibold">Google</span>
                </a>

                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className={`flex w-full items-center justify-center gap-3 
                    rounded-md px-3 py-2 text-sm font-semibold shadow-xs transition-colors duration-200 inset-ring inset-ring-gray-300 hover:bg-[#ffaf64] focus-visible:inset-ring-transparent ${
                      isConnecting
                        ? "bg-gray-400 cursor-not-allowed text-gray-300"
                        : "bg-[#fcc18b] text-gray-900"
                    }`}
                >
                  <Image
                    src="/metamask-icon.svg"
                    alt="Metamask"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm/6 font-semibold">Metamask</span>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Register to Actxion!
            </Link>
          </p>
        </div>
      </div>

      {/* Wallet Sign Popup */}
      <Dialog
        open={showWalletSignPopup}
        onClose={closeWalletSignPopup}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all duration-300 ease-out data-closed:translate-y-4 data-closed:opacity-0 data-enter:translate-y-0 data-enter:opacity-100 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95 data-enter:sm:scale-100"
            >
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  onClick={closeWalletSignPopup}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                  >
                    Sign in with Wallet
                  </DialogTitle>

                  <div className="mt-2">
                    {/* Wallet Status */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Status:
                          </p>
                          <p className="text-sm text-gray-500">
                            {wallet.isConnected ? (
                              <span className="text-green-600 font-medium">
                                ✓ Connected
                              </span>
                            ) : (
                              <span className="text-red-600 font-medium">
                                ✗ Not Connected
                              </span>
                            )}
                          </p>
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
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
