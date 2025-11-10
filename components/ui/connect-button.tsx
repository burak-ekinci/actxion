"use client";
import { useRouter } from "next/router";
import React from "react";
import { useAccount } from "wagmi";

const ConnectWallet = () => {
  const connect = () => {
    console.log("connectWallet");
  };

  // const { address, isConnected } = useAccount();

  // if (isConnected) {
  //   return router.push("/dashboard");
  // }

  return (
    <div>
      <button
        onClick={() => {
          connect();
        }}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;
