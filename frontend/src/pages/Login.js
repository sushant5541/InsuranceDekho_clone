import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in all fields');
      return;
    }

    console.log('Attempting login with:', {
      email: trimmedEmail,
      password: trimmedPassword,
      isAdminLogin
    });

    try {
      const endpoint = isAdminLogin
        ? 'http://localhost:4000/api/admin/login'
        : 'http://localhost:4000/api/auth/login';

      const response = await axios.post(endpoint, {
        email: trimmedEmail,
        password: trimmedPassword
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Login response:', response.data);

      const user = response.data.admin || response.data.user;
      const isAdmin = isAdminLogin;

      const authData = {
        token: response.data.token,
        user: { ...user, isAdmin }, // Explicitly set isAdmin on user
        isAdmin
      };

      if (!authData.token || !authData.user) {
        throw new Error('Invalid response structure');
      }

      // Store and redirect
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      localStorage.setItem('isAdmin', authData.isAdmin.toString());

      login(authData.token, authData.user);
      navigate(authData.isAdmin ? '/admin/dashboard' : '/dashboard');

    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });

      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "100%" }}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">{isAdminLogin ? 'Admin Login' : 'User Login'}</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3 text-center">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${!isAdminLogin ? 'btn-warning text-white' : 'btn-outline-secondary'}`}
                    onClick={() => {
                      console.log('Switched to User Login');
                      setIsAdminLogin(false);
                    }}
                  >
                    User Login
                  </button>
                  <button
                    type="button"
                    className={`btn ${isAdminLogin ? 'btn-warning text-white' : 'btn-outline-secondary'}`}
                    onClick={() => {
                      console.log('Switched to Admin Login');
                      setIsAdminLogin(true);
                    }}
                  >
                    Admin Login
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
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
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-warning text-white">
                    {isAdminLogin ? 'Login as Admin' : 'Login as User'}
                  </button>
                </div>

                {!isAdminLogin && (
                  <div className="text-center">
                    <p className="mb-1">
                      Don't have an account? <Link to="/register">Register</Link>
                    </p>
                    <p>
                      <Link to="/forgot-password">Forgot password?</Link>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
