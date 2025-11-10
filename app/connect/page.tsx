"use client";
import React, { useState } from "react";
import { verifyMessage } from "viem";
import { useAccount, useSignMessage } from "wagmi";

const ConnectPage = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<any>(null);
  const { signMessageAsync } = useSignMessage();

  const getMessage = async () => {
    try {
      const response = await fetch(`/api/auth/nonce?address=${address}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data.message);
      return data.message;
    } catch (error) {
      console.error(error);
    }
  };

  const test = async () => {
    const signature = await verifyMessage({
      address: "0x7A0151479C6b9B4851427F35e452FDf53DDCD916",
      signature:
        "0x089f83b3056af494bf3cc87ec19cb5f091a121513c3b22c8043e548dea73c5332e6ca4c3672548043a2813d0c6540ae66edcbbd4b487ccf65c672159705dace01b",
      message:
        "Welcome to Activate Earth...Please sign this message to verify your identity.Nonce: de912c493ffed2097fa6e66aca9768f0281a148f3f836ba218e15cb8c1e63093",
    });
    console.log(signature);
  };

  const signWithWallet = async () => {
    setLoading(true);
    try {
      const messageText = await getMessage();
      if (!messageText) {
        setLoading(false);
        console.log("mesaj yok");
        return;
      }

      const signature = await signMessageAsync({
        message: messageText,
      });

      const sendSignature = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature, message: messageText }),
      });
      console.log(address, signature, messageText);
      const data = await sendSignature.json();
      console.log(data);
      setMessage(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">Sign In</h1>
      <h3 className="text-2xl font-bold text-blue-500 m-3">
        {loading ? "Loading..." : "Sign In With Wallet"}
      </h3>
      {message && (
        <p className="text-sm text-green-500">
          Message is: {message.success ? message.message : "No message"}
        </p>
      )}
      <button
        onClick={signWithWallet}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Sign In With Wallet
      </button>
      <button onClick={test}>test</button>
    </div>
  );
};

export default ConnectPage;
