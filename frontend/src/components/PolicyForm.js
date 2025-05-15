// src/components/PolicyForm.js
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';

const PolicyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [policy, setPolicy] = useState({
    name: '',
    description: '',
    coverageAmount: '',
    premium: '',
    duration: '',
    policyType: 'life',
    isActive: true
  });

  useEffect(() => {
    if (id) {
      const fetchPolicy = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://insurance-backend:4000/api/policies/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPolicy(response.data);
        } catch (err) {
          setError('Failed to fetch policy');
          console.error(err);
        }
      };
      fetchPolicy();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPolicy(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (id) {
        await axios.put(`http://localhost:4000/api/policies/${id}`, policy, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:4000/api/policies', policy, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      navigate('/admin/policies');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save policy');
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>{id ? 'Edit Policy' : 'Create New Policy'}</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Policy Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={policy.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={policy.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Coverage Amount ($)</Form.Label>
              <Form.Control
                type="number"
                name="coverageAmount"
                value={policy.coverageAmount}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Premium ($)</Form.Label>
              <Form.Control
                type="number"
                name="premium"
                value={policy.premium}
                onChange={handleChange}
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
                value={policy.duration}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Policy Type</Form.Label>
              <Form.Select
                name="policyType"
                value={policy.policyType}
                onChange={handleChange}
                required
              >
                <option value="life">Life Insurance</option>
                <option value="health">Health Insurance</option>
                <option value="auto">Auto Insurance</option>
                <option value="property">Property Insurance</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Active Policy"
            name="isActive"
            checked={policy.isActive}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              {' Saving...'}
            </>
          ) : id ? 'Update Policy' : 'Create Policy'}
        </Button>
      </Form>
    </div>
  );
};

export default PolicyForm;