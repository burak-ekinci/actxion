// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI env değişkeni tanımlı değil");
}

// Next.js hot-reload sırasında çoklu bağlantı açılmasını önlemek için cache
const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };

export async function dbConnect() {
  try {
    // Eğer zaten bağlıysa mevcut bağlantıyı döndür
    if (cached.conn) {
      return cached.conn;
    }

    // Eğer bağlantı promise'i varsa bekle
    if (!cached.promise) {
      console.log("MongoDB bağlantısı kuruluyor...");
      cached.promise = mongoose
        .connect(MONGODB_URI, {
          // Bağlantı seçenekleri
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        })
        .then((mongoose) => {
          console.log("MongoDB bağlantısı başarılı");
          return mongoose;
        })
        .catch((error) => {
          console.error("MongoDB bağlantı hatası:", error);
          cached.promise = null; // Hata durumunda promise'i sıfırla
          throw error;
        });
    }

    cached.conn = await cached.promise;
    (global as any).mongoose = cached;
    return cached.conn;
  } catch (error) {
    console.error("dbConnect hatası:", error);
    cached.promise = null; // Hata durumunda promise'i sıfırla
    throw error;
  }
}

// Bağlantı durumunu kontrol etmek için yardımcı fonksiyon
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// Bağlantıyı kapatmak için yardımcı fonksiyon (test amaçlı)
export async function dbDisconnect() {
  try {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    (global as any).mongoose = { conn: null, promise: null };
    console.log("MongoDB bağlantısı kapatıldı");
  } catch (error) {
    console.error("dbDisconnect hatası:", error);
  }
}
