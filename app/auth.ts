import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider,
    Credentials({
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
});
