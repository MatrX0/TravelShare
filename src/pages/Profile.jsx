import { useEffect, useMemo, useState } from "react";
import "./styles/Profile.css";
import { useNavigate } from 'react-router-dom';
import api from "../services/api.js";

function Profile({ user, darkMode, toggleDarkMode, onLogout }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // server profile (UserProfileDTO)
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  const [bioDraft, setBioDraft] = useState(user?.bio || "");

  // Load profile from backend once user exists
  useEffect(() => {
    if (!user?.id) return;
    fetchMyProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // keep draft synced when user/profile changes
  useEffect(() => {
    setBioDraft(profile?.bio ?? user?.bio ?? "");
  }, [profile?.bio, user?.bio]);

  const fetchMyProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await api.get("/profile/me");
      if (res?.success) {
        setProfile(res.data);
      } else {
        console.error("Profile fetch failed:", res);
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveBio = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSavingBio(true);
    try {
      const res = await api.put("/profile/me", {
        bio: bioDraft,
        name: null,
        avatarUrl: null,
      });

      if (res?.success) {
        if (res.data) setProfile(res.data);
        else await fetchMyProfile();

        setIsEditing(false);
        alert("Bio updated successfully!");
      } else {
        alert(res?.message || "Failed to update bio");
      }
    } catch (e) {
      console.error("Error saving bio:", e);
      alert("Failed to update bio");
    } finally {
      setSavingBio(false);
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

  // Display values (prefer backend profile, fallback to user prop)
  const displayName = profile?.name ?? user?.name ?? "User";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const displayUniqueId = profile?.uniqueId ?? user?.uniqueId ?? "N/A";
  const displayBio = profile?.bio ?? user?.bio ?? "";

  const groupsJoinedCount = profile?.groupCount ?? 0;
  const friendsCount = profile?.friendCount ?? 0;

  const groupsToRender = profile?.groups ?? [];

  if (loadingProfile && !profile) {
    return (
      <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
        <div className="page-background"></div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="page-background"></div>

      {/* Header */}
      <div className="profile-header-bar">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
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
                  <button className="dropdown-item" onClick={() => handleNavigation('/map')}>
                    🗺️ Maps
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

      {/* Profile Header */}
      <div className="profile-hero">
        <div className="profile-avatar-large">
          {(displayName?.charAt(0) || displayEmail?.charAt(0) || "U").toUpperCase()}
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">{displayName}</h1>
          <p className="profile-email">{displayEmail}</p>
          <p className="profile-unique-id">🆔 {displayUniqueId}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Information */}
        <div className="profile-section">
          <div className="profile-section-header">
            <h2>Profile Information</h2>
            <button
              onClick={() => setIsEditing((v) => !v)}
              className="edit-btn"
              disabled={loadingProfile || savingBio}
            >
              {isEditing ? "✕ Cancel" : "✏️ Edit Profile"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveBio} className="profile-form">
              <div className="display-field">
                <label>Name</label>
                <p>{displayName}</p>
              </div>

              <div className="display-field">
                <label>Email</label>
                <p>{displayEmail}</p>
              </div>

              <div className="display-field">
                <label>Unique ID</label>
                <p>{displayUniqueId}</p>
              </div>

              <div className="form-field">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  disabled={savingBio}
                />
              </div>

              <button
                type="submit"
                className="save-btn"
                disabled={savingBio}
                style={{ opacity: savingBio ? 0.7 : 1 }}
              >
                {savingBio ? "Saving..." : "💾 Save Changes"}
              </button>
            </form>
          ) : (
            <div className="profile-display">
              <div className="display-field">
                <label>Name</label>
                <p>{displayName || "Not set"}</p>
              </div>

              <div className="display-field">
                <label>Email</label>
                <p>{displayEmail}</p>
              </div>

              <div className="display-field">
                <label>Unique ID</label>
                <p className="unique-id-display">{displayUniqueId}</p>
              </div>

              <div className="display-field">
                <label>Bio</label>
                <p className="bio-text">{displayBio || "No bio yet. Click Edit Profile to add one!"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Activity Statistics */}
        <div className="profile-section">
          <h2>Activity Statistics</h2>
          <div className="stats-grid">
            <div className="stat-box groups-stat">
              <div className="stat-icon">👥</div>
              <p className="stat-value">{groupsJoinedCount}</p>
              <p className="stat-label">Groups Joined</p>
            </div>

            <div className="stat-box friends-stat">
              <div className="stat-icon">🤝</div>
              <p className="stat-value">{friendsCount}</p>
              <p className="stat-label">Friends</p>
            </div>
          </div>
        </div>

        {/* Joined Groups */}
        {groupsToRender.length > 0 && (
          <div className="profile-section">
            <h2>Joined Groups</h2>
            <div className="joined-groups-list">
              {groupsToRender.map((group) => (
                <div 
                  key={group.id} 
                  className="joined-group-item"
                  onClick={() => navigate(`/groups/${group.id}`)}
                >
                  <div className="joined-group-icon">{group.icon || "👥"}</div>
                  <div className="joined-group-info">
                    <h3 className="joined-group-name">{group.name}</h3>
                    <p className="joined-group-meta">
                      {group.memberCount} members
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {groupsToRender.length === 0 && (
          <div className="profile-section">
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No groups yet</h3>
              <p>Join activity groups to connect with travelers</p>
              <button 
                className="cta-btn"
                onClick={() => navigate('/activity-groups')}
              >
                Browse Groups
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
