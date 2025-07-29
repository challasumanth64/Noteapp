// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../assets/styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      setError('Valid email is required');
      return;
    }

    try {
      // This endpoint can be reused if the backend handles both signup and login cases
      await API.post('/auth/send-otp', { email });
      setStep('otp');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Make sure the user exists.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // IMPORTANT: Changed endpoint to /auth/login for verifying an existing user.
      // The previous endpoint /auth/verify-otp was for creating a new user.
      // Your backend needs to handle this /auth/login route.
      const res = await API.post('/auth/login', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/welcome');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred.';
      
      // If the backend indicates the user is not found, redirect to the signup page.
      if (errorMessage.toLowerCase().includes('user not found')) {
        navigate('/signup');
        return; // Stop further execution
      }
      setError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    try {
      await API.post('/auth/resend-otp', { email });
      setError('A new OTP has been sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <div className="error-box">{error}</div>}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="primary-btn">Continue</button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="input-field"
            />
            <button type="submit" className="primary-btn">Verify OTP</button>
            <div className="mt-3 form-actions">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-btn"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-btn"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <p className="mt-4 text-sm">
          Don't have an account?{' '}
          <a href="/signup" className="link">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;