import { useEffect, useMemo, useState } from "react";
import "./styles/Profile.css";
import { useNavigate } from 'react-router-dom';
import api from "../services/api.js";

function Profile({ user, darkMode, onNavigate, joinedGroups }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // server profile (UserProfileDTO)
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [friendsCountFromApi, setFriendsCountFromApi] = useState(null);

  const [bioDraft, setBioDraft] = useState(user?.bio || "");
  const [nameDraft, setNameDraft] = useState(user?.name || "");
  const [avatarUrlDraft, setAvatarUrlDraft] = useState(user?.avatarUrl || "");

  // Build a quick lookup to show icons for joinedGroups
  const groupIconById = useMemo(() => {
    const map = new Map();
    if (profile?.groups?.length) {
      for (const g of profile.groups) {
        map.set(g.id, g.icon);
      }
    }
    return map;
  }, [profile]);

  // Load profile from backend once user exists
  useEffect(() => {
    if (!user?.id) return;
    fetchMyProfile();
    fetchFriendsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // keep draft synced when user/profile changes
  useEffect(() => {
    setBioDraft(profile?.bio ?? user?.bio ?? "");
    setNameDraft(profile?.name ?? user?.name ?? "");
    setAvatarUrlDraft(profile?.avatarUrl ?? user?.avatarUrl ?? "");
  }, [profile?.bio, profile?.name, profile?.avatarUrl, user?.bio, user?.name, user?.avatarUrl]);

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

  const fetchFriendsCount = async () => {
    try {
      const res = await api.get("/friends");
      if (res?.success && Array.isArray(res.data)) {
        setFriendsCountFromApi(res.data.length);
      }
    } catch (e) {
      console.error("Error fetching friends count:", e);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validation
    if (!nameDraft.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    setSavingBio(true);
    try {
      const res = await api.put("/profile/me", {
        name: nameDraft.trim(),
        bio: bioDraft.trim(),
        avatarUrl: avatarUrlDraft.trim() || null,
      });

      if (res?.success) {
        if (res.data) setProfile(res.data);
        else await fetchMyProfile();

        setIsEditing(false);
        alert("Profile updated successfully!");
        
        // Update localStorage user data
        const updatedUser = {
          ...user,
          name: nameDraft.trim(),
          bio: bioDraft.trim(),
          avatarUrl: avatarUrlDraft.trim() || user.avatarUrl
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        alert(res?.message || "Failed to update profile");
      }
    } catch (e) {
      console.error("Error saving profile:", e);
      alert("Failed to update profile");
    } finally {
      setSavingBio(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setNameDraft(profile?.name ?? user?.name ?? "");
    setBioDraft(profile?.bio ?? user?.bio ?? "");
    setAvatarUrlDraft(profile?.avatarUrl ?? user?.avatarUrl ?? "");
    setIsEditing(false);
  };

  // Display values
  const displayName = profile?.name ?? user?.name ?? "User";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const displayBio = profile?.bio ?? user?.bio ?? "";
  const displayAvatar = profile?.avatarUrl ?? user?.avatarUrl ?? "";

  const groupsJoinedCount = (joinedGroups?.length ?? 0) > 0
    ? joinedGroups.length
    : (profile?.groupCount ?? 0);
  const blogsPostedCount = profile?.blogCount ?? 0;
  const friendsCount = friendsCountFromApi ?? profile?.friendCount ?? 0;

  const groupsToRender = joinedGroups ?? [];

  // Inline styles for critical overrides
  const containerStyle = {
    maxWidth: '100%',  // Tam genişlik
    width: '100%',
    margin: '0',
    padding: '40px 60px',  // Yan padding artırdık
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    color: darkMode ? '#f1f5f9' : '#1e293b',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };
  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: '40px',
    color: 'white',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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
    color: darkMode ? '#f1f5f9' : '#1e293b'
  };

  return (
    <div className={`profile-container ${darkMode ? "dark-mode" : ""}`} style={containerStyle}>
      {/* Background */}
      <div className="page-background"></div>

      {/* Header with Back Button */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'transparent', border: 'none', boxShadow: 'none', position: 'relative' }}>
        <button 
          style={backButtonStyle}
          onClick={() => navigate("/")}
          aria-label="Back to home"
          onMouseEnter={(e) => e.target.style.borderColor = '#667eea'}
          onMouseLeave={(e) => e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'}
        >
          <span className="back-arrow">←</span>
          <span className="back-text">Back to Home</span>
        </button>
        
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}
        >
          <span className="logo-icon">✈️</span>
          <span className="logo-text">ShareWay</span>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="profile-header" style={headerStyle}>
        <div className="profile-avatar-large" style={{ width: '100px', height: '100px', background: displayAvatar ? `url(${displayAvatar}) center/cover` : 'rgba(255,255,255,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'bold' }}>
          {!displayAvatar && (displayName?.charAt(0) || displayEmail?.charAt(0) || "U").toUpperCase()}
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name" style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>{displayName}</h1>
          <p className="profile-email" style={{ margin: '0 0 12px 0', opacity: 0.9, fontSize: '16px' }}>{displayEmail}</p>
          <div className="profile-badges" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>✈️ Traveler</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>🌟 Explorer</span>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="profile-section" style={{ background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, marginBottom: '24px' }}>
        <div className="profile-section-header">
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="section-icon">📋</span>
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
              disabled={loadingProfile || savingBio}
              style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {loadingProfile ? (
          <div className="profile-loading">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-field">
              <label>Name *</label>
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Your name"
                disabled={savingBio}
                required
                maxLength={100}
                style={{ width: '100%', padding: '12px 16px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '15px', background: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b' }}
              />
            </div>

            <div className="display-field">
              <label>Email</label>
              <p className="readonly-value" style={{ opacity: 0.7, fontSize: '14px' }}>{displayEmail} (cannot be changed)</p>
            </div>

            <div className="form-field">
              <label>Avatar URL</label>
              <input
                type="url"
                value={avatarUrlDraft}
                onChange={(e) => setAvatarUrlDraft(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                disabled={savingBio}
                maxLength={500}
                style={{ width: '100%', padding: '12px 16px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '15px', background: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b' }}
              />
              <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Enter a direct image URL (e.g., from Imgur, Gravatar)
              </span>
            </div>

            <div className="form-field">
              <label>Bio</label>
              <textarea
                name="bio"
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                rows="4"
                placeholder="Tell us about yourself... Where do you love to travel?"
                disabled={savingBio}
                maxLength={500}
                style={{ width: '100%', padding: '12px 16px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '15px', background: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b', resize: 'vertical', minHeight: '100px' }}
              />
              <span className="char-count" style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'right', display: 'block' }}>{bioDraft.length}/500</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="save-btn"
                disabled={savingBio}
                style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
              >
                {savingBio ? (
                  <>
                    <span className="spinner-small"></span>
                    Saving...
                  </>
                ) : (
                  <>💾 Save Changes</>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={savingBio}
                style={{ flex: 1, background: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#f1f5f9' : '#1e293b', border: 'none', padding: '14px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
              >
                ✖ Cancel
              </button>
            </div>
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
              <label>Avatar URL</label>
              <p>{displayAvatar || "No avatar set"}</p>
            </div>

            <div className="display-field">
              <label>Bio</label>
              <p className="bio-text">
                {displayBio || "No bio yet. Click 'Edit Profile' to add one!"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Activity Statistics */}
      <div className="profile-section" style={{ background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 25px 0', fontSize: '22px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="section-icon">📊</span>
          Activity Statistics
        </h2>
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
        <div className="profile-section" style={{ background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 25px 0', fontSize: '22px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="section-icon">🎯</span>
            Joined Groups ({groupsToRender.length})
          </h2>
          <div className="joined-groups-list">
            {groupsToRender.map((group, index) => {
              const icon = groupIconById.get(group.id) || "👥";
              return (
                <div key={group.id ?? index} className="joined-group-item">
                  <div className="joined-group-icon">{icon}</div>
                  <div className="joined-group-info">
                    <h3 className="joined-group-name">{group.name}</h3>
                    {group.joinedAt && (
                      <p className="joined-group-date">
                        📅 Joined {new Date(group.joinedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button 
                    className="view-group-btn"
                    onClick={() => navigate(`/group/${group.id}`)}
                    style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    View →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State for No Groups */}
      {groupsToRender.length === 0 && (
        <div className="profile-section empty-state" style={{ background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
          <div className="empty-state-icon" style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>🎯</div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: darkMode ? '#f1f5f9' : '#1e293b' }}>No Groups Yet</h3>
          <p style={{ margin: '0 0 24px 0', color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '16px' }}>Join activity groups to connect with fellow travelers!</p>
          <button 
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => navigate("/activity-groups")}
          >
            Explore Groups
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;