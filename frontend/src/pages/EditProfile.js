import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'Male',
    dob: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to format date for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        gender: user.gender || 'Male',
        dob: formatDateForInput(user.dob), // Format the date here
        mobile: user.mobile || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!formData.name) {
        throw new Error('Name is required');
      }

      // Format the date for backend before sending
      const dobForBackend = formData.dob 
        ? new Date(formData.dob).toISOString()
        : null;

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/profile`,
        {
          name: formData.name,
          gender: formData.gender,
          dob: dobForBackend,
          mobile: formData.mobile
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        navigate('/dashboard', {
          state: { 
            success: 'Profile updated successfully!',
            updatedUser: response.data.user 
          },
        });
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
      console.error('Profile update error:', {
        error: err,
        response: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="profile-card">
        <h2>Edit Profile</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
         <div className="form-group">
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="form-control"
    placeholder=" " // Important for floating labels
    required
  />
  <label>Full Name</label>
</div>

<div className="form-group">
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className="form-control"
    placeholder=" " // Important for floating labels
    required
    disabled
  />
  <label>Email</label>
</div>

<div className="form-group">
  <select
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    className="form-control"
    placeholder=" " // Important for floating labels
  >
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
  <label>Gender</label>
</div>

<div className="form-group">
  <input
    type="date"
    name="dob"
    value={formData.dob}
    onChange={handleChange}
    className="form-control"
    placeholder=" " // Important for floating labels
  />
  <label>Date of Birth</label>
</div>

<div className="form-group">
  <input
    type="tel"
    name="mobile"
    value={formData.mobile}
    onChange={handleChange}
    className="form-control"
    pattern="[0-9]{10}"
    maxLength="10"
    placeholder=" " // Important for floating labels
  />
  <label>Mobile Number</label>
</div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;