import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Navbar({ user, darkMode, onToggleDarkMode, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    setShowUserMenu(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </Link>
        
        <ul className="nav-menu">
          <li><a href="#home" className="nav-link">Home</a></li>
          <li><a href="#features" className="nav-link">Features</a></li>
          <li><a href="#groups" className="nav-link">Groups</a></li>
          <li>
            <Link to="/blog" className="nav-link">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Contact Us
            </Link>
            </li>
        </ul>
        
        <div className="nav-right">
          {/* Dark Mode Toggle */}
          <button 
            className="theme-toggle" 
            onClick={onToggleDarkMode} 
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Profile Buttons */}
          {user ? (
            <div className="user-menu-container">
              <button 
                className="user-profile-btn" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
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
          ) : (
            <div className="nav-buttons">
              <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  darkMode: PropTypes.bool.isRequired,
  onToggleDarkMode: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Navbar;
