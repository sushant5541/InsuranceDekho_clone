import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver'; // install with: npm install file-saver
import { useAuth } from '../context/AuthContext';

const UserPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const { user, token } = useAuth(); // token should be available in your context

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get('/api/payments/user-policies', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPolicies(res.data);
      } catch (err) {
        console.error('Error fetching policies', err);
      }
    };

    fetchPolicies();
  }, [token]);

  const handleDownload = async (paymentId) => {
    try {
      const response = await axios.get(`/api/payments/download/${paymentId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      saveAs(response.data, `Policy_${paymentId}.pdf`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download policy. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Purchased Policies</h2>
      <ul className="list-group">
        {policies.map(policy => (
          <li key={policy._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{policy.planType.toUpperCase()}</strong> - ₹{policy.amount}
              <br />
              <small>{new Date(policy.createdAt).toLocaleString()}</small>
            </div>
            <button className="btn btn-primary" onClick={() => handleDownload(policy._id)}>
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPolicies;
