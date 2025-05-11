import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PolicyManagement = () => {
  const { isAdmin } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverageAmount: '',
    premium: '',
    duration: '',
    policyType: 'health',
    isActive: true
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
       const res = await axios.get('http://localhost:4000/api/policies');
        setPolicies(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch policies');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (policy) => {
    setCurrentPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      coverageAmount: policy.coverageAmount,
      premium: policy.premium,
      duration: policy.duration,
      policyType: policy.policyType,
      isActive: policy.isActive
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPolicy) {
        // Update existing policy
        const res = await axios.put(`/api/policies/${currentPolicy._id}`, formData);
        setPolicies(policies.map(p => p._id === currentPolicy._id ? res.data : p));
      } else {
        // Create new policy
        const res = await axios.post('/api/policies', formData);
        setPolicies([...policies, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await axios.delete(`/api/policies/${id}`);
        setPolicies(policies.filter(p => p._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete policy');
      }
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="policy-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Policy Management</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => { setCurrentPolicy(null); setShowModal(true); }}>
            Add New Policy
          </Button>
        )}
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Coverage (₹)</th>
            <th>Premium (₹)</th>
            <th>Duration (years)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(policy => (
            <tr key={policy._id}>
              <td>{policy.name}</td>
              <td>
                <Badge bg={
                  policy.policyType === 'health' ? 'info' : 
                  policy.policyType === 'life' ? 'primary' :
                  policy.policyType === 'car' ? 'warning' : 'success'
                }>
                  {policy.policyType}
                </Badge>
              </td>
              <td>{policy.coverageAmount.toLocaleString()}</td>
              <td>{policy.premium.toLocaleString()}</td>
              <td>{policy.duration}</td>
              <td>
                <Badge bg={policy.isActive ? 'success' : 'secondary'}>
                  {policy.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEditClick(policy)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(policy._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Policy Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentPolicy ? 'Edit Policy' : 'Add New Policy'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Policy Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Coverage Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="coverageAmount"
                    value={formData.coverageAmount}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Premium (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="premium"
                    value={formData.premium}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (years)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Policy Type</Form.Label>
                  <Form.Select
                    name="policyType"
                    value={formData.policyType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="health">Health Insurance</option>
                    <option value="life">Life Insurance</option>
                    <option value="car">Car Insurance</option>
                    <option value="bike">Bike Insurance</option>
                    <option value="term">Term Insurance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="isActive"
                label="Active Policy"
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
              {currentPolicy ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PolicyManagement;