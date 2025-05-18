// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav, Alert } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const AdminDashboard = () => {
  const { logout } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdminData(response.data);
      } catch (err) {
        setError('Failed to fetch admin data');
        console.error(err);
      }
    };
    
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!adminData) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Loading admin dashboard...</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-dark min-vh-100 p-0">
          <div className="p-3 text-white">
            <h4>Admin Panel</h4>
            <p className="text-muted">Welcome, {adminData.name}</p>
          </div>
          
          <Nav className="flex-column p-3">
            <Nav.Link as={Link} to="/admin/dashboard" className="text-white">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/advisors" className="text-white">
              Manage Advisors
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/policies" className="text-white">
              Manage Policies
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white">
              Manage Users
            </Nav.Link>
          </Nav>
        </Col>
        
        <Col md={10} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Dashboard</h2>
            <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;