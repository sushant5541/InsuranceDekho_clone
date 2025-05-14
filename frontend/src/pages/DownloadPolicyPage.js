// pages/DownloadPolicyPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useAuth } from '../context/AuthContext';

const DownloadPolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const { token } = useAuth();

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
        console.error('Failed to load policies:', err);
      }
    };

    fetchPolicies();
  }, [token]);

  const handleDownload = async (paymentId) => {
    try {
      const res = await axios.get(`/api/payments/download/${paymentId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      saveAs(res.data, `Policy_${paymentId}.pdf`);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download policy. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Policies</h2>
      {policies.length === 0 ? (
        <p>No policies found.</p>
      ) : (
        <ul className="list-group">
          {policies.map((policy) => (
            <li key={policy._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{policy.planType.toUpperCase()}</strong> - ₹{policy.amount}
                <br />
                <small>{new Date(policy.createdAt).toLocaleString()}</small>
              </div>
              <button className="btn btn-success" onClick={() => handleDownload(policy._id)}>
                Download PDF
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DownloadPolicyPage;
