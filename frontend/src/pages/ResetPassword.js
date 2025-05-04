import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [validToken, setValidToken] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      try {
        await axios.get(`/api/auth/verify-reset-token/${token}`);
        setValidToken(true);
      } catch (err) {
        setValidToken(false);
        setError(err.response?.data?.message || 'Invalid or expired link');
      }
    };
    checkToken();
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    }
  };

  if (validToken === null) return <p>Verifying token...</p>;
  if (validToken === false) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleReset}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success mt-2">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
