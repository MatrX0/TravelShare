import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import authService from './services/authService';
import api from './services/api';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyTrips from './pages/MyTrips';
import GroupDetail from './pages/GroupDetail';
import Messages from './pages/Messages';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Maps from './pages/Maps';
import ForgotPassword from './pages/ForgotPassword';
import SharedRoute from './pages/SharedRoute';

// Protected Route Component
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [backendGroups, setBackendGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Fetch groups when user logs in
  useEffect(() => {
    if (user) {
      fetchBackendGroups();
    }
  }, [user]);

  const initializeApp = () => {
    // Load dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    // Check for existing user local
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      fetchUserJoinedGroups(savedUser.id);
    }

    // Load joined groups from localStorage (fallback)
    const savedJoinedGroups = localStorage.getItem('joinedGroups');
    if (savedJoinedGroups) {
      setJoinedGroups(JSON.parse(savedJoinedGroups));
    }
  };

  // Fetch user's joined groups from backend
  const fetchUserJoinedGroups = async (userId) => {
    try {
      const response = await api.get('/groups/my-groups');
      if (response.success && response.data) {
        const groupsWithDetails = response.data.map(group => ({
          id: group.id,
          name: group.name,
          joinedAt: group.joinedAt || new Date().toISOString()
        }));
        setJoinedGroups(groupsWithDetails);
        localStorage.setItem('joinedGroups', JSON.stringify(groupsWithDetails));
      }
    } catch (error) {
      console.error('Error fetching joined groups:', error);
    }
  };

  // Fetch all groups from backend
  const fetchBackendGroups = async () => {
    if (!user) return;

    setLoadingGroups(true);
    try {
      const response = await api.get('/groups');
      if (response.success && response.data) {
        setBackendGroups(response.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Auth handlers
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setJoinedGroups([]);
      localStorage.removeItem('joinedGroups');
    }
  };

  // Group handlers
  const handleJoinGroup = async (groupId, groupName) => {
    if (!user) {
      return;
    }

    try {
      const response = await api.post(`/groups/${groupId}/join`);
      if (response.success) {
        await fetchUserJoinedGroups(user.id);
        await fetchBackendGroups();
        alert(`Successfully joined ${groupName}!`);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group. Please try again.');
    }
  };

  const handleLeaveGroup = async (groupId, groupName) => {
    if (!user) {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to leave ${groupName}?`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await api.post(`/groups/${groupId}/leave`);
      if (response.success) {
        await fetchUserJoinedGroups(user.id);
        await fetchBackendGroups();
        alert(`Successfully left ${groupName}!`);
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      const errorMessage = error.message || error.error || 'Failed to leave group. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <LandingPage 
            user={user}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
            backendGroups={backendGroups}
            loadingGroups={loadingGroups}
            joinedGroups={joinedGroups}
            onJoinGroup={handleJoinGroup}
            onLeaveGroup={handleLeaveGroup}
          />
        } 
      />
      
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
        } 
      />
      
      <Route 
        path="/register" 
        element={
          user ? <Navigate to="/" replace /> : <RegisterPage onRegister={handleRegister} />
        } 
      />
      
      <Route 
        path="/blog" 
        element={
          <Blog 
            user={user} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
          />
        } 
      />
      
      {/* Public shared route - no auth required */}
      <Route path="/shared-route/:shareToken" element={<SharedRoute />} />
      
      <Route path="/maps" element={<Maps />} />

      {/* Protected Routes */}
      <Route 
        path="/mytrips" 
        element={
          <ProtectedRoute>
            <MyTrips 
              user={user} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/group/:groupId" 
        element={
          <ProtectedRoute>
            <GroupDetail 
              user={user} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/messages" 
        element={
          <ProtectedRoute>
            <Messages 
              user={user} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/friends" 
        element={
          <ProtectedRoute>
            <Friends 
              user={user} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile 
              user={user} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
              joinedGroups={joinedGroups}
            />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/contact" 
        element={
          <ProtectedRoute>
            <Contact 
              user={user} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/ForgotPassword" 
        element={ <ForgotPassword /> }
      />

      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
