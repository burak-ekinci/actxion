import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongoose";

export async function GET(request: NextRequest) {
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

    // Kullanıcının profil bilgilerini getir
    const user = await User.findOne({ email: session.user.email }).select(
      "email walletAddress createdAt updatedAt"
    );

    if (!user) {
      return NextResponse.json({
        error: "Kullanıcı bulunamadı",
        status: 404,
      });
    }

    return NextResponse.json({
      email: user.email,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      status: 200,
    });

  } catch (error) {
    console.error("Profile get error:", error);
    return NextResponse.json({
      error: "Profil bilgileri alınırken bir hata oluştu",
      status: 500,
    });
  }
}
