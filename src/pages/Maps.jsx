import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/Maps.css';

const GOOGLE_API_KEY = "";
const API_BASE_URL = 'https://shareway.com.tr/api';

function Maps({ user, darkMode, toggleDarkMode, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const markersRef = useRef([]); // useRef ile marker tutma
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
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherCity, setWeatherCity] = useState('');

  useEffect(() => {
    loadGoogleMaps();
    
    return () => {
      // Cleanup 
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) marker.setMap(null);
      });
      markersRef.current = [];
      
      if (directionsRenderer && directionsRenderer.setMap) {
        directionsRenderer.setMap(null);
      }
    };
  }, []);

  // MyTrips'ten gelen rota verisini işle
  useEffect(() => {
    if (map && location.state?.routeData) {
      loadSavedRoute(location.state.routeData);
    }
  }, [map, location.state]);

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
      alert('Map can not created: ' + error.message);
    }
  };

  const addMarker = (location, mapInstance) => {
    if (!window.google?.maps) {
      console.error('Google Maps not available');
      return;
    }

    if (markersRef.current.length >= 10) {
      alert('You can add up to 10 points only!');
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
      alert('You need to add at least 2 points to create a route!');
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
              duration: Math.round(totalDuration / 60) + ' minutes'
            });
          } else {
            console.error('Directions request failed:', status);
            let errorMsg = 'Route could not be created!';
            
            if (status === 'ZERO_RESULTS') {
              errorMsg = 'No route could be found between these points.';
            } else if (status === 'OVER_QUERY_LIMIT') {
              errorMsg = 'API limit exceeded.';
            } else if (status === 'REQUEST_DENIED') {
              errorMsg = 'API request denied. Please check your API settings.';
            }
            
            alert(errorMsg);
          }
        }
      );
    } catch (error) {
      console.error('Error creating route:', error);
      alert('Route could not be created: ' + error.message);
    }
  };

const saveRoute = async () => {
  if (!routeInfo) {
    alert('You need to create a route first!');
    return;
  }

  if (!routeName.trim()) {
    alert('Please enter a name for the route!');
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

    // Backend'in beklediği format
    const routeData = {
      name: routeName.trim(),
      description: routeDescription.trim() || null,
      routeData: JSON.stringify({
        waypoints: waypoints,
        distance: parseFloat(routeInfo.distance),
        duration: parseInt(routeInfo.duration)
      }),
      startLocation: waypoints.length > 0 
        ? `${waypoints[0].lat.toFixed(4)}, ${waypoints[0].lng.toFixed(4)}`
        : 'Unknown',
      endLocation: waypoints.length > 1 
        ? `${waypoints[waypoints.length - 1].lat.toFixed(4)}, ${waypoints[waypoints.length - 1].lng.toFixed(4)}`
        : 'Unknown',
      distanceKm: parseFloat(routeInfo.distance),
      durationMinutes: parseInt(routeInfo.duration),
      isPublic: false
    };

    console.log('Saving route with correct format:', routeData);

    // Token al
    let token = localStorage.getItem('auth_token');
    if (!token) token = localStorage.getItem('authToken');
    if (!token) token = localStorage.getItem('jwtToken');
    
    console.log('Token found:', token ? 'Yes' : 'No');
    
    if (!token) {
      alert('Session not found! Please log in again.');
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
    
    const responseText = await response.text();
    console.log('Response:', responseText);

    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log('Route saved successfully:', result);
      alert('Route saved successfully! ✅\n\nYou can view it in My Trips page.');
      
      setShowSaveModal(false);
      setRouteName('');
      setRouteDescription('');
      
      // Optional: Navigate to My Trips
      // navigate('/mytrips');
    } else {
      console.error('Save failed. Status:', response.status);
      
      let errorMessage = 'Route could not be saved!';
      
      if (response.status === 401) {
        errorMessage = 'Session expired! Please log in again.';
        setTimeout(() => navigate('/login'), 2000);
      } else {
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${responseText}`;
        }
      }
      
      alert(errorMessage);
    }
  } catch (error) {
    console.error('Error saving route:', error);
    alert('An error occurred while saving the route!');
  } finally {
    setIsSaving(false);
  }
};

  const loadSavedRoute = (routeData) => {
    try {
      console.log('Loading saved route:', routeData);
      
      // Önce mevcut rotayı temizle
      clearRoute();
      
      // Route data'yı parse et
      let parsedRouteData;
      if (typeof routeData.routeData === 'string') {
        parsedRouteData = JSON.parse(routeData.routeData);
      } else {
        parsedRouteData = routeData.routeData;
      }
      
      const { waypoints, distance, duration } = parsedRouteData;
      
      if (!waypoints || waypoints.length < 2) {
        console.error('Invalid waypoints data');
        alert('Route data is invalid!');
        return;
      }
      
      console.log('Waypoints:', waypoints);
      
      // Marker'ları haritaya ekle
      waypoints.forEach((waypoint, index) => {
        const location = new window.google.maps.LatLng(waypoint.lat, waypoint.lng);
        const marker = new window.google.maps.Marker({
          position: location,
          map: map,
          label: {
            text: (index + 1).toString(),
            color: 'white',
            fontWeight: 'bold'
          },
          animation: window.google.maps.Animation.DROP,
        });
        
        markersRef.current.push(marker);
      });
      
      setMarkerCount(waypoints.length);
      
      // Haritayı ilk noktaya center et
      map.setCenter(new window.google.maps.LatLng(waypoints[0].lat, waypoints[0].lng));
      map.setZoom(10);
      
      // Rotayı çiz
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
      
      const origin = new window.google.maps.LatLng(waypoints[0].lat, waypoints[0].lng);
      const destination = new window.google.maps.LatLng(
        waypoints[waypoints.length - 1].lat, 
        waypoints[waypoints.length - 1].lng
      );
      const waypointList = waypoints.slice(1, -1).map(wp => ({
        location: new window.google.maps.LatLng(wp.lat, wp.lng),
        stopover: true,
      }));
      
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypointList,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            renderer.setDirections(response);
            
            // Rota bilgilerini set et
            setRouteInfo({
              distance: distance.toFixed(1),
              duration: duration,
            });
            
            console.log('Saved route loaded successfully!');
          } else {
            console.error('Failed to display route:', status);
            
            // Rota çizilemese bile mevcut bilgileri göster
            setRouteInfo({
              distance: distance.toFixed(1),
              duration: duration,
            });
          }
        }
      );
      
    } catch (error) {
      console.error('Error loading saved route:', error);
      alert('Error loading route: ' + error.message);
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
      
      // Son marker'ı haritadan kaldır
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

  const getWeatherForDestination = async () => {
    if (!routeInfo || markersRef.current.length === 0) {
      alert('Please create a route first!');
      return;
    }

    const lastMarker = markersRef.current[markersRef.current.length - 1];
    const position = lastMarker.getPosition();
    
    setShowWeatherModal(true);
    setWeatherLoading(true);
    setWeatherData(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/weather/current?lat=${position.lat()}&lon=${position.lng()}`
      );
      const data = await response.json();
      
      if (data.success) {
        setWeatherData(data.data);
      } else {
        alert('Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Weather API error:', error);
      alert('Error fetching weather data');
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherByCity = async () => {
    if (!weatherCity.trim()) {
      alert('Please enter a city name');
      return;
    }

    setWeatherLoading(true);
    setWeatherData(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/weather/by-city?city=${encodeURIComponent(weatherCity)}`
      );
      const data = await response.json();
      
      if (data.success) {
        setWeatherData(data.data);
      } else {
        alert('City not found or error fetching weather');
      }
    } catch (error) {
      console.error('Weather API error:', error);
      alert('Error fetching weather data');
    } finally {
      setWeatherLoading(false);
    }
  };

  const formatWeatherData = () => {
    if (!weatherData) return null;

    const temp = Math.round(weatherData.main?.temp || 0);
    const feelsLike = Math.round(weatherData.main?.feels_like || 0);
    const description = weatherData.weather?.[0]?.description || 'N/A';
    const icon = weatherData.weather?.[0]?.icon || '01d';
    const humidity = weatherData.main?.humidity || 0;
    const windSpeed = weatherData.wind?.speed || 0;
    const city = weatherData.name || 'Unknown';
    const country = weatherData.sys?.country || '';

    return {
      temp,
      feelsLike,
      description,
      icon,
      humidity,
      windSpeed,
      city,
      country
    };
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
            <p>Map is loading...</p>
          </div>
        )}
        
        <div ref={mapRef} className="google-map"></div>

        {!isLoading && markerCount === 0 && (
          <div className="info-panel instructions">
            <h3>🗺️ How to Create a Route?</h3>
            <ol>
              <li>Click on the map to add points (min 2)</li>
              <li>Click the "Create Route" button</li>
              <li>See distance and duration</li>
              <li>Save with "Save Route"</li>
            </ol>
          </div>
        )}

        {routeInfo && (
          <div className="info-panel route-info">
            <h3>🚗 Route Information</h3>
            <div className="info-row">
              <span className="info-label">📏 Distance:</span>
              <span className="info-value">{routeInfo.distance} km</span>
            </div>
            <div className="info-row">
              <span className="info-label">⏱️ Duration:</span>
              <span className="info-value">{routeInfo.duration} minutes</span>
            </div>
            <div className="info-row">
              <span className="info-label">📍 Number of Points:</span>
              <span className="info-value">{markerCount}</span>
            </div>
          </div>
        )}

        <div className="map-controls">
          {/* Rota Oluştur */}
          {markerCount >= 2 && !routeInfo && (
            <button className="control-btn create-route-btn" onClick={createRoute}>
              🗺️ Create Route ({markerCount} point)
            </button>
          )}
          
          {/* Hava Durumu */}
          {routeInfo && (
            <button className="control-btn weather-btn" onClick={getWeatherForDestination}>
              🌤️ Weather
            </button>
          )}
          
          {/* Rota Kaydet */}
          {routeInfo && (
            <button className="control-btn save-route-btn" onClick={() => setShowSaveModal(true)}>
              💾 Save Route
            </button>
          )}
          
          {/* Geri Al ve Temizle */}
          {markerCount > 0 && (
            <>
              <button className="control-btn undo-btn" onClick={removeLastPoint}>
                ↶ Undo
              </button>
              <button className="control-btn clear-btn" onClick={clearRoute}>
                🗑️ Clear
              </button>
            </>
          )}
        </div>

        {/* Debug Info  */}
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

      {/* Weather Modal */}
      {showWeatherModal && (
        <div className="modal-overlay" onClick={() => setShowWeatherModal(false)}>
          <div className="modal-content weather-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🌤️ Weather Information</h2>
              <button className="close-btn" onClick={() => setShowWeatherModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {/* City Search */}
              <div className="weather-search">
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={weatherCity}
                  onChange={(e) => setWeatherCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && getWeatherByCity()}
                  className="weather-input"
                />
                <button onClick={getWeatherByCity} className="search-btn">
                  🔍 Search
                </button>
              </div>

              {weatherLoading ? (
                <div className="weather-loading">
                  <div className="spinner"></div>
                  <p>Loading weather data...</p>
                </div>
              ) : weatherData && formatWeatherData() ? (
                <div className="weather-display">
                  {(() => {
                    const weather = formatWeatherData();
                    return (
                      <>
                        <div className="weather-location">
                          <h3>{weather.city}{weather.country && `, ${weather.country}`}</h3>
                        </div>
                        
                        <div className="weather-main">
                          <img 
                            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                            alt={weather.description}
                            className="weather-icon"
                          />
                          <div className="weather-temp">
                            <span className="temp-value">{weather.temp}°C</span>
                            <span className="temp-description">{weather.description}</span>
                          </div>
                        </div>

                        <div className="weather-details">
                          <div className="detail-item">
                            <span className="label">Feels Like:</span>
                            <span className="value">{weather.feelsLike}°C</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Humidity:</span>
                            <span className="value">{weather.humidity}%</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Wind Speed:</span>
                            <span className="value">{weather.windSpeed} m/s</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="weather-empty">
                  <p>Click the button above or search for a city to see weather information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Weather Modal */}
      {showWeatherModal && (
        <div className="modal-overlay" onClick={() => setShowWeatherModal(false)}>
          <div className="modal-content weather-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🌤️ Weather Information</h2>
              <button className="close-btn" onClick={() => setShowWeatherModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {/* City Search */}
              <div className="weather-search">
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={weatherCity}
                  onChange={(e) => setWeatherCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && getWeatherByCity()}
                  className="weather-input"
                />
                <button onClick={getWeatherByCity} className="search-btn">
                  🔍 Search
                </button>
              </div>

              {weatherLoading ? (
                <div className="weather-loading">
                  <div className="spinner"></div>
                  <p>Loading weather data...</p>
                </div>
              ) : weatherData && formatWeatherData() ? (
                <div className="weather-display">
                  {(() => {
                    const weather = formatWeatherData();
                    return (
                      <>
                        <div className="weather-location">
                          <h3>{weather.city}{weather.country && `, ${weather.country}`}</h3>
                        </div>
                        
                        <div className="weather-main">
                          <img 
                            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                            alt={weather.description}
                            className="weather-icon"
                          />
                          <div className="weather-temp">
                            <span className="temp-value">{weather.temp}°C</span>
                            <span className="temp-description">{weather.description}</span>
                          </div>
                        </div>

                        <div className="weather-details">
                          <div className="detail-item">
                            <span className="label">Feels Like:</span>
                            <span className="value">{weather.feelsLike}°C</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Humidity:</span>
                            <span className="value">{weather.humidity}%</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Wind Speed:</span>
                            <span className="value">{weather.windSpeed} m/s</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="weather-empty">
                  <p>Click the button above or search for a city to see weather information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Save Route</h2>
            
            <div className="modal-form">
              <div className="form-group">
                <label>Route Name *</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="E.g.: Ankara - Istanbul"
                  maxLength="200"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={routeDescription}
                  onChange={(e) => setRouteDescription(e.target.value)}
                  placeholder="Notes about the route..."
                  rows="3"
                  maxLength="1000"
                  disabled={isSaving}
                />
              </div>

              <div className="route-summary">
                <p><strong>📏 Distance:</strong> {routeInfo.distance} km</p>
                <p><strong>⏱️ Duration:</strong> {routeInfo.duration} minutes</p>
                <p><strong>📍 Points:</strong> {markerCount}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowSaveModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="btn-save" 
                onClick={saveRoute}
                disabled={isSaving || !routeName.trim()}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Maps;
