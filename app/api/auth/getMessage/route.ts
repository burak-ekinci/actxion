import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import fs from "fs";
import { Fascinate_Inline } from "next/font/google";

// Basit bir in-memory nonce depolama (gerçek uygulamada veritabanı kullanılmalı)
const nonceStore: Record<string, { nonce: string; timestamp: number }> = {};

// Nonce doğrulama yardımcı fonksiyonu (verify route'unda kullanılacak)
export function verifyNonce(address: string, nonce: string): boolean {
  console.log("Nonce doğrulama:", { address, nonce, store: nonceStore });

  const storedData = nonceStore[address.toLowerCase()];

  if (!storedData) {
    console.log("Nonce bulunamadı:", address.toLowerCase());
    return false;
  }

  // Nonce eşleşiyor mu kontrol et
  const isValid = storedData.nonce === nonce;
  console.log("Nonce eşleşme sonucu:", isValid, {
    stored: storedData.nonce,
    received: nonce,
  });

  // Kullanıldıktan sonra nonce'u sil (tek kullanımlık)
  if (isValid) {
    delete nonceStore[address.toLowerCase()];
  }

  return isValid;
}

export async function GET(request: NextRequest) {
  try {
    // URL'den adresi al
    const address = request.nextUrl.searchParams.get("address");
    console.log("nonce request for adddress -> ", address);

    if (!address || !address.startsWith("0x")) {
      return NextResponse.json({
        error: "invalid ethereum address",
        status: 400,
        valid: false,
      });
    }

    // random nonce
    const nonce = randomBytes(32).toString("hex");
    console.log("the nonce:", nonce);

    const message = `Welcome to Activate Earth...Please sign this message to verify your identity.Nonce: ${nonce}`;

    // simdilik db yerine bir json dosyasina yazacagim
    const getMessageDB = fs.readFileSync("message.json", "utf8");
    const messageDB = JSON.parse(getMessageDB);
    messageDB[address] = message;
    fs.writeFileSync("message.json", JSON.stringify(messageDB, null, 2));

    return NextResponse.json({
      valid: true,
      message,
    });
  } catch (error) {
    console.error("Message error -> ", error);
    return NextResponse.json({
      error: "Making message error",
      status: 500,
      valid: false,
    });
  }
}
