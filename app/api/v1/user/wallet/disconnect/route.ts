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

    // Kullanıcının wallet bağlantısını kaldır
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $unset: { walletAddress: 1, signature: 1 },
        updatedAt: new Date()
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
      message: "Wallet bağlantısı başarıyla kaldırıldı",
      status: 200,
    });

  } catch (error) {
    console.error("Wallet disconnect error:", error);
    return NextResponse.json({
      error: "Wallet bağlantısı kaldırılırken bir hata oluştu",
      status: 500,
    });
  }
}
