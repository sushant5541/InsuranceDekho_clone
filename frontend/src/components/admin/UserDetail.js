// src/components/admin/UserDetail.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Badge, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserEditForm from './UserEditForm';



const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://insurance-backend:4000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleSave = async (updatedUser) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:4000/api/admin/users/${id}`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return <Alert variant="danger">User not found</Alert>;
  }

  return (
    <div className="user-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Details</h2>
        <div>
          <Button variant="outline-secondary" onClick={() => navigate(-1)} className="me-2">
            <i className="bi bi-arrow-left"></i> Back
          </Button>
          <Button 
            variant={isEditing ? 'outline-danger' : 'primary'} 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <><i className="bi bi-x-lg"></i> Cancel</>
            ) : (
              <><i className="bi bi-pencil"></i> Edit</>
            )}
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="profile" title="Profile">
          <Card className="mt-3">
            <Card.Body>
              {isEditing ? (
                <UserEditForm user={user} onSave={handleSave} />
              ) : (
                <>
                  <div className="d-flex align-items-center mb-4">
                    <div className="avatar me-3">
                      <div className="initials bg-light rounded-circle d-flex align-items-center justify-content-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1">{user.name}</h4>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Badge bg={user.isActive ? 'success' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge bg={user.isAdmin ? 'danger' : user.isAdvisor ? 'info' : 'secondary'}>
                          {user.isAdmin ? 'Admin' : user.isAdvisor ? 'Advisor' : 'User'}
                        </Badge>
                      </div>
                      <p className="text-muted mb-0">{user.email}</p>
                    </div>
                  </div>
                  
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Registered:</strong> {new Date(user.createdAt).toLocaleString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Mobile:</strong> {user.mobile || 'Not provided'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Gender:</strong> {user.gender || 'Not specified'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}
                    </ListGroup.Item>
                  </ListGroup>
                </>
              )}
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="policies" title="Policies">
         
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserDetail;