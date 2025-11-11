import React, { useEffect, useRef, useState } from "react";

// Google Maps için global type declaration
declare global {
  interface Window {
    google: any;
  }
}

// Tailwind sınıfları için basitleştirilmiş bir konteyner
const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

// Harita varsayılan ayarları
const defaultCenter = {
  lat: 41.0082, // İstanbul'a yakın bir merkez
  lng: 28.9784,
};

// Harita yükleme URL'si (API_KEY alanını kendi anahtarınızla değiştirin)
const API_KEY = "AIzaSyBCRIn1dEC9FUR97CoaseH63GC0KeE034s";
const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

// Global flag to prevent multiple script loads
let isScriptLoading = false;
let isScriptLoaded = false;

interface LocationData {
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  onLocationSelect: (location: LocationData) => void;
  selectedLocation?: LocationData | null;
}

export default function GoogleMap({
  onLocationSelect,
  selectedLocation: initialLocation,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [mapLoaded, setMapLoaded] = useState(false);

  // 1. ADIM: Google Harita Script'ini Yükle (Sadece bir kez)
  useEffect(() => {
    // If already loaded, just set the state
    if (window.google) {
      setMapLoaded(true);
      return;
    }

    // If script is already loading, wait for it
    if (isScriptLoading) {
      const checkLoaded = setInterval(() => {
        if (window.google) {
          setMapLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // If script is already loaded but not in window.google yet
    if (isScriptLoaded) {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          setMapLoaded(true);
          clearInterval(checkGoogle);
        }
      }, 100);
      return () => clearInterval(checkGoogle);
    }

    // Load the script for the first time
    isScriptLoading = true;
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      setMapLoaded(true);
    };
    script.onerror = () => {
      isScriptLoading = false;
      console.error("Google Maps script failed to load");
    };
    document.head.appendChild(script);

    // Don't remove the script on cleanup to allow reuse
    return () => {
      // Script will remain in DOM for other instances
    };
  }, []);

  // 2. ADIM: Script yüklendikten sonra haritayı oluştur ve olay dinle
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // Harita nesnesini oluştur
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: defaultCenter,
        scrollwheel: true, // Mouse wheel ile zoom
        gestureHandling: "greedy", // Dokunmatik cihazlarda gesture handling
        zoomControl: true, // Zoom kontrol butonları
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        mapTypeControl: true, // Harita tipi kontrolü
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_LEFT,
        },
        streetViewControl: true, // Street View kontrolü
        fullscreenControl: true, // Tam ekran kontrolü
      });

      let marker: any = null;

      // 3. ADIM: Tıklama olayını dinle
      map.addListener("click", (mapsMouseEvent: any) => {
        const coords = mapsMouseEvent.latLng!.toJSON();

        // 4. ADIM: Koordinatları state'e kaydet
        setSelectedLocation(coords);

        // Parent componente bildir
        onLocationSelect(coords);

        // Eski işaretleyiciyi kaldır
        if (marker) {
          marker.setMap(null);
        }

        // Yeni işaretleyiciyi ekle
        marker = new window.google.maps.Marker({
          position: coords,
          map: map,
        });
      });
    }
  }, [mapLoaded]);

  // Haritada bir nokta seçildiğinde ne yapılacağını gösteren fonksiyon (örnek)
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      console.log("Seçilen Koordinatlar:", selectedLocation);
      alert(
        `Konum Onaylandı: Lat: ${selectedLocation.lat.toFixed(
          4
        )}, Lng: ${selectedLocation.lng.toFixed(4)}`
      );
      // Burada koordinatları bir üst bileşene veya API'ye iletebilirsiniz.
    } else {
      alert("Lütfen haritada bir konum seçin.");
    }
  };

  return (
    <div className="space-y-3">
      {/* Haritanın yükleneceği div */}
      <div
        ref={mapRef}
        style={mapContainerStyle}
        className="rounded-md border border-gray-300"
      />

      {/* Seçilen koordinatların gösterimi */}
      {selectedLocation && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
          <p className="font-medium text-sm">✓ Konum Seçildi</p>
          <p className="text-xs">
            Lat: {selectedLocation.lat.toFixed(4)}, Lng:{" "}
            {selectedLocation.lng.toFixed(4)}
          </p>
        </div>
      )}

      {!selectedLocation && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
          <p className="font-medium text-sm">📍 Konum Seçin</p>
          <p className="text-xs">Haritada tıklayarak konum belirleyin</p>
        </div>
      )}
    </div>
  );
}
