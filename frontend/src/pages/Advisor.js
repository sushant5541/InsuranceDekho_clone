import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Badge, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Advisor.css';
const api = axios.create({
    baseURL: 'http://insurance-backend:4000/api',
});

const AdvisorsPage = () => {
    const { user } = useAuth();
    const [advisors, setAdvisors] = useState([]);
    const [filteredAdvisors, setFilteredAdvisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cities, setCities] = useState([]);
    const [filters, setFilters] = useState({
        city: '',
        specialization: '',
        experience: ''
    });
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);
    const [appointmentForm, setAppointmentForm] = useState({
        name: user?.name || '',
        mobile: user?.mobile || '',
        gender: 'Male',
        address: '',
        city: '',
        pincode: '',
        whatsAppOptIn: true
    });
    // Add request interceptor to include token
    api.interceptors.request.use(config => {
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const res = await api.get('/advisors');
                setAdvisors(res.data);
                setFilteredAdvisors(res.data);

                // Extract unique cities
                const uniqueCities = [...new Set(res.data.map(advisor => advisor.City))];
                setCities(uniqueCities);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch advisors');
                if (err.response?.status === 401) {
                    console.error('Authentication error:', err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAdvisors();
    }, [user?.token]);

    useEffect(() => {
        // Apply filters whenever filters or advisors change
        let result = [...advisors];

        if (filters.city) {
            result = result.filter(advisor =>
                advisor.City.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.specialization) {
            result = result.filter(advisor =>
                advisor.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
            );
        }

        if (filters.experience) {
            const minExp = parseInt(filters.experience);
            result = result.filter(advisor =>
                advisor.yearsOfExperience >= minExp
            );
        }

        setFilteredAdvisors(result);
    }, [filters, advisors]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            city: '',
            specialization: '',
            experience: ''
        });
    };

    const handleBookAppointment = (advisor) => {
        setSelectedAdvisor(advisor);
        setShowAppointmentModal(true);
    };

    const handleAppointmentFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAppointmentForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGenderSelect = (gender) => {
        setAppointmentForm(prev => ({
            ...prev,
            gender
        }));
    };

    const handleSubmitAppointment = async () => {
        try {
            // Validate required fields
            if (!appointmentForm.name || !appointmentForm.mobile || !appointmentForm.address ||
                !appointmentForm.city || !appointmentForm.pincode) {
                setError('Please fill all required fields');
                return;
            }

            // Validate mobile number format (10 digits)
            if (!/^\d{10}$/.test(appointmentForm.mobile)) {
                setError('Please enter a valid 10-digit mobile number');
                return;
            }

            // Validate pincode (6 digits)
            if (!/^\d{6}$/.test(appointmentForm.pincode)) {
                setError('Please enter a valid 6-digit pincode');
                return;
            }

            const payload = {
                ...appointmentForm,
                advisorId: selectedAdvisor._id,
                userId: user?._id || null
            };

            await api.post('/appointments', payload);
            setShowAppointmentModal(false);
            alert('Home visit scheduled successfully!');

            // Reset form after successful submission
            setAppointmentForm({
                name: user?.name || '',
                mobile: user?.mobile || '',
                gender: 'Male',
                address: '',
                city: '',
                pincode: '',
                whatsAppOptIn: true
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to schedule home visit');
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <div className="advisors-page">
            <h2 className="mb-4">Find an Insurance Advisor</h2>

            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            {/* Filter Section */}
            <Card className="mb-4">
                <Card.Body>
                    <h5>Filter Advisors</h5>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Select
                                    name="city"
                                    value={filters.city}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Cities</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Specialization</Form.Label>
                                <Form.Select
                                    name="specialization"
                                    value={filters.specialization}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Specializations</option>
                                    <option value="Health Insurance">Health Insurance</option>
                                    <option value="Life Insurance">Life Insurance</option>
                                    <option value="Car Insurance">Car Insurance</option>
                                    <option value="Bike Insurance">Bike Insurance</option>
                                    <option value="Term Insurance">Term Insurance</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Min Experience (years)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="experience"
                                    min="0"
                                    value={filters.experience}
                                    onChange={handleFilterChange}
                                    placeholder="Any experience"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={1} className="d-flex align-items-end">
                            <Button
                                variant="outline-secondary"
                                onClick={resetFilters}
                                className="mb-3"
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Results Count */}
            <div className="mb-3">
                Showing {filteredAdvisors.length} of {advisors.length} advisors
            </div>

            {/* Advisors List */}
            <Row>
                {filteredAdvisors.length > 0 ? (
                    filteredAdvisors.map(advisor => (
                        <Col key={advisor._id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={advisor.profilePhoto}
                                            alt={advisor.name}
                                            className="rounded-circle me-3"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h5>{advisor.name}</h5>
                                            <Badge bg={advisor.isActive ? 'success' : 'secondary'}>
                                                {advisor.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Specialization:</strong> {advisor.specialization}
                                    </div>
                                    <div className="mb-2">
                                        <strong>City:</strong> {advisor.City}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Experience:</strong> {advisor.yearsOfExperience} years
                                    </div>
                                    <div className="d-flex justify-content-between mt-3">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleBookAppointment(advisor)}
                                        >
                                            Book Home Appointment
                                        </Button>
                                        <Button variant="outline-primary" size="sm">
                                            Contact
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">
                            No advisors found matching your criteria. Try adjusting your filters.
                        </Alert>
                    </Col>
                )}
            </Row>

            {/* Appointment Booking Modal */}
            <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Book Home Visit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="ScheduleVisitJourney">
                        <div className="EnterPersonalDetails">
                            <div className="stepper mb-3">
                                <p>Step <span className="steps">1/3</span></p>
                            </div>

                            <div className="text-center mb-4">
                                <img
                                    src="https://static.insurancedekho.com/pwa/img/user-blue.svg"
                                    alt="user"
                                    style={{ width: '60px', height: '60px' }}
                                />
                                <h4 className="mt-2">Get a Free Home Visit with {selectedAdvisor?.name}</h4>
                                <p className="text-muted">Your personal information is secure with us</p>
                            </div>

                            <div className="d-flex justify-content-center mb-4">
                                <Button
                                    variant={appointmentForm.gender === 'Male' ? 'primary' : 'outline-primary'}
                                    className="me-2"
                                    onClick={() => handleGenderSelect('Male')}
                                >
                                    Male
                                </Button>
                                <Button
                                    variant={appointmentForm.gender === 'Female' ? 'primary' : 'outline-primary'}
                                    onClick={() => handleGenderSelect('Female')}
                                >
                                    Female
                                </Button>
                            </div>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={appointmentForm.name}
                                        onChange={handleAppointmentFormChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Form.Label>Mobile Number <span className="text-danger">*</span></Form.Label>
                                        {user?.mobile && (
                                            <Button variant="link" size="sm" className="p-0">
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                    <Form.Control
                                        type="tel"
                                        name="mobile"
                                        value={appointmentForm.mobile}
                                        onChange={handleAppointmentFormChange}
                                        placeholder="Enter 10-digit mobile number"
                                        disabled={!!user?.mobile}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="address"
                                        value={appointmentForm.address}
                                        onChange={handleAppointmentFormChange}
                                        placeholder="Enter your complete address"
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>City <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                value={appointmentForm.city}
                                                onChange={handleAppointmentFormChange}
                                                placeholder="Enter your city"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Pincode <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pincode"
                                                value={appointmentForm.pincode}
                                                onChange={handleAppointmentFormChange}
                                                placeholder="Enter 6-digit pincode"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="mt-4">
                                    <Form.Check
                                        type="checkbox"
                                        label={
                                            <span>
                                                Get Details on <img
                                                    src="https://static.insurancedekho.com/pwa/img/newImages/whatsapp-gray.svg"
                                                    alt="WhatsApp"
                                                    style={{ width: '20px', height: '20px', marginLeft: '5px' }}
                                                /> WhatsApp
                                            </span>
                                        }
                                        name="whatsAppOptIn"
                                        checked={appointmentForm.whatsAppOptIn}
                                        onChange={handleAppointmentFormChange}
                                    />
                                </div>
                            </Form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitAppointment}>
                        Schedule Home Visit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdvisorsPage;