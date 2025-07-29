// src/pages/Signup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../assets/styles/Auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'details'>('email');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    if (!isValidEmail(email)) return setError('Enter a valid email');

    try {
      await API.post('/auth/send-otp', { email });
      setStep('details');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !name || !dob || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await API.post('/auth/verify-otp', { email, otp, name, dob, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/welcome');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

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
            <button type="submit" className="primary-btn">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="One-Time Password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="input-field"
            />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />

            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="input-field"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />

            <button type="submit" className="primary-btn">Verify & Sign Up</button>
          </form>
        )}
        
        {step === 'details' && (
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
              onClick={async () => {
                try {
                  await API.post('/auth/resend-otp', { email });
                  setError('New OTP sent!');
                } catch (err: any) {
                  setError('Failed to resend OTP');
                }
              }}
              className="text-btn"
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;