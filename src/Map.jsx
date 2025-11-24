import { useEffect, useRef, useState } from "react";
import "./App.css";

function MapPage() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [plans, setPlans] = useState([]);

  // API anahtarları
  const GOOGLE_API_KEY = "AIzaSyAxIKsElgx4hS_ISTRFaWwSQPGnGkHZo1I";
  const WEATHER_API_KEY = "6202cdefcf0b5d7bfa79785408f24a76";

  useEffect(() => {
    // LocalStorage planlar
    const savedPlans = JSON.parse(localStorage.getItem("travelPlans")) || [];
    setPlans(savedPlans);

    // Google Maps
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    const initialCenter = { lat: 39.9208, lng: 32.8541 }; // Ankara
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstance.addListener("click", (e) => handleMapClick(e.latLng, mapInstance));
    setMap(mapInstance);
  };

  const handleMapClick = (location, mapInstance) => {
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
    });
    setMarkers((prev) => [...prev, newMarker]);

    // rota çizimi
    if (markers.length >= 1) {
      drawRoute([...markers.map((m) => m.getPosition()), location]);
    }
  };

  const drawRoute = (points) => {
    if (points.length < 2) return;

    const directionsService = new window.google.maps.DirectionsService();
    const renderer = new window.google.maps.DirectionsRenderer();
    renderer.setMap(map);
    setDirectionsRenderer(renderer);

    const origin = points[0];
    const destination = points[points.length - 1];
    const waypoints = points.slice(1, -1).map((loc) => ({ location: loc, stopover: true }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          renderer.setDirections(response);
        } else {
          alert("Rota oluşturulamadı: " + status);
        }
      }
    );
  };

  const clearMap = () => {
    markers.forEach((m) => m.setMap(null));
    setMarkers([]);
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    setDirectionsRenderer(null);
  };

  const savePlan = () => {
    if (markers.length < 2) {
      alert("Bir rota oluşturmak için en az iki nokta seçmelisin.");
      return;
    }

    const planName = prompt("Plan için bir isim gir (örn. Ege Turu 2025):");
    if (!planName) return;

    const planData = {
      name: planName,
      date: new Date().toLocaleString(),
      routeCount: markers.length,
    };

    const updatedPlans = [...plans, planData];
    setPlans(updatedPlans);
    localStorage.setItem("travelPlans", JSON.stringify(updatedPlans));

    alert("Plan kaydedildi ✅");
  };

  const fetchWeather = async () => {
    if (!map) return;
    setLoadingWeather(true);

    try {
      const center = map.getCenter();
      const lat = center.lat();
      const lon = center.lng();

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );

      if (!response.ok) throw new Error("Weather data could not be fetched.");

      const data = await response.json();
      setWeather({
        name: data.name || "Unknown",
        temp: data.main.temp,
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (error) {
      console.error(error);
      alert("Hava durumu alınamadı. API anahtarını ve izinleri kontrol et.");
    } finally {
      setLoadingWeather(false);
    }
  };
  
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* Üst Menü */}
      <nav className="navbar" style={{ position: "fixed", top: 0, width: "100%", zIndex: 2 }}>
        <div className="nav-container">
          <div className="logo" onClick={() => (window.location.href = "/")}>
            <span className="logo-icon">✈️</span>
            <span className="logo-text">Travel Planner</span>
          </div>
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => (window.location.href = "/")}>
              Back
            </button>
            <button className="btn-primary" onClick={clearMap}>
              Clear
            </button>
            <button className="btn-primary" onClick={savePlan}>
              Save Plan
            </button>
            <button className="btn-primary" onClick={fetchWeather}>
              {loadingWeather ? "Loading..." : "Check Weather"}
            </button>
          </div>
        </div>
      </nav>

      {/* Harita */}
      <div ref={mapRef} style={{ width: "100%", height: "100%", marginTop: "70px" }}></div>

      {/* Hava Durumu Bilgisi */}
      {weather && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            background: "white",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <h3 style={{ marginBottom: "0.5rem" }}>☁️ Weather Info</h3>
          <p style={{ margin: 0, fontWeight: "bold" }}>{weather.name}</p>
          <p style={{ margin: 0 }}>
            {weather.temp}°C — {weather.desc}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="icon"
            width="60"
          />
        </div>
      )}

      {/* Kayıtlı Planlar Listesi */}
      {plans.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            background: "white",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            maxHeight: "300px",
            overflowY: "auto",
            width: "250px",
          }}
        >
          <h3 style={{ marginBottom: "0.5rem" }}>📜 Saved Plans</h3>
          {plans.map((p, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <strong>{p.name}</strong>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>{p.date}</p>
              <small>{p.routeCount} points</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MapPage;
