import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/UserDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table, Card, Spinner, Badge, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [shouldPrint, setShouldPrint] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login', { state: { from: location.pathname } });
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user-policies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        if (response.data?.policies) {
          const formattedPayments = response.data.policies.map(payment => ({
            ...payment,
            amount: payment.amount / 100,
            planName: payment.planName || 'Unknown Plan',
            policyDetails: payment.policyDetails || {}
          }));

          setPayments(formattedPayments);
          
          if (location.state?.autoPrint && formattedPayments.length > 0) {
            setExpandedPayment(formattedPayments[0]._id);
            setShouldPrint(true);
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Payment fetch error:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate, location]);

  useEffect(() => {
    if (shouldPrint && expandedPayment) {
      const timer = setTimeout(() => {
        window.print();
        setShouldPrint(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldPrint, expandedPayment]);

  const togglePaymentExpansion = (paymentId) => {
    setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
  };

  const handleDeletePayment = async (paymentId) => {
    const isCreatedPolicy = payments.find(p => p._id === paymentId)?.status === 'created';
    const confirmMessage = isCreatedPolicy 
      ? 'Are you sure you want to cancel this policy application?'
      : 'Are you sure you want to cancel this active policy?';

    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/payments/${paymentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPayments(prev => prev.filter(payment => payment._id !== paymentId));
        alert(`Policy ${isCreatedPolicy ? 'application' : ''} cancelled successfully`);
      }
    } catch (error) {
      console.error('Error cancelling policy:', error);
      alert(`Failed to cancel policy: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleClaimPolicy = (policy) => {
    let productPage = '/';
    switch (policy.planType?.toLowerCase()) {
      case 'health':
        productPage = '/health-insurance';
        break;
      case 'car':
        productPage = '/car-insurance';
        break;
      case 'bike':
        productPage = '/bike-insurance';
        break;
      case 'life':
        productPage = '/life-insurance';
        break;
      default:
        productPage = '/';
    }

    navigate(productPage, {
      state: {
        prefillPolicy: policy,
        fromClaim: true
      }
    });
  };

  const handlePrintPolicy = (payment) => {
    const printContent = `
      <html>
        <head>
          <title>Policy Details - ${payment._id}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            .print-header { text-align: center; margin-bottom: 20px; }
            .policy-section { margin-bottom: 15px; }
            .section-title { font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .detail-row { display: flex; margin-bottom: 8px; }
            .detail-label { font-weight: bold; min-width: 150px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <img src="https://static.insurancedekho.com/pwa/img/id-main-logo.svg" alt="InsuranceDekho" height="40">
            <h2>Policy Document</h2>
          </div>
          
          <div class="policy-section">
            <div class="section-title">Policy Information</div>
            <div class="detail-row">
              <span class="detail-label">Policy Holder:</span>
              <span>${user?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Policy ID:</span>
              <span>${payment._id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Plan Type:</span>
              <span>${payment.planType?.toUpperCase() || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Purchase Date:</span>
              <span>${payment.createdAt ? format(new Date(payment.createdAt), 'PPPpp') : 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span>${payment.status?.toUpperCase() || 'UNKNOWN'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount Paid:</span>
              <span>₹${payment.amount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          
          ${payment.policyDetails ? `
          <div class="policy-section">
            <div class="section-title">Coverage Details</div>
            ${payment.policyDetails.insurer ? `
            <div class="detail-row">
              <span class="detail-label">Insurer:</span>
              <span>${payment.policyDetails.insurer}</span>
            </div>` : ''}
            ${payment.policyDetails.coverageAmount ? `
            <div class="detail-row">
              <span class="detail-label">Coverage Amount:</span>
              <span>₹${payment.policyDetails.coverageAmount}</span>
            </div>` : ''}
            ${payment.policyDetails.cashlessHospitals ? `
            <div class="detail-row">
              <span class="detail-label">Cashless Hospitals:</span>
              <span>${payment.policyDetails.cashlessHospitals}</span>
            </div>` : ''}
            ${payment.policyDetails.cashlessGarages ? `
            <div class="detail-row">
              <span class="detail-label">Cashless Garages:</span>
              <span>${payment.policyDetails.cashlessGarages}</span>
            </div>` : ''}
          </div>
          ` : ''}
          
          <div class="footer">
            <p>This document was generated on ${new Date().toLocaleDateString()}</p>
            <p>For any queries, please contact our customer support</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'captured':
      case 'active': return 'success';
      case 'created':
      case 'pending': return 'warning';
      case 'failed':
      case 'cancelled': return 'danger';
      case 'refunded':
      case 'expired': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="app-content">
      <div className="my-account-body my-account-v2">
        <div className="my-account-wrap">
          <div className="my-account-board">
            <div className="my-overview" id="overview">
              <div className="card-v2 radius-6 bottom-20 my-account-card profile-card">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="profile-info">
                    <h4>{user?.name || 'User'}</h4>
                    <p className="text-muted mb-0">{user?.email || ''}</p>
                  </div>
                  {location.state?.success && (
                    <div className="alert alert-success mb-0">
                      {location.state.success}
                    </div>
                  )}
                  <button
                    className="edit-btn"
                    onClick={() => navigate('/edit-profile')}
                  >
                    <img
                      src="https://static.insurancedekho.com/pwa/img/myaccount/editicon.svg"
                      alt="Edit"
                      width="16"
                      height="16"
                    />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {error ? (
              <div className="alert alert-danger">
                {error}
                <button
                  className="btn btn-sm btn-outline-secondary ml-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading your payment history...</p>
              </div>
            ) : payments.length > 0 ? (
              <Card className="mt-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4>Your Insurance Policies</h4>
                    <p className="text-muted mb-0">
                      Total Premium Paid: ₹{payments.reduce((sum, payment) => sum + (payment.amount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handlePrintPolicy(payments[0])}
                    className="no-print"
                  >
                    Print All Policies
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Policy Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, index) => (
                        <React.Fragment key={payment._id}>
                          <tr>
                            <td>{index + 1}</td>
                            <td className="text-capitalize">{payment.planType || 'N/A'}</td>
                            <td>₹{(payment.amount || 0).toFixed(2)}</td>
                            <td>{payment.createdAt ? format(new Date(payment.createdAt), 'dd MMM yyyy') : 'N/A'}</td>
                            <td>
                              <Badge bg={getStatusBadge(payment.status)}>
                                {payment.status?.toUpperCase() || 'UNKNOWN'}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => togglePaymentExpansion(payment._id)}
                                className="me-2"
                              >
                                {expandedPayment === payment._id ? 'Hide' : 'Details'}
                              </Button>
                              
                              {/* Action buttons for created policies */}
                              {payment.status === 'created' && (
                                <>
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => handleClaimPolicy(payment)}
                                    className="me-2"
                                  >
                                    Claim
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeletePayment(payment._id)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              
                              {/* Cancel button for active policies */}
                              {payment.status === 'captured' && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeletePayment(payment._id)}
                                >
                                  Cancel Policy
                                </Button>
                              )}
                            </td>
                          </tr>

                          {expandedPayment === payment._id && (
                            <tr>
                              <td colSpan="6">
                                <div className="p-3 bg-light">
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Policy Details</h5>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => handlePrintPolicy(payment)}
                                      className="no-print"
                                    >
                                      Print Policy
                                    </Button>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-6">
                                      <p><strong>Policy ID:</strong> {payment._id}</p>
                                      <p><strong>Payment ID:</strong> {payment.razorpayPaymentId || 'N/A'}</p>
                                      <p><strong>Plan Type:</strong> {payment.planType?.toUpperCase() || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                      <p><strong>Purchase Date:</strong> {payment.createdAt ? format(new Date(payment.createdAt), 'PPPpp') : 'N/A'}</p>
                                      <p><strong>Status:</strong> <Badge bg={getStatusBadge(payment.status)}>{payment.status?.toUpperCase() || 'UNKNOWN'}</Badge></p>
                                    </div>
                                  </div>

                                  {payment.policyDetails && (
                                    <>
                                      <hr />
                                      <h6>Coverage Details</h6>
                                      <div className="row">
                                        <div className="col-md-6">
                                          {payment.policyDetails.insurer && <p><strong>Insurer:</strong> {payment.policyDetails.insurer}</p>}
                                          {payment.policyDetails.coverageAmount && <p><strong>Coverage Amount:</strong> ₹{payment.policyDetails.coverageAmount}</p>}
                                        </div>
                                        <div className="col-md-6">
                                          {payment.policyDetails.cashlessHospitals && <p><strong>Cashless Hospitals:</strong> {payment.policyDetails.cashlessHospitals}</p>}
                                          {payment.policyDetails.cashlessGarages && <p><strong>Cashless Garages:</strong> {payment.policyDetails.cashlessGarages}</p>}
                                        </div>
                                      </div>
                                    </>
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
            ) : (
              <div className="no-policy-found text-center py-5">
                <img
                  src="/pwa/img/myaccount/img_empty_policy.svg"
                  alt="No policies"
                  className="empty-policy-img mb-4"
                  style={{ maxWidth: '200px' }}
                />
                <h3 className="mb-3">No Policies Found</h3>
                <p className="text-muted mb-4">
                  You don't have any active insurance policies yet.
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/')}
                >
                  Try Us
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;