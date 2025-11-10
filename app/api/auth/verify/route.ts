import { NextRequest, NextResponse } from "next/server";
import { verifyNonce } from "../getMessage/route";
import { verifyMessage } from "viem";
import fs from "fs";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, signature } = body;
    console.log("sign with wallet:", { address });
    console.log("signature:", signature);

    if (!address || !signature) {
      console.log("Eksik parametreler:", {
        address,
        signature,
      });
      return NextResponse.json(
        { error: "Adres, imza, mesaj ve nonce gerekli" },
        { status: 400 }
      );
    }

    const messageDB = fs.readFileSync("message.json", "utf8");
    const messageDBData = JSON.parse(messageDB);
    const message: string = messageDBData[address];

    const isSignatureValid = await verifyMessage({
      address,
      signature,
      message,
    });

    if (!isSignatureValid) {
      return NextResponse.json({
        valid: false,
        success: false,
        message: "Sign Message is not valid",
      });
    }

    console.log("Kimlik doğrulama başarılı!");
    return NextResponse.json({
      valid: true,
      success: isSignatureValid as boolean,
      message: "Kimlik doğrulama başarılı",
      // token: generateJWT(address)
    });
  } catch (error) {
    console.error("İmza doğrulama hatası:", error);
    return NextResponse.json({
      error,
      status: 500,
      valid: false,
    });
  }
}
