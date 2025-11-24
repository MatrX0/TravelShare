import { useState, useEffect } from 'react'
import './App.css'
import authService from './services/AuthService.js'
import api from './services/api.js'
import { useNavigate } from "react-router-dom";
import adventureText from './matrx.png'
import Map from './Map.jsx'

// Yeni sayfa bileşenleri
import Mytrips from './pages/MyTrips.jsx'
import ActivityGroups from './pages/ActivityGroups.jsx'
import GroupDetail from './pages/GroupDetail.jsx'
import Messages from './pages/Messages.jsx'
import Friends from './pages/Friends.jsx'
import Profile from './pages/Profile.jsx'
import Blog from './pages/Blog.jsx'

function LoginPage({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Backend'e login isteği gönder
      const response = await authService.login({ email, password })
      
      // Başarılı giriş
      onLogin(response.user)
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">✈️</div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <button onClick={onSwitchToRegister} className="link-button">Register</button></p>
        </div>
      </div>
    </div>
  )
}

function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Şifre kontrolü
    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long!')
      return
    }

    setLoading(true)

    try {
      // Backend'e register isteği gönder
      const response = await authService.register({ name, email, password })
      
      // Başarılı kayıt
      onRegister(response.user)
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">✈️</div>
          <h2>Create Account</h2>
          <p>Join our travel community</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength="2"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <button onClick={onSwitchToLogin} className="link-button">Sign In</button></p>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'login', 'register', 'dashboard', 'activity-groups', 'messages', 'friends', 'profile', 'blog'
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [joinedGroups, setJoinedGroups] = useState([])
  const [backendGroups, setBackendGroups] = useState([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const navigate = useNavigate();

  // Uygulama yüklendiğinde kullanıcıyı kontrol et
  useEffect(() => {
    // Karanlık modu yükleme
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode === 'true') {
      setDarkMode(true)
      document.body.classList.add('dark-mode')
    }

    // Kullanıcı oturum kontrolü
    const savedUser = authService.getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
      // Kullanıcı varsa katılmış grupları backend'den çek
      fetchUserJoinedGroups(savedUser.id)
    }

    // Local'den katılmış grupları yükleme (fallback)
    const savedJoinedGroups = localStorage.getItem('joinedGroups')
    if (savedJoinedGroups) {
      setJoinedGroups(JSON.parse(savedJoinedGroups))
    }
  }, [])

  // Kullanıcı giriş yaptığında grupları çek
  useEffect(() => {
    if (user) {
      fetchBackendGroups()
    }
  }, [user])

  // Kullanıcının katılmış gruplarını backend'den çek
  const fetchUserJoinedGroups = async (userId) => {
    try {
      const response = await api.get('/groups/my-groups')
      if (response.success && response.data) {
        const groupsWithDetails = response.data.map(group => ({
          id: group.id,
          name: group.name,
          joinedAt: group.joinedAt || new Date().toISOString()
        }))
        setJoinedGroups(groupsWithDetails)
        localStorage.setItem('joinedGroups', JSON.stringify(groupsWithDetails))
      }
    } catch (error) {
      console.error('Error fetching joined groups:', error)
      // Hata durumunda localStorage'dan yüklemeye devam et
    }
  }

  // Backend'den grupları çek
  const fetchBackendGroups = async () => {
    if (!user) return

    setLoadingGroups(true)
    try {
      const response = await api.get('/groups')
      if (response.success && response.data) {
        setBackendGroups(response.data)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
      // Hata durumunda hardcoded grupları kullanmaya devam et
    } finally {
      setLoadingGroups(false)
    }
  }

  // Tema değiştirme
  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    if (newMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentPage('home')
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setCurrentPage('home')
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setShowUserMenu(false)
      setJoinedGroups([])
      localStorage.removeItem('joinedGroups')
      setCurrentPage('home')
    } catch (error) {
      console.error('Logout error:', error)
      // Hata olsa bile local'i temizle
      setUser(null)
      setShowUserMenu(false)
      setJoinedGroups([])
      localStorage.removeItem('joinedGroups')
    }
  }

  // Grup katılma fonksiyonu
  const handleJoinGroup = async (groupId, groupName) => {
    if (!user) {
      setCurrentPage('login')
      return
    }

    try {
      // Backend API çağrısı
      const response = await api.post(`/groups/${groupId}/join`)
      if (response.success) {
        // Başarılı katılım - backend'den güncel listeyi çek
        await fetchUserJoinedGroups(user.id)
        // Grupları yeniden çek
        await fetchBackendGroups()
        alert(`Successfully joined ${groupName}!`)
      }
    } catch (error) {
      console.error('Error joining group:', error)
      alert('Failed to join group. Please try again.')
    }
  }

  // Login page
  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />
  }

  // Register page
  if (currentPage === 'register') {
    return <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage('login')} />
  }

  // Sayfa navigasyon fonksiyonu
  const navigateToPage = (page) => {
    setCurrentPage(page)
    setShowUserMenu(false)
  }

  // My Trips sayfası
  if (currentPage === 'mytrips' && user) {
    return <Mytrips user={user} onNavigate={navigateToPage} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  // Activity Groups sayfası
  if (currentPage === 'activity-groups' && user) {
    return <ActivityGroups user={user} onNavigate={navigateToPage} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  // Group Detail sayfası
  if (currentPage === 'group-detail' && user) {
    return <GroupDetail user={user} onNavigate={navigateToPage} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  // Messages sayfası
  if (currentPage === 'messages' && user) {
    return <Messages user={user} onNavigate={navigateToPage} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  // Friends sayfası
  if (currentPage === 'friends' && user) {
    return <Friends user={user} onNavigate={navigateToPage} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  // Profile sayfası
  if (currentPage === 'profile' && user) {
    return <Profile user={user} onNavigate={navigateToPage} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} joinedGroups={joinedGroups} />
  }

  // Blog sayfası
  if (currentPage === 'blog') {
    return <Blog user={user} onNavigate={navigateToPage} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  // Map sayfası
  if (currentPage === 'map') {
    return <Map />
  }

  // Main page
  const features = [
    {
      icon: '🗺️',
      title: 'Interactive Route Planning',
      description: 'Create and customize your travel routes on an interactive map with distance calculations and suggested paths.'
    },
    {
      icon: '📅',
      title: 'Daily Activity Planner',
      description: 'Organize your daily travel plans with activities, locations, and personal notes all in one place.'
    },
    {
      icon: '👥',
      title: 'Activity Groups',
      description: 'Join trekking, hiking, camping, road trips, or cultural tour groups to connect with like-minded travelers.'
    },
    {
      icon: '🌤️',
      title: 'Weather Integration',
      description: 'Get real-time weather data to optimize your travel schedules and make informed decisions.'
    },
    {
      icon: '💬',
      title: 'Collaborate & Share',
      description: 'Share travel ideas, create shared routes, and exchange suggestions with your travel community.'
    },
    {
      icon: '🔒',
      title: 'Secure & Organized',
      description: 'Secure login and well-structured profiles ensure your travel data is safe and organized.'
    }
  ]

  const activityGroups = [
    { id: 1, name: '🥾 Trekking', members: '2.3k', color: '#10b981' },
    { id: 2, name: '⛰️ Hiking', members: '1.8k', color: '#3b82f6' },
    { id: 3, name: '🏕️ Camping', members: '1.5k', color: '#f59e0b' },
    { id: 4, name: '🚗 Road Trips', members: '3.1k', color: '#ef4444' },
    { id: 5, name: '🏛️ Cultural Tours', members: '2.7k', color: '#8b5cf6' },
    { id: 6, name: '🏖️ Beach & Coastal', members: '2.1k', color: '#06b6d4' }
  ]

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">✈️</span>
            <span className="logo-text">TravelShare</span>
          </div>
          
          <ul className="nav-menu">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#groups" className="nav-link">Groups</a></li>
            <li><a href="#blog" className="nav-link" onClick={() => setCurrentPage('blog')}>Blog</a></li>
          </ul>
          
          <div className="nav-right">
            {/* Dark Mode Toggle */}
            <button className="theme-toggle" onClick={toggleDarkMode} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* User Profile Buttons */}
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
                    <button className="dropdown-item" onClick={() => navigateToPage('profile')}>
                      👤 Profile
                    </button>
                    <button className="dropdown-item" onClick={() => navigateToPage('activity-groups')}>
                      👥 Activity Groups
                    </button>
                    <button className="dropdown-item" onClick={() => navigateToPage('messages')}>
                      💬 Messages
                    </button>
                    <button className="dropdown-item" onClick={() => navigateToPage('friends')}>
                      🤝 Friends
                    </button>
                    <button className="dropdown-item" onClick={() => navigateToPage('mytrips')}>
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
                <button className="btn-secondary" onClick={() => setCurrentPage('login')}>Sign In</button>
                <button className="btn-primary" onClick={() => setCurrentPage('register')}>Register</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1 className="hero-title">
            Plan, Share, and Explore Your
            <img 
                src={adventureText} 
                alt="Your Adventures" 
                className="hero-title-img"
            />
          </h1>
          <p className="hero-description">
            Create interactive travel routes, join activity groups, and collaborate with fellow travelers.
            Your journey begins here with smart planning and a vibrant community.
          </p>
          <div className="hero-buttons">
            {/* Start Planning */}
            <button
              className="btn-large btn-primary"
              onClick={() => setCurrentPage('map')}
            >
              Start Planning
            </button>

            {/* Explore Groups */}
            <button
              className="btn-large btn-outline"
              onClick={() => {
                document.querySelector("#groups")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Groups
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
            </div>
            <div className="stat">
            </div>
            <div className="stat">

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need for Perfect Travel Planning</h2>
          <p className="section-description">
            Powerful features designed to make your travel planning seamless and enjoyable
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Groups Section */}
      <section id="groups" className="groups-section">
        <div className="section-header">
          <h2 className="section-title">Join Activity Groups</h2>
          <p className="section-description">
            Connect with travelers who share your interests and explore together
          </p>
        </div>
        <div className="groups-grid">
          {loadingGroups ? (
            <div className="loading-groups">Loading groups...</div>
          ) : backendGroups.length > 0 ? (
            backendGroups.map((group, index) => {
              const isJoined = group.isMember || joinedGroups.some(jg => jg.id === group.id);
              return (
                <div key={group.id || index} className="group-card" style={{ borderLeftColor: group.color || '#10b981' }}>
                  <div className="group-header">
                    <h3 className="group-name">{group.icon} {group.name}</h3>
                    <span className="group-badge">{group.memberCount || 0} members</span>
                  </div>
                  <button
                    className={`btn-join ${isJoined ? 'joined' : ''}`}
                    style={{ backgroundColor: isJoined ? '#10b981' : (group.color || '#10b981') }}
                    onClick={() => !isJoined && handleJoinGroup(group.id, group.name)}
                    disabled={isJoined}
                  >
                    {isJoined ? '✓ Joined' : 'Join Group'}
                  </button>
                </div>
              );
            })
          ) : (
            activityGroups.map((group, index) => {
              const isJoined = joinedGroups.some(jg => jg.id === group.id);
              return (
                <div key={index} className="group-card" style={{ borderLeftColor: group.color }}>
                  <div className="group-header">
                    <h3 className="group-name">{group.name}</h3>
                    <span className="group-badge">{group.members} members</span>
                  </div>
                  <button
                    className={`btn-join ${isJoined ? 'joined' : ''}`}
                    style={{ backgroundColor: isJoined ? '#10b981' : group.color }}
                    onClick={() => !isJoined && handleJoinGroup(group.id, group.name)}
                    disabled={isJoined}
                  >
                    {isJoined ? '✓ Joined' : 'Join Group'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">Get started in three simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Create Your Profile</h3>
            <p className="step-description">Sign up and set up your traveler profile with your interests and preferences</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Plan Your Route</h3>
            <p className="step-description">Use our interactive map to create routes, add activities, and organize your itinerary</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Share & Collaborate</h3>
            <p className="step-description">Join groups, share your plans, and get inspired by fellow travelers</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Adventure?</h2>
          <p className="cta-description">
            Join thousands of travelers planning their perfect trips with TravelShare
          </p>
          <button 
            className="btn-large btn-primary" 
            onClick={() => user ? null : setCurrentPage('register')}
          >
            {user ? 'Explore Now' : 'Create Free Account'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">✈️ TravelShare</h3>
            <p className="footer-text">Plan, share, and explore your adventures with a community of passionate travelers.</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#groups">Activity Groups</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 TravelShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App