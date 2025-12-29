import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Friends.css";
import api from "../services/api.js";

function Friends({ user, darkMode }) {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (activeTab === "friends") {
      fetchFriends();
    } else if (activeTab === "requests") {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await api.get("/friends");
      if (res?.success) {
        setFriends(res.data || []);
      }
    } catch (e) {
      console.error("Error fetching friends:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [pending, sent] = await Promise.all([
        api.get("/friends/requests"),
        api.get("/friends/requests/sent")
      ]);
      
      if (pending?.success) setPendingRequests(pending.data || []);
      if (sent?.success) setSentRequests(sent.data || []);
    } catch (e) {
      console.error("Error fetching requests:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/friends/search?query=${encodeURIComponent(query)}`);
      if (res?.success) {
        setSearchResults(res.data || []);
      }
    } catch (e) {
      console.error("Error searching users:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (friendUserId) => {
    setActionLoading(friendUserId);
    try {
      const res = await api.post("/friends/request", { friendUserId });
      if (res?.success) {
        alert("Friend request sent!");
        handleSearch(searchQuery);
      } else {
        alert(res?.message || "Failed to send request");
      }
    } catch (e) {
      console.error("Error sending request:", e);
      alert(e.response?.data?.message || "Failed to send friend request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await api.post(`/friends/accept/${requestId}`);
      if (res?.success) {
        alert("Friend request accepted!");
        fetchRequests();
        fetchFriends();
      }
    } catch (e) {
      console.error("Error accepting request:", e);
      alert("Failed to accept request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await api.post(`/friends/reject/${requestId}`);
      if (res?.success) {
        fetchRequests();
      }
    } catch (e) {
      console.error("Error rejecting request:", e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFriend = async (friendUserId) => {
    if (!confirm("Are you sure you want to remove this friend?")) return;
    
    setActionLoading(friendUserId);
    try {
      const res = await api.delete(`/friends/${friendUserId}`);
      if (res?.success) {
        fetchFriends();
      }
    } catch (e) {
      console.error("Error removing friend:", e);
    } finally {
      setActionLoading(null);
    }
  };

  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px 40px',
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    color: darkMode ? '#f1f5f9' : '#1e293b',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: darkMode ? '#1e293b' : '#ffffff',
    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    padding: '10px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: darkMode ? '#f1f5f9' : '#1e293b',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="friends-container" style={containerStyle}>
      {/* Header with Back Button */}
      <div className="friends-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button 
          style={backButtonStyle}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => e.target.style.borderColor = '#667eea'}
          onMouseLeave={(e) => e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'}
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>
        
        <div 
          className="logo" 
          onClick={() => navigate("/")} 
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#667eea' 
          }}
        >
          <span>✈️</span>
          <span>ShareWay</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="friends-title-section" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: darkMode ? '#f1f5f9' : '#1e293b' }}>
          🤝 Friends
        </h1>
        <p style={{ margin: '8px 0 0 0', color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '16px' }}>
          Connect with fellow travelers around the world
        </p>
      </div>

      {/* Tabs */}
      <div 
        className="friends-tabs" 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '30px', 
          borderBottom: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
          paddingBottom: '0' 
        }}
      >
        <button
          onClick={() => setActiveTab('friends')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: activeTab === 'friends' ? '#667eea' : (darkMode ? '#94a3b8' : '#64748b'),
            borderBottom: activeTab === 'friends' ? '3px solid #667eea' : '3px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.3s ease'
          }}
        >
          👥 My Friends ({friends.length})
        </button>
        
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: activeTab === 'requests' ? '#667eea' : (darkMode ? '#94a3b8' : '#64748b'),
            borderBottom: activeTab === 'requests' ? '3px solid #667eea' : '3px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.3s ease'
          }}
        >
          📬 Requests ({pendingRequests.length})
        </button>
        
        <button
          onClick={() => setActiveTab('search')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: activeTab === 'search' ? '#667eea' : (darkMode ? '#94a3b8' : '#64748b'),
            borderBottom: activeTab === 'search' ? '3px solid #667eea' : '3px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.3s ease'
          }}
        >
          🔍 Find Friends
        </button>
      </div>

      {/* Friends Tab Content */}
      {activeTab === 'friends' && (
        <div className="friends-list">
          {loading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div 
                className="spinner" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  border: '4px solid rgba(102, 126, 234, 0.2)', 
                  borderTopColor: '#667eea', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite', 
                  margin: '0 auto 16px' 
                }}
              ></div>
              <p>Loading friends...</p>
            </div>
          ) : friends.length === 0 ? (
            <div 
              className="empty-state" 
              style={{ 
                textAlign: 'center', 
                padding: '80px 20px', 
                background: darkMode ? '#1e293b' : '#ffffff', 
                borderRadius: '16px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>👋</div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>No Friends Yet</h3>
              <p style={{ margin: '0 0 24px 0', color: darkMode ? '#cbd5e1' : '#64748b' }}>
                Start connecting with travelers!
              </p>
              <button 
                onClick={() => setActiveTab('search')}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '14px 32px', 
                  borderRadius: '12px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                Find Friends
              </button>
            </div>
          ) : (
            <div 
              className="friends-grid" 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '20px' 
              }}
            >
              {friends.map((friend) => (
                <div 
                  key={friend.userId} 
                  className="friend-card" 
                  style={{ 
                    background: darkMode ? '#1e293b' : '#ffffff', 
                    padding: '24px', 
                    borderRadius: '16px', 
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div 
                      className="friend-avatar" 
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: friend.avatarUrl 
                          ? `url(${friend.avatarUrl}) center/cover` 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        color: 'white', 
                        flexShrink: 0 
                      }}
                    >
                      {!friend.avatarUrl && friend.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 
                        style={{ 
                          margin: '0 0 4px 0', 
                          fontSize: '18px', 
                          fontWeight: '700', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {friend.name}
                      </h3>
                      <p 
                        style={{ 
                          margin: 0, 
                          fontSize: '14px', 
                          color: darkMode ? '#94a3b8' : '#64748b', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {friend.email}
                      </p>
                    </div>
                  </div>
                  
                  {friend.friendsSince && (
                    <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                      ✨ Friends since {new Date(friend.friendsSince).toLocaleDateString()}
                    </p>
                  )}
                  
                  <button
                    onClick={() => handleRemoveFriend(friend.userId)}
                    disabled={actionLoading === friend.userId}
                    style={{ 
                      width: '100%', 
                      background: darkMode ? '#334155' : '#fee2e2', 
                      color: '#ef4444', 
                      border: 'none', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s ease' 
                    }}
                  >
                    {actionLoading === friend.userId ? 'Removing...' : '❌ Remove Friend'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requests Tab Content */}
      {activeTab === 'requests' && (
        <div className="requests-section">
          {/* Pending Requests (Received) */}
          <div style={{ marginBottom: '40px' }}>
            <h2 
              style={{ 
                margin: '0 0 20px 0', 
                fontSize: '20px', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px' 
              }}
            >
              📥 Received Requests
            </h2>
            
            {loading ? (
              <div className="loading-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div 
                  className="spinner" 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '4px solid rgba(102, 126, 234, 0.2)', 
                    borderTopColor: '#667eea', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite', 
                    margin: '0 auto' 
                  }}
                ></div>
              </div>
            ) : pendingRequests.length === 0 ? (
              <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '15px' }}>
                No pending requests
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingRequests.map((req) => (
                  <div 
                    key={req.requestId} 
                    className="request-card" 
                    style={{ 
                      background: darkMode ? '#1e293b' : '#ffffff', 
                      padding: '20px', 
                      borderRadius: '12px', 
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px' 
                    }}
                  >
                    <div 
                      className="request-avatar" 
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%', 
                        background: req.avatarUrl 
                          ? `url(${req.avatarUrl}) center/cover` 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        color: 'white', 
                        flexShrink: 0 
                      }}
                    >
                      {!req.avatarUrl && req.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 
                        style={{ 
                          margin: '0 0 4px 0', 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {req.name}
                      </h4>
                      <p 
                        style={{ 
                          margin: 0, 
                          fontSize: '13px', 
                          color: darkMode ? '#94a3b8' : '#64748b', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {req.email}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleAcceptRequest(req.requestId)}
                        disabled={actionLoading === req.requestId}
                        style={{ 
                          background: '#10b981', 
                          color: 'white', 
                          border: 'none', 
                          padding: '8px 16px', 
                          borderRadius: '8px', 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          cursor: 'pointer', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.requestId)}
                        disabled={actionLoading === req.requestId}
                        style={{ 
                          background: darkMode ? '#334155' : '#e2e8f0', 
                          color: darkMode ? '#f1f5f9' : '#1e293b', 
                          border: 'none', 
                          padding: '8px 16px', 
                          borderRadius: '8px', 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          cursor: 'pointer', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sent Requests */}
          <div>
            <h2 
              style={{ 
                margin: '0 0 20px 0', 
                fontSize: '20px', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px' 
              }}
            >
              📤 Sent Requests
            </h2>
            
            {sentRequests.length === 0 ? (
              <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '15px' }}>
                No sent requests
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sentRequests.map((req) => (
                  <div 
                    key={req.requestId} 
                    className="request-card" 
                    style={{ 
                      background: darkMode ? '#1e293b' : '#ffffff', 
                      padding: '20px', 
                      borderRadius: '12px', 
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px' 
                    }}
                  >
                    <div 
                      className="request-avatar" 
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        color: 'white', 
                        flexShrink: 0 
                      }}
                    >
                      {req.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                        {req.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Pending...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Tab Content */}
      {activeTab === 'search' && (
        <div className="search-section">
          <div style={{ marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
                borderRadius: '12px', 
                fontSize: '16px', 
                background: darkMode ? '#1e293b' : '#ffffff', 
                color: darkMode ? '#f1f5f9' : '#1e293b' 
              }}
            />
          </div>

          {loading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div 
                className="spinner" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  border: '4px solid rgba(102, 126, 234, 0.2)', 
                  borderTopColor: '#667eea', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite', 
                  margin: '0 auto' 
                }}
              ></div>
              <p>Searching...</p>
            </div>
          ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
            <p style={{ textAlign: 'center', color: darkMode ? '#94a3b8' : '#64748b', padding: '40px' }}>
              No users found
            </p>
          ) : searchQuery.length < 2 ? (
            <p style={{ textAlign: 'center', color: darkMode ? '#94a3b8' : '#64748b', padding: '40px' }}>
              Type at least 2 characters to search
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {searchResults.map((searchUser) => (
                <div 
                  key={searchUser.id} 
                  className="search-result-card" 
                  style={{ 
                    background: darkMode ? '#1e293b' : '#ffffff', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px' 
                  }}
                >
                  <div 
                    className="user-avatar" 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      background: searchUser.avatarUrl 
                        ? `url(${searchUser.avatarUrl}) center/cover` 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: 'white', 
                      flexShrink: 0 
                    }}
                  >
                    {!searchUser.avatarUrl && searchUser.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 
                      style={{ 
                        margin: '0 0 4px 0', 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {searchUser.name}
                    </h4>
                    <p 
                      style={{ 
                        margin: 0, 
                        fontSize: '13px', 
                        color: darkMode ? '#94a3b8' : '#64748b', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {searchUser.email}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleSendRequest(searchUser.id)}
                    disabled={actionLoading === searchUser.id}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '10px 20px', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      cursor: 'pointer', 
                      flexShrink: 0, 
                      whiteSpace: 'nowrap' 
                    }}
                  >
                    {actionLoading === searchUser.id ? 'Sending...' : '➕ Add Friend'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .friend-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
        
        .request-card:hover,
        .search-result-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        button:hover:not(:disabled) {
          opacity: 0.9;
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default Friends;