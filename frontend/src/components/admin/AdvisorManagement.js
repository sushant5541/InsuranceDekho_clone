import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdvisorManagement = () => {
  const { user, token } = useAuth();
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentAdvisor, setCurrentAdvisor] = useState(null);
  
  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    specialization: '',
    City: '',
    yearsOfExperience: '',
    profilePhoto: '',
    isActive: true
  };
  
  const [formData, setFormData] = useState(initialFormData);

  // Create axios instance with auth token
 const api = axios.create({
    baseURL: `http://localhost:4000/api`,
  });

  // Add request interceptor to include token in headers
  api.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });


  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const { data } = await api.get('/advisors');
        setAdvisors(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch advisors');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisors();
  }, [user?.token]); // Add dependency on user.token

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (advisor) => {
    setCurrentAdvisor(advisor);
    setFormData({
      name: advisor.name,
      email: advisor.email,
      phone: advisor.phone,
      specialization: advisor.specialization,
      City: advisor.City,
      yearsOfExperience: advisor.yearsOfExperience,
      profilePhoto: advisor.profilePhoto || '',
      isActive: advisor.isActive
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || 
          !formData.specialization || !formData.City || !formData.yearsOfExperience) {
        throw new Error('Please fill all required fields');
      }

      if (currentAdvisor) {
        // Update existing advisor
        const { data } = await api.put(`/advisors/${currentAdvisor._id}`, formData);
        setAdvisors(advisors.map(a => a._id === data._id ? data : a));
      } else {
        // Create new advisor
        const { data } = await api.post('/advisors', {
          ...formData,
          profilePhoto: formData.profilePhoto || 'https://randomuser.me/api/portraits/lego/1.jpg'
        });
        setAdvisors([...advisors, data]);
      }
      
      setShowModal(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
      console.error('Operation error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advisor?')) {
      try {
        await api.delete(`/advisors/${id}`);
        setAdvisors(advisors.filter(a => a._id !== id));
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete advisor');
        console.error('Delete error:', err);
      }
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="advisor-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Advisor Management</h2>
        {user?.isAdmin && (
          <Button variant="primary" onClick={() => {
            setCurrentAdvisor(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}>
            Add New Advisor
          </Button>
        )}
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>City</th>
            <th>Experience</th>
            <th>Status</th>
            {user?.isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {advisors.map(advisor => (
            <tr key={advisor._id}>
              <td>
                <div className="d-flex align-items-center">
                  <img 
                    src={advisor.profilePhoto} 
                    alt={advisor.name}
                    className="rounded-circle me-2"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  {advisor.name}
                </div>
              </td>
              <td>{advisor.specialization}</td>
              <td>{advisor.City}</td>
              <td>{advisor.yearsOfExperience} years</td>
              <td>
                <Badge bg={advisor.isActive ? 'success' : 'secondary'}>
                  {advisor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              {user?.isAdmin && (
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEditClick(advisor)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(advisor._id)}
                  >
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentAdvisor ? 'Edit Advisor' : 'Add New Advisor'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Specialization *</Form.Label>
              <Form.Select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Specialization</option>
                <option value="Health Insurance">Health Insurance</option>
                <option value="Life Insurance">Life Insurance</option>
                <option value="Car Insurance">Car Insurance</option>
                <option value="Bike Insurance">Bike Insurance</option>
                <option value="Term Insurance">Term Insurance</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City *</Form.Label>
              <Form.Control
                type="text"
                name="City"
                value={formData.City}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Years of Experience *</Form.Label>
              <Form.Control
                type="number"
                name="yearsOfExperience"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Photo URL</Form.Label>
              <Form.Control
                type="url"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleInputChange}
                placeholder="Leave blank for default"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="isActive"
                label="Active Advisor"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentAdvisor ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdvisorManagement;