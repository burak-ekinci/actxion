import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongoose";

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı session kontrolü
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({
        error: "Oturum açmanız gerekiyor",
        status: 401,
      });
    }

    await dbConnect();

    const body = await request.json();
    const { walletAddress, signature } = body;

    // Validasyon
    if (!walletAddress) {
      return NextResponse.json({
        error: "Wallet adresi gerekli",
        status: 400,
      });
    }

    // Wallet adresi format kontrolü (Ethereum adresi)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(walletAddress)) {
      return NextResponse.json({
        error: "Geçersiz wallet adresi formatı",
        status: 400,
      });
    }

    // Bu wallet adresi başka bir kullanıcıya bağlı mı kontrol et
    const existingUserWithWallet = await User.findOne({ walletAddress });
    if (
      existingUserWithWallet &&
      existingUserWithWallet.email !== session.user.email
    ) {
      return NextResponse.json({
        error: "Bu wallet adresi başka bir hesaba bağlı",
        status: 400,
      });
    }

    // Kullanıcının mevcut kaydını güncelle
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        walletAddress,
        signature,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({
        error: "Kullanıcı bulunamadı",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Wallet başarıyla bağlandı",
      walletAddress: updatedUser.walletAddress,
      status: 200,
    });
  } catch (error) {
    console.error("Wallet connect error:", error);
    return NextResponse.json({
      error: "Wallet bağlama sırasında bir hata oluştu",
      status: 500,
    });
  }
}
