import React, { useState, useEffect } from 'react';
import { Table, Card, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const DashboardView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    const fetchUsersWithPolicies = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get('http://localhost:4000/api/admin/users-with-policies', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(response.data);
  } catch (err) {
    let errorMessage = 'Failed to fetch users data';
    
    if (err.response) {
      // The request was made and the server responded with a status code
      console.error('Server responded with:', err.response.status);
      errorMessage += ` (Status: ${err.response.status})`;
      
      if (err.response.data && err.response.data.message) {
        errorMessage += ` - ${err.response.data.message}`;
      }
    } else if (err.request) {
      // The request was made but no response was received
      console.error('No response received:', err.request);
      errorMessage += ' - No response from server';
    } else {
      // Something happened in setting up the request
      console.error('Request error:', err.message);
      errorMessage += ` - ${err.message}`;
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
    
    fetchUsersWithPolicies();
  }, []);

  const toggleUserExpansion = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header>
        <h4>Insurance Policy Users Dashboard</h4>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>User Details</th>
              <th>Contact</th>
              <th>Policy Summary</th>
              <th>Total Premium (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <React.Fragment key={user._id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <div className="fw-bold">{user.name}</div>
                    <div className="small text-muted">User ID: {user._id}</div>
                  </td>
                  <td>
                    <div>{user.email}</div>
                    <div>{user.phone || 'N/A'}</div>
                  </td>
                  <td>
                    {user.payments && user.payments.length > 0 ? (
                      <div>
                        {user.payments.length} policy{user.payments.length !== 1 ? 's' : ''}
                      </div>
                    ) : (
                      <Badge bg="secondary">No policies</Badge>
                    )}
                  </td>
                  <td className="fw-bold">
                    ₹{user.totalPremium || 0}
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => toggleUserExpansion(user._id)}
                    >
                      {expandedUser === user._id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </td>
                </tr>
                
                {expandedUser === user._id && (
                  <tr>
                    <td colSpan="6">
                      <div className="p-3 bg-light">
                        <h5>Policy Details</h5>
                        {user.payments && user.payments.length > 0 ? (
                          <Table bordered>
                            <thead>
                              <tr>
                                <th>Amount</th>
                                <th>Purchase Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.payments.map(payment => (
                                <tr key={payment._id}>
                        
                                  <td>₹{payment.amount / 100}</td>
                                  <td>
                                    {format(new Date(payment.createdAt), 'dd MMM yyyy hh:mm a')}
                                  </td>
                                  <td>
                                    <Badge bg={payment.policyIssued ? 'success' : 'warning'}>
                                      {payment.policyIssued ? 'Issued' : 'Processing'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <Alert variant="info">This user has no active policies</Alert>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default DashboardView;