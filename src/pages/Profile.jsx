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

  const [bioDraft, setBioDraft] = useState(user?.bio || "");

  // Build a quick lookup to show icons for joinedGroups
  // joinedGroups is coming from your /groups/my-groups mapping (id, name, joinedAt)
  // But icons live in backend group DTO, so we fetch profile.groups and use that as truth.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // keep draft synced when user/profile changes
  useEffect(() => {
    setBioDraft(profile?.bio ?? user?.bio ?? "");
  }, [profile?.bio, user?.bio]);

  const fetchMyProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await api.get("/profile/me"); // <-- change if your endpoint differs
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
        // keep these null/undefined so backend won't overwrite accidentally
        name: null,
        avatarUrl: null,
      });

      if (res?.success) {
        // If backend returns updated UserProfileDTO:
        if (res.data) setProfile(res.data);
        // Otherwise refetch:
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

  // Display values (prefer backend profile, fallback to user prop)
  const displayName = profile?.name ?? user?.name ?? "User";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const displayBio = profile?.bio ?? user?.bio ?? "";

  const groupsJoinedCount =
    profile?.groupCount ?? joinedGroups?.length ?? 0;

  const blogsPostedCount =
    profile?.blogCount ?? 0;

  const friendsCount =
    profile?.friendCount ?? 0;

  const groupsToRender = joinedGroups ?? [];

  return (
    <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="page-background"></div>

      <div className="page-header">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar-large">
          {(displayName?.charAt(0) || displayEmail?.charAt(0) || "U").toUpperCase()}
        </div>
        <div>
          <h1 className="profile-name">{displayName}</h1>
          <p className="profile-email">{displayEmail}</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="profile-section">
        <div className="profile-section-header">
          <h2>Profile Information</h2>
          <button
            onClick={() => setIsEditing((v) => !v)}
            className="edit-btn"
            disabled={loadingProfile || savingBio}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {loadingProfile ? (
          <div className="profile-display">
            <p>Loading profile...</p>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleSaveBio} className="profile-form">
            {/* Name + email are display-only */}
            <div className="display-field">
              <label>Name</label>
              <p>{displayName}</p>
            </div>

            <div className="display-field">
              <label>Email</label>
              <p>{displayEmail}</p>
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
              {savingBio ? "Saving..." : "Save Changes"}
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
              <label>Bio</label>
              <p>{displayBio || "No bio yet. Click Edit Profile to add one!"}</p>
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

          <div className="stat-box blogs-stat">
            <div className="stat-icon">📝</div>
            <p className="stat-value">{blogsPostedCount}</p>
            <p className="stat-label">Blogs Posted</p>
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
            {groupsToRender.map((group, index) => {
              const icon = groupIconById.get(group.id) || "👥";
              return (
                <div key={group.id ?? index} className="joined-group-item">
                  <div className="joined-group-icon">{icon}</div>
                  <div className="joined-group-info">
                    <h3 className="joined-group-name">{group.name}</h3>
                    {group.joinedAt && (
                      <p className="joined-group-date">
                        Joined {new Date(group.joinedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;