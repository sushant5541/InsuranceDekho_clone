// src/components/admin/UserEditForm.js
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const UserEditForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile || '',
    gender: user.gender || '',
    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    isActive: user.isActive
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }
    onSave(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Gender</Form.Label>
        <Form.Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="switch"
          id="isActive"
          label="Account Active"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </div>
    </Form>
  );
};

export default UserEditForm;