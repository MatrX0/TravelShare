import { useState, useEffect } from 'react';
import './styles/Friends.css';
import { useNavigate } from 'react-router-dom';

function Friends({ user, onNavigate, darkMode }) {
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
      // TODO: Backend API
      setFriends([
        { id: 1, username: '', email: '' },
        { id: 2, username: '', email: '' },
      ]);
      setPendingRequests([
        { id: 3, username: '', email: '', friendshipId: 101 },
      ]);
      setSentRequests([
        { id: 4, username: '', email: '', friendshipId: 102 },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchResults([
      { id: 5, username: 'Alex Johnson', email: 'alex@example.com' },
    ]);
  };

  if (loading) {
    return <div className="friends-loading">Loading...</div>;
  }

  return (
    <div className={`friends-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Page Background */}
      <div className="page-background"></div>

      {/* TravelShare Logo Header */}
      <div className="page-header">
        <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>
      </div>

      {/* Header with Search */}
      <div className="friends-header">
        <h1>Friends</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by username or email..."
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result) => (
              <div key={result.id} className="search-result-item">
                <div className="result-info">
                  <div className="result-avatar">
                    {result.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="result-name">{result.username}</p>
                    <p className="result-email">{result.email}</p>
                  </div>
                </div>
                <button className="add-friend-btn">Add Friend</button>
              </div>
            ))}
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
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          >
            Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'friends' && (
            <div className="friends-grid">
              {friends.length === 0 ? (
                <div className="empty-tab">No friends yet</div>
              ) : (
                friends.map((friend) => (
                  <div key={friend.id} className="friend-item">
                    <div className="friend-avatar">
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="friend-details">
                      <p className="friend-username">{friend.username}</p>
                      <p className="friend-email">{friend.email}</p>
                    </div>
                    <div className="friend-actions">
                      <button className="message-btn">Message</button>
                      <button className="remove-btn">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="requests-list">
              {pendingRequests.length === 0 ? (
                <div className="empty-tab">No pending requests</div>
              ) : (
                pendingRequests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div className="request-avatar">
                      {request.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="request-info">
                      <p className="request-name">{request.username}</p>
                      <p className="request-email">{request.email}</p>
                    </div>
                    <div className="request-actions">
                      <button className="accept-btn">Accept</button>
                      <button className="reject-btn">Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="requests-list">
              {sentRequests.length === 0 ? (
                <div className="empty-tab">No sent requests</div>
              ) : (
                sentRequests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div className="request-avatar">
                      {request.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="request-info">
                      <p className="request-name">{request.username}</p>
                      <p className="request-status">Request pending...</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends;
