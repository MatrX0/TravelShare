import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');

  // Step 1: Backend'den email gönder
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend email gönderecek
      const response = await api.post('/auth/forgot-password', { email });

      if (response.success && response.data) {
        alert('Reset code sent to your email! Please check your inbox.');
        setStep(2);
      } else {
        setError(response.message || 'Failed to send reset code');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Kodu doğrula
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-reset-token', {
        email,
        token: code
      });

      if (response.success) {
        setStep(3);
      } else {
        setError('Invalid or expired code');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Yeni şifreyi kaydet
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        token: code,
        newPassword
      });

      if (response.success) {
        alert('Password reset successfully! Please login with your new password.');
        navigate('/login');
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">🔐</div>
          <h2>Reset Password</h2>
          <p>
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Enter your new password"}
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>

            <div className="auth-footer">
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="link-button"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Verification Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="auth-form">
            <div className="form-group">
              <label>6-Digit Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength="6"
                required
                disabled={loading}
                className="code-input"
              />
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="auth-footer">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="link-button"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;