import { useState } from 'react';
import './styles/Profile.css';

function Profile({ user, onUpdateUser, darkMode, onNavigate, joinedGroups }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Backend API
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className={`profile-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Page Background */}
      <div className="page-background"></div>

      {/* TravelShare Logo Header */}
      <div className="page-header">
        <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="profile-name">{user?.name || 'User'}</h1>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="profile-section">
        <div className="profile-section-header">
          <h2>Profile Information</h2>
          <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        ) : (
          <div className="profile-display">
            <div className="display-field">
              <label>Name</label>
              <p>{user?.name || 'Not set'}</p>
            </div>

            <div className="display-field">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>

            <div className="display-field">
              <label>Bio</label>
              <p>{user?.bio || 'No bio yet. Click Edit Profile to add one!'}</p>
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
            <p className="stat-value">{joinedGroups?.length || 0}</p>
            <p className="stat-label">Groups Joined</p>
          </div>

          <div className="stat-box blogs-stat">
            <div className="stat-icon">📝</div>
            <p className="stat-value">0</p>
            <p className="stat-label">Blogs Posted</p>
          </div>

          <div className="stat-box friends-stat">
            <div className="stat-icon">🤝</div>
            <p className="stat-value">0</p>
            <p className="stat-label">Friends</p>
          </div>
        </div>
      </div>

      {/* Joined Groups */}
      {joinedGroups && joinedGroups.length > 0 && (
        <div className="profile-section">
          <h2>Joined Groups</h2>
          <div className="joined-groups-list">
            {joinedGroups.map((group, index) => (
              <div key={index} className="joined-group-item">
                <div className="joined-group-icon">
                  {group.name.split(' ')[0]}
                </div>
                <div className="joined-group-info">
                  <h3 className="joined-group-name">{group.name}</h3>
                  <p className="joined-group-date">
                    Joined {new Date(group.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
