import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Maps.css';

const GOOGLE_API_KEY = "AIzaSyAxIKsElgx4hS_ISTRFaWwSQPGnGkHZo1I";
const API_BASE_URL = 'http://localhost:8080/api';

function Maps({ user, darkMode, toggleDarkMode, onLogout }) {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markersRef = useRef([]); // useRef ile marker'ları tut!
  const [map, setMap] = useState(null);
  const [markerCount, setMarkerCount] = useState(0); // UI için sayaç
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadGoogleMaps();
    
    return () => {
      // Cleanup - marker'ları temizle
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) marker.setMap(null);
      });
      markersRef.current = [];
      
      if (directionsRenderer && directionsRenderer.setMap) {
        directionsRenderer.setMap(null);
      }
    };
  }, []);

  const loadGoogleMaps = () => {
    if (window.google && window.google.maps && window.google.maps.Map) {
      console.log('Google Maps already loaded');
      initMap();
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      console.log('Removing existing script...');
      existingScript.remove();
    }

    window.initGoogleMapsCallback = () => {
      console.log('Google Maps callback triggered');
      if (window.google && window.google.maps) {
        initMap();
      }
    };

    console.log('Loading Google Maps...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Google Maps');
      setIsLoading(false);
      alert('Harita yüklenemedi. Lütfen sayfayı yenileyin.');
    };
    document.head.appendChild(script);
  };

  const initMap = () => {
    console.log('Initializing map...');
    
    if (!window.google?.maps?.Map) {
      console.error('Google Maps not available');
      setIsLoading(false);
      return;
    }

    try {
      const ankara = { lat: 39.9334, lng: 32.8597 };
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: ankara,
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      mapInstance.addListener('click', (e) => {
        addMarker(e.latLng, mapInstance);
      });

      setMap(mapInstance);
      setIsLoading(false);
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error creating map:', error);
      setIsLoading(false);
      alert('Harita oluşturulamadı: ' + error.message);
    }
  };

  const addMarker = (location, mapInstance) => {
    if (!window.google?.maps) {
      console.error('Google Maps not available');
      return;
    }

    if (markersRef.current.length >= 10) {
      alert('Maksimum 10 nokta ekleyebilirsiniz!');
      return;
    }

    try {
      const markerNumber = markersRef.current.length + 1;
      console.log(`Adding marker ${markerNumber}`);

      const marker = new window.google.maps.Marker({
        position: location,
        map: mapInstance,
        label: {
          text: markerNumber.toString(),
          color: 'white',
          fontWeight: 'bold'
        },
        animation: window.google.maps.Animation.DROP,
      });

      markersRef.current.push(marker);
      setMarkerCount(markersRef.current.length);
      console.log(`Total markers: ${markersRef.current.length}`);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  const createRoute = () => {
    if (markersRef.current.length < 2) {
      alert('Rota oluşturmak için en az 2 nokta eklemelisiniz!');
      return;
    }

    if (!window.google?.maps) {
      console.error('Google Maps not available');
      return;
    }

    try {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }

      const directionsService = new window.google.maps.DirectionsService();
      const renderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 6,
        },
      });

      setDirectionsRenderer(renderer);

      const markers = markersRef.current;
      const origin = markers[0].getPosition();
      const destination = markers[markers.length - 1].getPosition();
      const waypoints = markers.slice(1, -1).map(marker => ({
        location: marker.getPosition(),
        stopover: true,
      }));

      console.log('Creating route with', markers.length, 'markers...');

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (response, status) => {
          if (status === 'OK') {
            renderer.setDirections(response);
            
            const route = response.routes[0];
            let totalDistance = 0;
            let totalDuration = 0;

            route.legs.forEach(leg => {
              totalDistance += leg.distance.value;
              totalDuration += leg.duration.value;
            });

            setRouteInfo({
              distance: (totalDistance / 1000).toFixed(1),
              duration: Math.round(totalDuration / 60),
            });

            console.log('Route created:', {
              distance: (totalDistance / 1000).toFixed(1) + ' km',
              duration: Math.round(totalDuration / 60) + ' dakika'
            });
          } else {
            console.error('Directions request failed:', status);
            let errorMsg = 'Rota oluşturulamadı!';
            
            if (status === 'ZERO_RESULTS') {
              errorMsg = 'Bu noktalar arasında rota bulunamadı.';
            } else if (status === 'OVER_QUERY_LIMIT') {
              errorMsg = 'API limiti aşıldı.';
            } else if (status === 'REQUEST_DENIED') {
              errorMsg = 'API isteği reddedildi. API ayarlarını kontrol edin.';
            }
            
            alert(errorMsg);
          }
        }
      );
    } catch (error) {
      console.error('Error creating route:', error);
      alert('Rota oluşturulamadı: ' + error.message);
    }
  };

  const saveRoute = async () => {
    if (!routeInfo) {
      alert('Önce rota oluşturmalısınız!');
      return;
    }

    if (!routeName.trim()) {
      alert('Lütfen rota için bir isim girin!');
      return;
    }

    setIsSaving(true);

    try {
      const waypoints = markersRef.current.map(marker => {
        const pos = marker.getPosition();
        return {
          lat: pos.lat(),
          lng: pos.lng()
        };
      });

      const routeData = {
        name: routeName.trim(),
        description: routeDescription.trim() || null,
        waypoints: waypoints,
        distance: parseFloat(routeInfo.distance),
        duration: parseInt(routeInfo.duration)
      };

      console.log('Saving route:', routeData);
      console.log('Waypoints count:', waypoints.length);

      // Token'ı al - farklı key'leri dene
      let token = localStorage.getItem('auth_token'); // En yaygın
      if (!token) token = localStorage.getItem('token');
      if (!token) token = localStorage.getItem('authToken');
      if (!token) token = localStorage.getItem('jwtToken');
      if (!token) token = localStorage.getItem('accessToken');
      
      console.log('Token found:', token ? 'Yes' : 'No');
      console.log('Token length:', token ? token.length : 0);
      
      if (!token) {
        alert('Oturum bilgisi bulunamadı! Lütfen tekrar giriş yapın.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routeData)
      });

      console.log('Response status:', response.status);
      
      // Response'u text olarak al (JSON parse hatası olmasın diye)
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        try {
          const result = JSON.parse(responseText);
          console.log('Route saved successfully:', result);
          alert('Rota başarıyla kaydedildi! ✅');
          
          setShowSaveModal(false);
          setRouteName('');
          setRouteDescription('');
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.log('Raw response:', responseText);
          alert('Rota kaydedildi ama response hatası! Kontrol edin.');
        }
      } else {
        // Hata mesajını göster
        console.error('Save failed. Status:', response.status);
        console.error('Response:', responseText);
        
        let errorMessage = 'Rota kaydedilemedi!';
        
        if (response.status === 401) {
          errorMessage = 'Oturum süresi dolmuş! Lütfen tekrar giriş yapın.';
          setTimeout(() => navigate('/login'), 2000);
        } else {
          try {
            const error = JSON.parse(responseText);
            errorMessage = error.message || error.error || errorMessage;
          } catch {
            errorMessage = `Sunucu hatası (${response.status}): ${responseText}`;
          }
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Rota kaydedilirken hata oluştu: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const clearRoute = () => {
    try {
      console.log(`Clearing ${markersRef.current.length} markers...`);
      
      // Tüm marker'ları haritadan kaldır
      markersRef.current.forEach((marker, index) => {
        if (marker && marker.setMap) {
          console.log(`Removing marker ${index + 1}`);
          marker.setMap(null);
        }
      });
      
      // Array'i temizle
      markersRef.current = [];
      setMarkerCount(0);
      console.log('All markers removed from map');

      // Rota çizgisini kaldır
      if (directionsRenderer) {
        console.log('Removing directions renderer');
        directionsRenderer.setMap(null);
        setDirectionsRenderer(null);
      }

      setRouteInfo(null);
      console.log('Route cleared successfully');
    } catch (error) {
      console.error('Error clearing route:', error);
    }
  };

  const removeLastPoint = () => {
    if (markersRef.current.length === 0) {
      console.log('No markers to remove');
      return;
    }

    try {
      console.log(`Removing last marker. Current count: ${markersRef.current.length}`);
      
      // Son marker'ı al ve haritadan kaldır
      const lastMarker = markersRef.current[markersRef.current.length - 1];
      if (lastMarker && lastMarker.setMap) {
        console.log('Removing marker from map');
        lastMarker.setMap(null);
      }

      // Array'den son marker'ı çıkar
      markersRef.current.pop();
      setMarkerCount(markersRef.current.length);
      console.log(`Markers remaining: ${markersRef.current.length}`);
      
      // Rota varsa temizle
      if (directionsRenderer) {
        console.log('Clearing route (need to recreate)');
        directionsRenderer.setMap(null);
        setDirectionsRenderer(null);
      }
      setRouteInfo(null);
      
    } catch (error) {
      console.error('Error removing last point:', error);
    }
  };

  const handleNavigation = (path) => {
    setShowUserMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
    navigate('/');
  };

  return (
    <div className={`maps-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="maps-header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>

        <div className="header-right">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user && (
            <div className="user-menu-container">
              <button className="user-profile-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-item user-info">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => handleNavigation('/profile')}>
                    👤 Profile
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigation('/activity-groups')}>
                    👥 Activity Groups
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigation('/messages')}>
                    💬 Messages
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigation('/friends')}>
                    🤝 Friends
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigation('/mytrips')}>
                    🗺️ My Trips
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="map-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Harita yükleniyor...</p>
          </div>
        )}
        
        <div ref={mapRef} className="google-map"></div>

        {!isLoading && markerCount === 0 && (
          <div className="info-panel instructions">
            <h3>🗺️ Rota Nasıl Oluşturulur?</h3>
            <ol>
              <li>Haritaya tıklayarak noktalar ekle (min 2)</li>
              <li>"Rota Oluştur" butonuna tıkla</li>
              <li>Mesafe ve süreyi gör</li>
              <li>"Rota Kaydet" ile kaydet</li>
            </ol>
          </div>
        )}

        {routeInfo && (
          <div className="info-panel route-info">
            <h3>🚗 Rota Bilgileri</h3>
            <div className="info-row">
              <span className="info-label">📏 Mesafe:</span>
              <span className="info-value">{routeInfo.distance} km</span>
            </div>
            <div className="info-row">
              <span className="info-label">⏱️ Süre:</span>
              <span className="info-value">{routeInfo.duration} dakika</span>
            </div>
            <div className="info-row">
              <span className="info-label">📍 Nokta Sayısı:</span>
              <span className="info-value">{markerCount}</span>
            </div>
          </div>
        )}

        <div className="map-controls">
          {/* Rota Oluştur - 2+ marker ve rota yok */}
          {markerCount >= 2 && !routeInfo && (
            <button className="control-btn create-route-btn" onClick={createRoute}>
              🗺️ Rota Oluştur ({markerCount} nokta)
            </button>
          )}
          
          {/* Rota Kaydet - rota oluşturuldu */}
          {routeInfo && (
            <button className="control-btn save-route-btn" onClick={() => setShowSaveModal(true)}>
              💾 Rota Kaydet
            </button>
          )}
          
          {/* Geri Al ve Temizle - marker varsa */}
          {markerCount > 0 && (
            <>
              <button className="control-btn undo-btn" onClick={removeLastPoint}>
                ↶ Geri Al
              </button>
              <button className="control-btn clear-btn" onClick={clearRoute}>
                🗑️ Temizle
              </button>
            </>
          )}
        </div>

        {/* Debug Info - Geliştirme için */}
        {!isLoading && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 100
          }}>
            Marker Sayısı: {markerCount} | Rota: {routeInfo ? 'Var' : 'Yok'}
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Rotayı Kaydet</h2>
            
            <div className="modal-form">
              <div className="form-group">
                <label>Rota Adı *</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="Örn: Ankara - İstanbul"
                  maxLength="200"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  value={routeDescription}
                  onChange={(e) => setRouteDescription(e.target.value)}
                  placeholder="Rota hakkında notlar..."
                  rows="3"
                  maxLength="1000"
                  disabled={isSaving}
                />
              </div>

              <div className="route-summary">
                <p><strong>📏 Mesafe:</strong> {routeInfo.distance} km</p>
                <p><strong>⏱️ Süre:</strong> {routeInfo.duration} dakika</p>
                <p><strong>📍 Nokta:</strong> {markerCount}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowSaveModal(false)}
                disabled={isSaving}
              >
                İptal
              </button>
              <button 
                className="btn-save" 
                onClick={saveRoute}
                disabled={isSaving || !routeName.trim()}
              >
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Maps;
