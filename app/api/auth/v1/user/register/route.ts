import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, confirmPassword } = body;

    // Validasyon kontrolleri
    if (!email || !password || !confirmPassword) {
      return NextResponse.json({
        error: "Tüm alanlar zorunludur",
        status: 400,
      });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: "Geçersiz email formatı",
        status: 400,
      });
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return NextResponse.json({
        error: "Şifre en az 6 karakter olmalıdır",
        status: 400,
      });
    }

    // Şifre tekrarı kontrolü
    if (password !== confirmPassword) {
      return NextResponse.json({
        error: "Şifreler eşleşmiyor",
        status: 400,
      });
    }

    // Email unique kontrolü
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({
        error: "Bu email adresi zaten kayıtlı",
        status: 400,
      });
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 12);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({
      message: "Kayıt başarılı",
      status: 201,
    });
  } catch (error) {
    console.error("Register error -> ", error);
    return NextResponse.json({
      error: "Kayıt sırasında bir hata oluştu",
      status: 500,
    });
  }
}
