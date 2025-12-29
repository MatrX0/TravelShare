import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './styles/MyTrips.css';

function MyTrips({ user, darkMode, toggleDarkMode, onLogout }) {
  const navigate = useNavigate();
  const [myRoutes, setMyRoutes] = useState([]);
  const [sharedRoutes, setSharedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'shared'
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      // Fetch my routes
      const myResponse = await api.get('/routes/my-routes');
      if (myResponse.success) {
        setMyRoutes(myResponse.data);
      }

      // Fetch shared routes
      const sharedResponse = await api.get('/routes/shared-with-me');
      if (sharedResponse.success) {
        setSharedRoutes(sharedResponse.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoute = (route) => {
    // Navigate to Maps with route data
    navigate('/maps', { state: { routeData: route } });
  };

  const handleDeleteRoute = async (routeId) => {
    if (!confirm('Are you sure you want to delete this route?')) return;

    try {
      const response = await api.delete(`/routes/${routeId}`);
      if (response.success) {
        alert('Route deleted successfully!');
        fetchRoutes();
      }
    } catch (error) {
      console.error('Error deleting route:', error);
      alert('Failed to delete route');
    }
  };

  const handleShareRoute = async (route) => {
    setSelectedRoute(route);
    setShowShareModal(true);
    setCopySuccess(false);
    
    // If route already has a share token, use it
    if (route.shareToken) {
      const link = `${window.location.origin}/shared-route/${route.shareToken}`;
      setShareLink(link);
    } else {
      // Generate new share link
      await generateShareLink(route.id);
    }
  };

  const generateShareLink = async (routeId) => {
    setGeneratingLink(true);
    try {
      const response = await api.post(`/routes/${routeId}/generate-share-link`);
      if (response.success) {
        const token = response.data.shareToken;
        const link = `${window.location.origin}/shared-route/${token}`;
        setShareLink(link);
        
        // Update the route in the list with the new token
        setMyRoutes(prevRoutes => 
          prevRoutes.map(r => 
            r.id === routeId ? { ...r, shareToken: token } : r
          )
        );
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link');
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy link');
    }
  };

  const revokeShareLink = async (routeId) => {
    if (!confirm('Are you sure you want to revoke this share link? The current link will stop working.')) return;

    try {
      const response = await api.delete(`/routes/${routeId}/share-link`);
      if (response.success) {
        alert('Share link revoked successfully!');
        setShowShareModal(false);
        setShareLink('');
        
        // Update the route in the list
        setMyRoutes(prevRoutes => 
          prevRoutes.map(r => 
            r.id === routeId ? { ...r, shareToken: null } : r
          )
        );
      }
    } catch (error) {
      console.error('Error revoking share link:', error);
      alert('Failed to revoke share link');
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
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const routes = activeTab === 'my' ? myRoutes : sharedRoutes;

  return (
    <div className={`mytrips-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className="mytrips-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="logo-button">
            ✈️ <span>TravelShare</span>
          </button>
        </div>
        <div className="header-right">
          <button onClick={toggleDarkMode} className="icon-button">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="user-menu">
            <button className="user-button" onClick={() => navigate('/Profile')}>
              👤 {user?.name}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mytrips-container">
        <div className="mytrips-hero">
          <h1>🗺️ My Trips</h1>
          <p>View and manage your saved routes</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Routes ({myRoutes.length})
          </button>
          <button 
            className={`tab ${activeTab === 'shared' ? 'active' : ''}`}
            onClick={() => setActiveTab('shared')}
          >
            Shared with Me ({sharedRoutes.length})
          </button>
        </div>

        {/* Routes List */}
        {loading ? (
          <div className="loading">Loading routes...</div>
        ) : routes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h3>No routes yet</h3>
            <p>
              {activeTab === 'my' 
                ? 'Start planning your trips by creating routes in the Maps page!' 
                : 'No routes have been shared with you yet.'}
            </p>
            {activeTab === 'my' && (
              <button 
                className="btn-primary" 
                onClick={() => navigate('/maps')}
              >
                Go to Maps
              </button>
            )}
          </div>
        ) : (
          <div className="routes-grid">
            {routes.map(route => (
              <div key={route.id} className="route-card">
                <div className="route-header">
                  <h3>{route.name}</h3>
                  {activeTab === 'shared' ? (
                    <span className="shared-badge">Shared by {route.userName}</span>
                  ) : route.shareToken && (
                    <span className="link-shared-badge">🔗 Link Shared</span>
                  )}
                </div>
                
                {route.description && (
                  <p className="route-description">{route.description}</p>
                )}

                <div className="route-info">
                  <div className="info-item">
                    <span className="label">From:</span>
                    <span className="value">{route.startLocation}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">To:</span>
                    <span className="value">{route.endLocation}</span>
                  </div>
                  {route.distanceKm && (
                    <div className="info-item">
                      <span className="label">Distance:</span>
                      <span className="value">{route.distanceKm.toFixed(1)} km</span>
                    </div>
                  )}
                  {route.durationMinutes && (
                    <div className="info-item">
                      <span className="label">Duration:</span>
                      <span className="value">{formatDuration(route.durationMinutes)}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="label">Created:</span>
                    <span className="value">{formatDate(route.createdAt)}</span>
                  </div>
                </div>

                <div className="route-actions">
                  <button 
                    className="btn-view" 
                    onClick={() => handleViewRoute(route)}
                  >
                    🗺️ View on Map
                  </button>
                  {activeTab === 'my' && (
                    <>
                      <button 
                        className="btn-share" 
                        onClick={() => handleShareRoute(route)}
                      >
                        📤 Share
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteRoute(route.id)}
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && selectedRoute && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Share Route</h2>
              <button className="close-button" onClick={() => setShowShareModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="route-preview">
                <h3>{selectedRoute.name}</h3>
                <p>{selectedRoute.startLocation} → {selectedRoute.endLocation}</p>
              </div>

              <div className="share-section">
                <p className="share-description">
                  Anyone with this link can view this route, even without an account.
                </p>
                
                {generatingLink ? (
                  <div className="generating">Generating link...</div>
                ) : shareLink ? (
                  <>
                    <div className="share-link-container">
                      <input 
                        type="text" 
                        value={shareLink} 
                        readOnly 
                        className="share-link-input"
                      />
                      <button 
                        className={`btn-copy ${copySuccess ? 'success' : ''}`}
                        onClick={copyShareLink}
                      >
                        {copySuccess ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    
                    <div className="share-actions">
                      <button 
                        className="btn-revoke"
                        onClick={() => revokeShareLink(selectedRoute.id)}
                      >
                        🔒 Revoke Link
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="error-message">Failed to generate share link</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTrips;
