import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Maps.css';
import api from '../services/api';

const GOOGLE_API_KEY = "AIzaSyC_qsE40gVc0PeVGXt02SAE8m5Q6temmIk";

function Maps({ user, onLogout, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Route creation state
  const [markers, setMarkers] = useState([]);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null); // distance, duration
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  
  // Saved routes state
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRoutesPanel, setShowRoutesPanel] = useState(true);
  
  // Search
  const [searchBox, setSearchBox] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Load Google Maps
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    // Fetch saved routes
    fetchSavedRoutes();
  }, []);

  const initMap = () => {
    const initialCenter = { lat: 39.9334, lng: 32.8597 }; // Ankara
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: darkMode ? getDarkMapStyles() : [],
    });

    // Add click listener to add waypoints
    mapInstance.addListener('click', (e) => {
      addWaypoint(e.latLng);
    });

    setMap(mapInstance);

    // Initialize search box
    if (searchInputRef.current) {
      const searchBoxInstance = new window.google.maps.places.SearchBox(searchInputRef.current);
      setSearchBox(searchBoxInstance);

      mapInstance.addListener('bounds_changed', () => {
        searchBoxInstance.setBounds(mapInstance.getBounds());
      });

      searchBoxInstance.addListener('places_changed', () => {
        const places = searchBoxInstance.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (place.geometry?.location) {
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(14);
        }
      });
    }
  };

  const fetchSavedRoutes = async () => {
    try {
      const response = await api.get('/routes');
      if (response.success && response.data) {
        setSavedRoutes(response.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const addWaypoint = (location) => {
    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
      label: (markers.length + 1).toString(),
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Add drag listener
    marker.addListener('dragend', () => {
      const newMarkers = markers.map(m => m === marker ? marker : m);
      setMarkers(newMarkers);
      calculateAndDisplayRoute(newMarkers);
    });

    const newMarkers = [...markers, marker];
    setMarkers(newMarkers);

    if (newMarkers.length >= 2) {
      calculateAndDisplayRoute(newMarkers);
    }
  };

  const calculateAndDisplayRoute = (markersList) => {
    if (markersList.length < 2) return;

    // Clear previous route
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }

    const directionsService = new window.google.maps.DirectionsService();
    const renderer = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true, // We're using custom markers
      polylineOptions: {
        strokeColor: '#667eea',
        strokeWeight: 5,
      },
    });

    setDirectionsRenderer(renderer);

    const origin = markersList[0].getPosition();
    const destination = markersList[markersList.length - 1].getPosition();
    const waypoints = markersList.slice(1, -1).map(marker => ({
      location: marker.getPosition(),
      stopover: true,
    }));

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
          
          // Calculate total distance and duration
          const route = response.routes[0];
          let totalDistance = 0;
          let totalDuration = 0;

          route.legs.forEach(leg => {
            totalDistance += leg.distance.value; // meters
            totalDuration += leg.duration.value; // seconds
          });

          setRouteInfo({
            distance: (totalDistance / 1000).toFixed(2), // km
            duration: Math.round(totalDuration / 60), // minutes
          });
        } else {
          alert('Could not calculate route: ' + status);
        }
      }
    );
  };

  const clearRoute = () => {
    // Clear markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // Clear route
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }

    setRouteInfo(null);
    setRouteName('');
    setRouteDescription('');
    setSelectedRoute(null);
  };

  const openSaveModal = () => {
    if (markers.length < 2) {
      alert('Please add at least 2 waypoints to create a route');
      return;
    }
    setShowSaveModal(true);
  };

  const saveRoute = async () => {
    if (!routeName.trim()) {
      alert('Please enter a route name');
      return;
    }

    try {
      // Prepare waypoints data
      const waypoints = markers.map(marker => {
        const pos = marker.getPosition();
        return {
          lat: pos.lat(),
          lng: pos.lng(),
        };
      });

      const routeData = {
        name: routeName.trim(),
        description: routeDescription.trim(),
        waypoints: waypoints,
        distance: routeInfo?.distance || 0,
        duration: routeInfo?.duration || 0,
      };

      const response = await api.post('/routes', routeData);

      if (response.success) {
        alert('Route saved successfully! ✅');
        setShowSaveModal(false);
        setRouteName('');
        setRouteDescription('');
        
        // Refresh saved routes
        await fetchSavedRoutes();
      }
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Failed to save route. Please try again.');
    }
  };

  const loadRoute = (route) => {
    // Clear current route
    clearRoute();

    // Load waypoints
    const newMarkers = route.waypoints.map((waypoint, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: waypoint.lat, lng: waypoint.lng },
        map: map,
        label: (index + 1).toString(),
        draggable: false,
        animation: window.google.maps.Animation.DROP,
      });
      return marker;
    });

    setMarkers(newMarkers);
    setSelectedRoute(route);

    // Calculate and display route
    if (newMarkers.length >= 2) {
      calculateAndDisplayRoute(newMarkers);

      // Center map on route
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
    }
  };

  const deleteRoute = async (routeId) => {
    if (!confirm('Are you sure you want to delete this route?')) return;

    try {
      const response = await api.delete(`/routes/${routeId}`);
      
      if (response.success) {
        alert('Route deleted successfully');
        
        // Clear if deleted route is currently loaded
        if (selectedRoute?.id === routeId) {
          clearRoute();
        }
        
        // Refresh saved routes
        await fetchSavedRoutes();
      }
    } catch (error) {
      console.error('Error deleting route:', error);
      alert('Failed to delete route');
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

  const getDarkMapStyles = () => [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }]
    },
  ];

  return (
    <div className={`maps-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <div className="maps-header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>

        {/* Search Box */}
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search location..."
            className="location-search"
          />
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

      {/* Main Content */}
      <div className="maps-content">
        {/* Sidebar - Saved Routes */}
        {showRoutesPanel && (
          <div className="routes-sidebar">
            <div className="sidebar-header">
              <h2>📍 My Routes</h2>
              <button 
                className="close-sidebar-btn"
                onClick={() => setShowRoutesPanel(false)}
              >
                ✕
              </button>
            </div>

            <div className="routes-list">
              {savedRoutes.length === 0 ? (
                <div className="empty-routes">
                  <div className="empty-icon">🗺️</div>
                  <p>No saved routes yet</p>
                  <small>Create a route by clicking on the map</small>
                </div>
              ) : (
                savedRoutes.map(route => (
                  <div 
                    key={route.id} 
                    className={`route-card ${selectedRoute?.id === route.id ? 'active' : ''}`}
                  >
                    <div className="route-card-header" onClick={() => loadRoute(route)}>
                      <h3>{route.name}</h3>
                      <button 
                        className="delete-route-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRoute(route.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="route-description">{route.description}</p>
                    <div className="route-stats">
                      <span>📏 {route.distance} km</span>
                      <span>⏱️ {route.duration} min</span>
                      <span>📍 {route.waypoints.length} points</span>
                    </div>
                    <small className="route-date">
                      {new Date(route.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="map-container">
          <div ref={mapRef} className="map"></div>

          {/* Toggle Sidebar Button */}
          {!showRoutesPanel && (
            <button 
              className="show-sidebar-btn"
              onClick={() => setShowRoutesPanel(true)}
            >
              📍 Show Routes
            </button>
          )}

          {/* Route Info Panel */}
          {routeInfo && (
            <div className="route-info-panel">
              <h3>📊 Route Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Distance:</span>
                  <span className="info-value">{routeInfo.distance} km</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{routeInfo.duration} min</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Waypoints:</span>
                  <span className="info-value">{markers.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="map-controls">
            <button className="control-btn clear-btn" onClick={clearRoute}>
              🗑️ Clear
            </button>
            <button 
              className="control-btn save-btn" 
              onClick={openSaveModal}
              disabled={markers.length < 2}
            >
              💾 Save Route
            </button>
          </div>

          {/* Instructions */}
          {markers.length === 0 && (
            <div className="instructions-panel">
              <h3>🗺️ How to Create a Route</h3>
              <ol>
                <li>Click on the map to add waypoints</li>
                <li>Add at least 2 points to create a route</li>
                <li>Drag markers to adjust positions</li>
                <li>Click "Save Route" when done</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Save Route Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💾 Save Route</h2>
              <button className="modal-close" onClick={() => setShowSaveModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Route Name *</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g., Weekend Road Trip"
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={routeDescription}
                  onChange={(e) => setRouteDescription(e.target.value)}
                  placeholder="Add notes about this route..."
                  className="modal-textarea"
                  rows="3"
                />
              </div>
              <div className="route-summary">
                <h4>Route Summary:</h4>
                <p>📏 Distance: {routeInfo?.distance} km</p>
                <p>⏱️ Duration: {routeInfo?.duration} min</p>
                <p>📍 Waypoints: {markers.length}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowSaveModal(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={saveRoute}>
                Save Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Maps;
