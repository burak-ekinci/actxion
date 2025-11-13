import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verifyMessage } from "viem";
import fs from "fs";

export const authOptions = {
  providers: [
    GoogleProvider,
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          // Import burada yapmak gerekiyor çünkü auth.ts server-side'da çalışıyor
          const { dbConnect } = await import("@/lib/mongoose");
          const User = (await import("@/models/User")).default;

          await dbConnect();

          // Kullanıcıyı email ile bul
          const user = await User.findOne({ email: email.toLowerCase() });

          if (!user) {
            console.log("Kullanıcı bulunamadı:", email);
            return null;
          }

          // Şifreyi doğrula
          const isValidPassword = password === user.password;

          if (!isValidPassword) {
            console.log("Geçersiz şifre:", email);
            return null;
          }

          console.log("BAŞARIYLA GİRİŞ YAPILDI:", email);

          // NextAuth için gerekli format
          return {
            id: (user._id as any).toString(),
            email: user.email,
            name: user.email.split("@")[0], // Email'in @ öncesi kısmını isim olarak kullan
          };
        } catch (error) {
          console.error("Auth hatası:", error);
          return null;
        }
      },
    }),
    Credentials({
      id: "wallet",
      name: "wallet",
      credentials: {
        walletAddress: {
          label: "Wallet Address",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      authorize: async (credentials) => {
        const { walletAddress, signature } = credentials as {
          walletAddress: string;
          signature: string;
        };

        try {
          const { dbConnect } = await import("@/lib/mongoose");
          const User = (await import("@/models/User")).default;

          await dbConnect();

          // Wallet adresi ile kullanıcıyı bul
          const user = await User.findOne({ walletAddress });

          if (!user) {
            console.log("Wallet adresi ile kullanıcı bulunamadı:", walletAddress);
            return null;
          }

          // İmza doğrulama
          const messageDB = fs.readFileSync("message.json", "utf8");
          const messageDBData = JSON.parse(messageDB);
          const message: string = messageDBData[walletAddress];

          if (!message) {
            console.log("İmza için mesaj bulunamadı:", walletAddress);
            return null;
          }

          const isSignatureValid = await verifyMessage({
            address: walletAddress as `0x${string}`,
            signature: signature as `0x${string}`,
            message,
          });

          if (!isSignatureValid) {
            console.log("Geçersiz imza:", walletAddress);
            return null;
          }

          console.log("WALLET İLE BAŞARIYLA GİRİŞ YAPILDI:", user.email);

          // NextAuth için gerekli format
          return {
            id: (user._id as any).toString(),
            email: user.email,
            name: user.email.split("@")[0],
          };
        } catch (error) {
          console.error("Wallet auth hatası:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
    updateAge: 24 * 60 * 60, // 24 saat
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Sign in sonrası dashboard'a yönlendir
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Callback URL varsa onu kullan
      if (new URL(url).origin === baseUrl) return url;
      // Güvenli olmayan URL'ler için ana sayfaya dön
      return baseUrl;
    },
  },
} as const;

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
