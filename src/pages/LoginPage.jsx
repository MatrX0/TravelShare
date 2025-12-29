import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Auth.css';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      onLogin(response.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">✈️</div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey</p>
        </div>

        {error && (
          <div className="error-message">
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
          
          {/* Password with Forgot Password - INLINE STYLE */}
          <div className="form-group">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ marginBottom: 0 }}>Password</label>
              <Link 
                to="/ForgotPassword"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#667eea',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#764ba2';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#667eea';
                  e.target.style.textDecoration = 'none';
                }}
              >
                Forgot Password?
              </Link>
            </div>
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
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="link-button">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;