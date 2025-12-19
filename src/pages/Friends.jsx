import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Friends.css';
import api from '../services/api';

function Friends({ user, onLogout, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [friendsRes, pendingRes, sentRes] = await Promise.all([
        api.get('/friends'),
        api.get('/friends/requests'),
        api.get('/friends/requests/sent')
      ]);

      if (friendsRes.success) {
        setFriends(friendsRes.data || []);
      }
      if (pendingRes.success) {
        setPendingRequests(pendingRes.data || []);
      }
      if (sentRes.success) {
        setSentRequests(sentRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get(`/friends/search?query=${encodeURIComponent(searchQuery)}`);
      if (response.success) {
        setSearchResults(response.data || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      const response = await api.post('/friends/request', { friendUserId: userId });
      if (response.success) {
        alert('Friend request sent!');
        // Refresh sent requests
        const sentRes = await api.get('/friends/requests/sent');
        if (sentRes.success) {
          setSentRequests(sentRes.data || []);
        }
        // Remove from search results
        setSearchResults(searchResults.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(error.message || 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await api.post(`/friends/accept/${requestId}`);
      if (response.success) {
        alert('Friend request accepted!');
        // Refresh all data
        await fetchFriendsData();
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await api.post(`/friends/reject/${requestId}`);
      if (response.success) {
        alert('Friend request rejected');
        // Remove from pending requests
        setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject friend request');
    }
  };

  const handleRemoveFriend = async (friendUserId) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;

    try {
      const response = await api.delete(`/friends/${friendUserId}`);
      if (response.success) {
        alert('Friend removed');
        // Remove from friends list
        setFriends(friends.filter(friend => friend.id !== friendUserId));
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend');
    }
  };

  const handleMessage = (friendUserId) => {
    navigate(`/messages?user=${friendUserId}`);
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

  if (loading) {
    return (
      <div className="friends-page dark-mode">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`friends-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Background */}
      <div className="page-background"></div>

      {/* Header */}
      <div className="friends-header-bar">
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

      {/* Main Content */}
      <div className="friends-container">
        {/* Page Title */}
        <div className="friends-title-section">
          <h1 className="page-title">Friends</h1>
          <p className="page-subtitle">Connect with fellow travelers and build your network</p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results</h3>
              <div className="results-grid">
                {searchResults.map((result) => (
                  <div key={result.id} className="result-card">
                    <div className="result-avatar">
                      {result.name ? result.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="result-info">
                      <p className="result-name">{result.name}</p>
                      <p className="result-email">{result.email}</p>
                    </div>
                    <button 
                      className="add-friend-btn"
                      onClick={() => handleSendRequest(result.id)}
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="friends-tabs">
          <div className="tabs-header">
            <button
              onClick={() => setActiveTab('friends')}
              className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            >
              <span className="tab-icon">👥</span>
              <span className="tab-text">Friends</span>
              <span className="tab-count">({friends.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            >
              <span className="tab-icon">📨</span>
              <span className="tab-text">Requests</span>
              <span className="tab-count">({pendingRequests.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            >
              <span className="tab-icon">📤</span>
              <span className="tab-text">Sent</span>
              <span className="tab-count">({sentRequests.length})</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <div className="friends-grid">
                {friends.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>No friends yet</h3>
                    <p>Start by searching for users above</p>
                  </div>
                ) : (
                  friends.map((friend) => (
                    <div key={friend.id} className="friend-card">
                      <div className="friend-avatar">
                        {friend.name ? friend.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="friend-info">
                        <h4 className="friend-name">{friend.name}</h4>
                        <p className="friend-email">{friend.email}</p>
                      </div>
                      <div className="friend-actions">
                        <button 
                          className="message-btn"
                          onClick={() => handleMessage(friend.id)}
                        >
                          💬 Message
                        </button>
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveFriend(friend.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Requests Tab */}
            {activeTab === 'pending' && (
              <div className="requests-grid">
                {pendingRequests.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📨</div>
                    <h3>No pending requests</h3>
                    <p>You'll see friend requests here</p>
                  </div>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="request-card">
                      <div className="request-avatar">
                        {request.name ? request.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="request-info">
                        <h4 className="request-name">{request.name}</h4>
                        <p className="request-email">{request.email}</p>
                      </div>
                      <div className="request-actions">
                        <button 
                          className="accept-btn"
                          onClick={() => handleAcceptRequest(request.requestId)}
                        >
                          ✓ Accept
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleRejectRequest(request.requestId)}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sent Requests Tab */}
            {activeTab === 'sent' && (
              <div className="requests-grid">
                {sentRequests.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📤</div>
                    <h3>No sent requests</h3>
                    <p>Friend requests you send will appear here</p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <div key={request.id} className="request-card">
                      <div className="request-avatar">
                        {request.name ? request.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="request-info">
                        <h4 className="request-name">{request.name}</h4>
                        <p className="request-status">Pending...</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friends;
