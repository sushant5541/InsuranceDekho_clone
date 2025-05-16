import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setMessage('');

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    // Validation
    if (!normalizedEmail || !trimmedPassword || !trimmedConfirm) {
      throw new Error('All fields are required');
    }

    if (!validator.isEmail(normalizedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    if (trimmedPassword !== trimmedConfirm) {
      throw new Error('Passwords do not match');
    }

    if (trimmedPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
      {
        email: normalizedEmail,
        password: trimmedPassword
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.success) {
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      throw new Error(response.data.message || 'Password update failed');
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 
                       err.message || 
                       'Failed to reset password. Please try again.';
    setError(errorMessage);
    console.error('Password reset error:', {
      error: err,
      response: err.response?.data
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Forgot Password</h2>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    minLength="6"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength="6"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;