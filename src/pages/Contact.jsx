import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Contact.css';

function Contact({ user, onLogout, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavigation = (path) => {
    setShowUserMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    // Simulate API call
    try {
      // Backend'e istek gönderilecek
      // const response = await api.post('/contact', formData);
      
      // Simülasyon için timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormStatus({
        type: 'success',
        message: 'Thank you for your message! We\'ll get back to you soon.'
      });
      
      // Form'u temizle
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Background */}
      <div className="contact-background"></div>

      {/* Header */}
      <div className="contact-header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>
        <div className="header-right">
          {/* Dark Mode Toggle */}
          <button 
            className="theme-toggle" 
            onClick={toggleDarkMode} 
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Menu */}
          {user ? (
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
          ) : (
            <div className="nav-buttons">
              <button className="btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn-primary" onClick={() => navigate('/register')}>Register</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-container">
        {/* Hero Section */}
        <div className="contact-hero">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Content Grid */}
        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info-section">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>support@travelshare.com</p>
              <small>We'll respond within 24 hours</small>
            </div>

            <div className="info-card">
              <div className="info-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Available 24/7</p>
              <small>Get instant support</small>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-card">
              <h2>Send us a Message</h2>
              <p className="form-description">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {/* Status Message */}
              {formStatus.message && (
                <div className={`form-status ${formStatus.type}`}>
                  {formStatus.type === 'success' ? '✅' : '❌'} {formStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span className="btn-icon">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">✈️ TravelShare</h3>
            <p className="footer-text">
              Plan, share, and explore your adventures with a community of passionate travelers.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 TravelShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
