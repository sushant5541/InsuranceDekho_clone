import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Badge, Col, Row, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PolicyManagement = () => {
  const { isAdmin, token } = useAuth();
  const [healthPlans, setHealthPlans] = useState([]);
  const [carPlans, setCarPlans] = useState([]);
  const [bikePlans, setBikePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [activeTab, setActiveTab] = useState('health');
  
  const initialFormData = {
    name: '',
    description: '',
    coverageAmount: '',
    premium: '',
    insurer: '',
    logo: '',
    cashlessFacilities: '',
    claimSettled: '',
    features: [],
    addons: 0,
    discount: '',
    planType: 'Comprehensive',
    isActive: true,
    itemType: 'health'
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [healthRes, carRes, bikeRes] = await Promise.all([
          api.get('/insurance/health-plans'),
          api.get('/insurance/car-plans'), 
          api.get('/insurance/bike-plans')
        ]);
        
        setHealthPlans(healthRes.data.plans || healthRes.data || []);
        
        const processedCarPlans = (carRes.data.plans || carRes.data || []).map(plan => ({
          ...plan,
          displayName: `${plan.insurer} ${plan.planName}`
        }));
        setCarPlans(processedCarPlans);
        
        const processedBikePlans = (bikeRes.data.plans || bikeRes.data || []).map(plan => ({
          ...plan,
          displayName: `${plan.insurer} ${plan.planName}`
        }));
        setBikePlans(processedBikePlans);
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (item, type) => {
    setCurrentItem(item);
    setFormData({
      ...initialFormData,
      itemType: type,
      name: type === 'health' ? item.planName : `${item.insurer} ${item.planName}`,
      description: type === 'health' ? item.features.join(', ') : item.keyFeatures.join(', '),
      coverageAmount: type === 'health' ? item.coverAmount.replace(/[^0-9]/g, '') : 
                    item.coverageAmount.replace(/[^0-9]/g, ''),
      premium: type === 'health' ? item.yearlyPremium.replace(/[^0-9]/g, '') : 
              item.price.replace(/[^0-9]/g, ''),
      isActive: item.isActive !== false,
      insurer: item.insurer,
      logo: item.logo,
      cashlessFacilities: type === 'health' ? item.cashlessHospitals : item.cashlessGarages,
      claimSettled: item.claimSettled,
      features: item.features,
      addons: type === 'health' ? item.addons || 0 : 0,
      discount: item.discount || '',
      planType: item.planType || 'Comprehensive'
    });
    setShowModal(true);
  };

  const handleAddNewPlan = () => {
    setCurrentItem(null);
    setFormData({
      ...initialFormData,
      itemType: activeTab, // Set the itemType based on the active tab
      planType: activeTab === 'health' ? 'Comprehensive' : 'Comprehensive' // Default plan type
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      const basePayload = {
        insurer: formData.insurer,
        logo: formData.logo,
        claimSettled: formData.claimSettled,
        features: formData.description.split(', ').map(f => f.trim()),
        discount: formData.discount,
        isActive: formData.isActive
      };

      if (formData.itemType === 'health') {
        const payload = {
          ...basePayload,
          planName: formData.name,
          coverAmount: `₹${formData.coverageAmount}`,
          cashlessHospitals: Number(formData.cashlessFacilities),
          addons: Number(formData.addons),
          monthlyPremium: `₹${Math.round(Number(formData.premium) / 12)}`,
          yearlyPremium: `₹${formData.premium}`
        };

        const endpoint = currentItem ? 
          `/insurance/health-plans/${currentItem._id}` : '/insurance/health-plans';
        const method = currentItem ? 'put' : 'post';

        response = await api[method](endpoint, payload);
        setHealthPlans(currentItem ? 
          healthPlans.map(p => p._id === response.data._id ? response.data : p) : 
          [...healthPlans, response.data]);
      }
      else if (formData.itemType === 'car' || formData.itemType === 'bike') {
        // Extract insurer from the name (first word) and planName (the rest)
        const nameParts = formData.name.split(' ');
        const insurer = nameParts[0];
        const planName = nameParts.slice(1).join(' ');

        const payload = {
          ...basePayload,
          insurer,
          planName,
          coverageAmount: `₹${formData.coverageAmount}`,
          cashlessGarages: Number(formData.cashlessFacilities),
          price: `₹${formData.premium}`,
          planType: formData.planType,
          keyFeatures: formData.description.split(', ').map(f => f.trim())
        };

        const endpoint = `/insurance/${formData.itemType}-plans` + 
                         (currentItem ? `/${currentItem._id}` : '');
        const method = currentItem ? 'put' : 'post';
        
        response = await api[method](endpoint, payload);
        
        // Update the formatted plans
        const updatedPlan = {
          ...response.data,
          displayName: `${response.data.insurer} ${response.data.planName}`
        };

        if (formData.itemType === 'car') {
          setCarPlans(currentItem ? 
            carPlans.map(p => p._id === updatedPlan._id ? updatedPlan : p) : 
            [...carPlans, updatedPlan]);
        } else {
          setBikePlans(currentItem ? 
            bikePlans.map(p => p._id === updatedPlan._id ? updatedPlan : p) : 
            [...bikePlans, updatedPlan]);
        }
      }
      
      setShowModal(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        let endpoint;
        switch(type) {
          case 'health':
            endpoint = `/insurance/health-plans/${id}`;
            await api.delete(endpoint);
            setHealthPlans(healthPlans.filter(p => p._id !== id));
            break;
          case 'car':
            endpoint = `/insurance/car-plans/${id}`;
            await api.delete(endpoint);
            setCarPlans(carPlans.filter(p => p._id !== id));
            break;
          case 'bike':
            endpoint = `/insurance/bike-plans/${id}`;
            await api.delete(endpoint);
            setBikePlans(bikePlans.filter(p => p._id !== id));
            break;
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  const renderTable = (items, type) => {
    if (loading) return <Spinner animation="border" />;
    if (!items || items.length === 0) return <p>No {type} plans found</p>;

    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Insurer</th>
            <th>Coverage</th>
            <th>Premium</th>
            {type === 'health' && <th>Addons</th>}
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>
                {type === 'health' ? item.planName : 
                 item.displayName || `${item.insurer} ${item.planName}`}
              </td>
              <td>
                <Badge bg={
                  type === 'health' ? 'info' : 
                  type === 'car' ? 'warning' : 'success'
                }>
                  {type === 'health' ? 'Health' : item.planType}
                </Badge>
              </td>
              <td>{item.insurer}</td>
              <td>
                {type === 'health' ? item.coverAmount : item.coverageAmount}
              </td>
              <td>
                {type === 'health' ? item.yearlyPremium : item.price}
              </td>
              {type === 'health' && <td>{item.addons || 0}</td>}
              <td>
                <Badge bg={item.isActive !== false ? 'success' : 'secondary'}>
                  {item.isActive !== false ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              {isAdmin && (
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEditClick(item, type)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(item._id, type)}
                  >
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="policy-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Insurance Plan Management</h2>
        {isAdmin && (
          <Button variant="primary" onClick={handleAddNewPlan}>
            Add New Plan
          </Button>
        )}
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="health" title="Health Plans">
          {renderTable(healthPlans, 'health')}
        </Tab>
        <Tab eventKey="car" title="Car Insurance">
          {renderTable(carPlans, 'car')}
        </Tab>
        <Tab eventKey="bike" title="Bike Insurance">
          {renderTable(bikePlans, 'bike')}
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentItem ? `Edit ${formData.itemType === 'health' ? 'Health Plan' : formData.itemType === 'car' ? 'Car Plan' : 'Bike Plan'}` : 
             `Add New ${formData.itemType === 'health' ? 'Health Plan' : formData.itemType === 'car' ? 'Car Plan' : 'Bike Plan'}`}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={formData.itemType === 'health' ? 12 : 6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {formData.itemType === 'health' ? 'Plan Name' : 'Plan Name (Format: "Insurer PlanName")'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder={formData.itemType === 'health' ? 'Enter plan name' : 'E.g., ICICI Comprehensive Cover'}
                  />
                </Form.Group>
              </Col>
              {formData.itemType !== 'health' && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Plan Type</Form.Label>
                    <Form.Select
                      name="planType"
                      value={formData.planType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Comprehensive">Comprehensive</option>
                      <option value="Third Party">Third Party</option>
                      <option value="Own Damage">Own Damage</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
            </Row>

            {formData.itemType === 'health' && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Insurer</Form.Label>
                    <Form.Control
                      type="text"
                      name="insurer"
                      value={formData.insurer}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Addons Count</Form.Label>
                    <Form.Control
                      type="number"
                      name="addons"
                      value={formData.addons}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Key Features</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter comma-separated features"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {formData.itemType === 'health' ? 'Cover Amount (₹)' : 'Coverage Amount (₹)'}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="coverageAmount"
                    value={formData.coverageAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {formData.itemType === 'health' ? 'Yearly Premium (₹)' : 'Price (₹)'}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="premium"
                    value={formData.premium}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {formData.itemType === 'health' ? 'Cashless Hospitals' : 'Cashless Garages'}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="cashlessFacilities"
                    value={formData.cashlessFacilities}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Claim Settlement Rate</Form.Label>
                  <Form.Control
                    type="text"
                    name="claimSettled"
                    value={formData.claimSettled}
                    onChange={handleInputChange}
                    required
                    placeholder="E.g., 98%"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Logo URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    required
                    placeholder="https://example.com/logo.png"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Offer</Form.Label>
                  <Form.Control
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="E.g., 10% off for first year"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="isActive"
                label="Active Plan"
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
              {currentItem ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PolicyManagement;