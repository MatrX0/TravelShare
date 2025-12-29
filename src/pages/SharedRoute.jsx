import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './styles/SharedRoute.css';

function SharedRoute() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedRoute();
  }, [shareToken]);

  const fetchSharedRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/routes/shared/${shareToken}`);
      if (response.success) {
        setRoute(response.data);
      } else {
        setError('Route not found or link is invalid');
      }
    } catch (error) {
      console.error('Error fetching shared route:', error);
      setError('Failed to load shared route. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOnMap = () => {
    if (route) {
      navigate('/maps', { state: { routeData: route } });
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="shared-route-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading shared route...</p>
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="shared-route-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Route Not Found</h2>
          <p>{error || 'This shared route link is invalid or has been removed.'}</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-route-page">
      <header className="shared-header">
        <div className="header-content">
          <button onClick={() => navigate('/')} className="logo-button">
            ✈️ <span>TravelShare</span>
          </button>
          <div className="shared-badge">📤 Shared Route</div>
        </div>
      </header>

      <div className="shared-container">
        <div className="route-card-large">
          <div className="route-header">
            <h1>{route.name}</h1>
            {route.description && (
              <p className="route-description">{route.description}</p>
            )}
          </div>

          <div className="shared-by">
            <span className="label">Shared by:</span>
            <span className="value">{route.userName}</span>
          </div>

          <div className="route-details">
            <div className="detail-section">
              <h3>🚀 Journey Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">From:</span>
                  <span className="value">{route.startLocation}</span>
                </div>
                <div className="detail-item">
                  <span className="label">To:</span>
                  <span className="value">{route.endLocation}</span>
                </div>
                {route.distanceKm && (
                  <div className="detail-item">
                    <span className="label">Distance:</span>
                    <span className="value">{route.distanceKm.toFixed(1)} km</span>
                  </div>
                )}
                {route.durationMinutes && (
                  <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span className="value">{formatDuration(route.durationMinutes)}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Created:</span>
                  <span className="value">{formatDate(route.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-view-map" onClick={handleViewOnMap}>
              🗺️ View on Map
            </button>
            <button className="btn-secondary" onClick={() => navigate('/')}>
              🏠 Go to Homepage
            </button>
          </div>

          <div className="info-box">
            <p>
              💡 <strong>Want to create your own routes?</strong> 
              <button className="link-button" onClick={() => navigate('/register')}>
                Sign up for free
              </button> 
              to start planning and sharing your trips!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharedRoute;
