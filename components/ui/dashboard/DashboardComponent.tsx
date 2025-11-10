"use client";
import { contracts } from "@/contracts";
import { wagmiConfig } from "@/lib/wagmi-config";
import { useWeb3Store } from "@/store/web3Store";
import React, { useEffect, useRef, useState } from "react";
import { Log, decodeEventLog } from "viem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAccount,
  useDisconnect,
  useChainId,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import Link from "next/link";

const DashBoard = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const messageRef = useRef<HTMLInputElement | null>(null);
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    isSuccess: isWriteSuccess,
    error: writeError,
  } = useWriteContract();
  const {
    data: getMessage,
    refetch: refetchMessage,
    isPending,
  } = useReadContract({
    ...contracts.messageContract,
    functionName: "getMessage",
  });
  const [contractMessage, setContractMessage] = useState<string | null>(null);

  // Event izleme
  useWatchContractEvent({
    ...contracts.messageContract,
    eventName: "Transfer",
    onLogs(logs) {
      console.log("New logs!", logs);
      setLogs(logs);

      // Her yeni log için toast bildirimi göster
      logs.forEach((log) => {
        try {
          const decodedLog = decodeEventLog({
            abi: contracts.messageContract.abi,
            data: log.data,
            topics: log.topics,
          }) as {
            eventName: string;
            args: { message: string; setter: string };
          };

          toast.info(
            <div>
              <p>
                <strong>Yeni Mesaj:</strong> {decodedLog.args.message}
              </p>
              <p>
                <strong>Gönderen:</strong> {decodedLog.args.setter}
              </p>
            </div>
          );
        } catch (error) {
          console.error("Log decode error:", error);
        }
      });
    },
  });
  const [logs, setLogs] = useState<Log[] | null>();

  // İşlem durumlarını izle ve toast bildirimleri göster
  useEffect(() => {
    if (isWritePending) {
      toast.info("İşlem gönderiliyor...");
    }

    if (isWriteSuccess) {
      toast.success("Mesaj başarıyla kaydedildi!");
    }

    if (writeError) {
      toast.error(`Hata: ${writeError.message}`);
    }
  }, [isWritePending, isWriteSuccess, writeError]);

  const setMessage = async () => {
    try {
      if (!messageRef.current) return;

      writeContract({
        ...contracts.messageContract,
        functionName: "setMessage",
        args: [messageRef.current.value],
      });
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
      throw new Error("error");
    }
  };

  const chainId = useChainId();

  const { wallet } = useWeb3Store();
  const [isLoading, setIsLoading] = useState(true);
  const [walletContent, setWalletContent] = useState<React.ReactNode>(null);

  // İstemci tarafında render için useEffect kullanımı
  useEffect(() => {
    // İstemci tarafında çalıştığından emin olalım
    setWalletContent(
      isConnected ? (
        <ul className="flex flex-col items-center gap-4">
          <li>
            <button
              className="btn btn-primary"
              onClick={() => {
                disconnect();
                toast.info("Cüzdan bağlantısı kesildi");
              }}
            >
              Sign Out
            </button>
          </li>
          <li>
            <strong>{address}</strong>
          </li>
        </ul>
      ) : (
        <h3>Please connect your wallet</h3>
      )
    );

    setIsLoading(false);
  }, [isConnected, address, disconnect]);

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-white-500 mb-6">
          Dashboard -{" "}
          <Link
            href="/"
            className="btn bg-sky-700 p-2 rounded hover:bg-sky-600"
          >
            <i>Go To Home Page</i>
          </Link>
        </h1>

        {/* Cüzdan ve Ağ Bilgileri */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            {isLoading ? (
              <div className="animate-pulse">Yükleniyor...</div>
            ) : (
              <>
                {isConnected ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="bg-gray-700 px-4 py-2 rounded">
                        <p className="text-gray-300 text-sm">Cüzdan Adresi:</p>
                        <p className="text-emerald-400 text-sm font-mono break-all">
                          {address}
                        </p>
                      </div>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        onClick={() => {
                          disconnect();
                          toast.info("Cüzdan bağlantısı kesildi");
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                    {chainId && (
                      <div className="bg-gray-700 px-4 py-2 rounded w-full">
                        <p className="text-gray-300 text-sm">Ağ:</p>
                        <p className="text-sky-400">{wallet.chain}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-800 text-yellow-200 p-3 rounded w-full text-center">
                    Lütfen cüzdanınızı bağlayın
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Kontrat Etkileşimleri */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-3">
          <div className="mb-4">
            <h2 className="text-xl text-white font-semibold mb-2">
              Set Message Contract
            </h2>
            <div className="bg-gray-700 p-3 rounded flex justify-center gap-3">
              <input
                type="text"
                ref={messageRef}
                className="border border-emerald-400 p-2 rounded"
                placeholder="enter message"
              />
              <button
                onClick={setMessage}
                disabled={isWritePending}
                className={`btn bg-emerald-700 p-2 rounded hover:bg-emerald-600 ${
                  isWritePending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isWritePending ? "İşleniyor..." : "Set Message"}
              </button>
            </div>
            <div className="bg-gray-700 p-3 rounded flex justify-center my-3">
              <p className="" style={{ fontSize: 10 }}>
                {hash ? hash : null}
              </p>
            </div>
            <div className="bg-gray-700 p-3 rounded flex items-center justify-around mt-3">
              <div>
                <span>
                  The Message :{" "}
                  {isPending ? "bekleniyor..." : getMessage?.toString()}
                </span>
              </div>
              <div>
                <button
                  onClick={() => {
                    refetchMessage();
                    toast.info("Mesaj yenileniyor...");
                  }}
                  className="btn bg-sky-700 p-2 rounded hover:bg-sky-600"
                >
                  Get Message
                </button>
              </div>
            </div>
            <div className="bg-gray-700 p-3 rounded block items-center justify-around mt-3">
              <h3 className="text-white mb-2">Son Etkinlikler</h3>
              <div className="max-h-40 overflow-y-auto">
                {logs?.map((log, index) => {
                  try {
                    const decodedLog = decodeEventLog({
                      abi: contracts.messageContract.abi,
                      data: log.data,
                      topics: log.topics,
                    }) as {
                      eventName: string;
                      args: { message: string; setter: string };
                    };

                    return (
                      <div key={index} className="bg-gray-800 p-2 rounded mb-2">
                        <p className="text-emerald-400">
                          Mesaj: {decodedLog.args.message || "N/A"}
                        </p>
                        <p className="text-sky-400">
                          Gönderen: {decodedLog.args.setter || "N/A"}
                        </p>
                      </div>
                    );
                  } catch (error) {
                    console.error("Log decode error:", error);
                    return (
                      <div key={index} className="text-red-400">
                        Log decode error
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
