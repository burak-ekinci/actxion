import { useSignMessage } from "wagmi";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

function AuthComponent() {
  const { address } = useAccount();
  const { data: signature, error, signMessage } = useSignMessage();
  const [nonce, setNonce] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  // Nonce'u sunucudan al
  const fetchNonce = async () => {
    try {
      const response = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      setNonce(data.nonce);
    } catch (error) {
      console.error("Nonce alınamadı:", error);
    }
  };

  // Kullanıcı hesabı bağlandığında nonce al
  useEffect(() => {
    if (address) {
      fetchNonce();
    }
  }, [address]);

  // İmzayı sunucuya gönder ve doğrula
  const verifySignature = async () => {
    if (!signature) return;

    try {
      const message = `Bu siteye giriş yapmak için imzalayın. Nonce: ${nonce}`;

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, message, signature, nonce }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthStatus("Başarıyla giriş yapıldı!");
        // Token'ı local storage'a kaydet
        localStorage.setItem("authToken", data.token);
      } else {
        setAuthStatus("Giriş başarısız: " + data.error);
      }
    } catch (error) {
      console.error("Doğrulama hatası:", error);
      setAuthStatus("Bir hata oluştu");
    }
  };

  // İmza oluşturulduğunda doğrulama yap
  useEffect(() => {
    if (signature) {
      verifySignature();
    }
  }, [signature]);

  const handleLogin = () => {
    if (!nonce || !address) return;

    const message = `Bu siteye giriş yapmak için imzalayın. Nonce: ${nonce}`;
    signMessage({ message });
  };

  return (
    <div>
      <button onClick={handleLogin}>"Cüzdan ile Giriş Yap"</button>
      {error && <div>Hata: {error.message}</div>}
      {authStatus && <div>{authStatus}</div>}
    </div>
  );
}
