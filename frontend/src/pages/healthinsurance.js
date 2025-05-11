
import React, { useState, useEffect } from 'react';
import '../styles/HealthInsurance.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 



const HealthInsurance = () => {
 const { user } = useAuth();

    const plans = [
        {
            name: "Care Supreme Discounted",
            company: "Care Health Insurance Limited",
            logo: "https://healthstatic.insurancedekho.com/prod/oem_image/1598957797.jpg",
            coverage: "5 Lakh",
            price: "615/month",
            features: ["No room rent limit", "Unlimited restoration benefits"]
        },
        {
            name: "Reassure 2.0 Titanium+ (Direct)",
            company: "MaxBupa",
            logo: "https://healthstatic.insurancedekho.com/prod/oem_image/20211022184151.png",
            coverage: "5 Lakh",
            price: "628/month",
            features: ["No room rent limit", "100% no claim bonus"]
        },
        {
            name: "Comprehensive Individual",
            company: "MaxBupa",
            logo: "https://healthstatic.insurancedekho.com/prod/oem_image/1589437596.jpg",
            coverage: "5 Lakh",
            price: "628/month",
            features: ["No room rent limit", "100% no claim bonus"]
        }

    ];

    const benefits = [
        {
            title: "Financial Security",
            description: "A health insurance policy can free you and your family from the financial burden that comes with a medical emergency.",
            icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004073_b45536e7a3.svg"
        },
        {
            title: "Peace of Mind",
            description: "Once you and your loved ones are covered under a health insurance plan, you will have peace of mind and can focus on getting the right treatment stress-free.",
            icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004074_e922d34238.svg?updated_at=2024-10-28T08:58:00.279Z"
        },
        {
            title: "Financial Security",
            description: "A health insurance policy can free you and your family from the financial burden that comes with a medical emergency.",
            icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004075_02d44e54a1.svg?updated_at=2024-10-28T08:58:01.331Z"
        },
        // Add more benefits as needed
    ];

    const features = [
        {
            title: "Covers pre- and post- hospitalisation charges",
            description: "A health insurance policy covers your medical expenses end-to-end.",
            icon: "https://staticimg.insurancedekho.com/strapi/Icons_Variable_a72bfa6d73.svg"
        },
        // Add more features as needed
    ];

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Initialize form data with user details if logged in
    const [formData, setFormData] = useState({
         name: user?.name || '',
        mobile: user?.mobile || '',
        gender: 'Male',
        address: '',
        city: '',
        pincode: '',
        whatsAppOptIn: true
    });

    const [errors, setErrors] = useState({});

    // Auto-fill form when user is logged in
    useEffect(() => {
        if (currentUser) {
            setFormData({
                gender: currentUser.gender || 'male',
                name: currentUser.name || '',
                mobile: currentUser.phoneNumber || currentUser.mobile || '',
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Invalid mobile number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        navigate('/health-quote', { 
            state: { 
                formData,
                user: currentUser // Pass the entire user object if needed
            } 
        });
    };

    const members = ['You'];
    const coverageOptions = [
        { label: '5 Lac', value: 500000 },
        { label: '10 Lac', value: 1000000 },
        { label: '25 Lac', value: 2500000 }
    ];

    //calculator
    const [selectedMember, setSelectedMember] = useState('You');
    const [age, setAge] = useState('');
    const [pincode, setPincode] = useState('');
    const [coverage, setCoverage] = useState(500000);
    const [error, setError] = useState('');

    const handleCalculate = () => {
        if (!age || !pincode) {
            setError('Please enter all required fields.');
            return;
        }
        setError('');
        alert(`Calculating price for:
      Member: ${selectedMember},
      Age: ${age},
      Pincode: ${pincode},
      Coverage: ₹${coverage.toLocaleString()}
    `);
    };

    return (
        <>
            <div className="health-insurance-page">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container" style={{ maxWidth: "100%" }}>
                        <div className="hero-content">
                            <h1>Buy Health Insurance Plans and Policies Online</h1>
                            <p>A health or medical insurance policy covers your medical expenses for illnesses and injuries including hospitalisation, daycare procedures, ambulance charges, medical care at home, medicine costs, and more.</p>

                            <div className="key-features">
                                <h3>Key Highlights</h3>
                                <div className="features-grid">
                                    <div className="feature-item">
                                        <img src="https://staticimg.insurancedekho.com/strapi/Group_1000004038_797ae83ff3.svg" alt="Plans" />
                                        <p className="feature-title">Wide range of Plans & Companies</p>
                                        <p className="feature-sub">(134 Plans and 22 Companies)</p>
                                    </div>
                                    <div className="feature-item">
                                        <img src="https://staticimg.insurancedekho.com/strapi/Group_1000004106_722ee3c5ae.svg?updated_at=2024-10-28T08:55:03.581Z" alt="Plans" />
                                        <p className="feature-title">alt="24 x 7 Claim Support </p>
                                        <p className="feature-sub">(We are there for the time of your need to support in claim processing)*"</p>
                                    </div>
                                    {/* Add more feature items */}
                                </div>
                            </div>
                        </div>

                        <div className="quote-form">
                            <div className="form-header">
                                <div className="offer-tag">
                                    <img src="https://static.insurancedekho.com/pwa/img/offerImg.svg" alt="Offer" />
                                    <span>Get Online Discount upto <strong>25% off*</strong></span>
                                </div>
                                <p>Buy Health Plans from <strong>Rs. 10/day*</strong></p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === 'male'}
                                            onChange={handleChange}
                                        />
                                        <span>Male</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === 'female'}
                                            onChange={handleChange}
                                        />
                                        <span>Female</span>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={errors.name ? 'error-input' : ''}
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="Mobile Number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className={errors.mobile ? 'error-input' : ''}
                                    />
                                    {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                                </div>

                                <button type="submit" className="submit-btn">
                                    View Plans
                                </button>

                                <p className="terms">
                                    By clicking, I agree to <a href="/terms">terms & conditions</a> and <a href="/privacy">privacy policy</a>.
                                </p>
                                <p className="terms">
                                    <Link to="/Renew">Renew Now </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Best Plans Section */}
                <section className="plans-section">
                    <div className="container">
                        <h2>Best Health Insurance Plans In India</h2>

                        <div className="plans-grid">
                            {plans.map((plan, index) => (
                                <div key={index} className="plan-card">
                                    <div className="plan-content">
                                        <div className="plan-header">
                                            <img src={plan.logo} alt={plan.name} />
                                            <div>
                                                <h3>{plan.name}</h3>
                                                <p>{plan.company}</p>
                                            </div>
                                        </div>

                                        <div className="plan-details">
                                            <div>
                                                <p>Cover Amount</p>
                                                <p className="bold">{plan.coverage}</p>
                                            </div>
                                            <div>
                                                <p>Starting at</p>
                                                <p className="bold">{plan.price}</p>
                                            </div>
                                        </div>

                                        <div className="plan-features">
                                            <ul>
                                                {plan.features.map((feature, i) => (
                                                    <li key={i}>
                                                        <span className="tick">✓</span> {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <button
                                        className="check-premium-btn"
                                        onClick={() => navigate('/check-premium', { state: { plan } })}
                                    >
                                        Check Premium <span>→</span>
                                    </button>

                                </div>

                            ))}


                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="benefits-section">
                    <div className="container">
                        <h2>Significance of having a health insurance policy</h2>
                        <p className="subtitle">Following are some significant benefits of a comprehensive health insurance plan</p>

                        <div className="benefits-grid">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="benefit-card">
                                    <img src={benefit.icon} alt={benefit.title} />
                                    <h3>{benefit.title}</h3>
                                    <p>{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Calculator Section */}
                <section className="health-wrapper" id="calculator">
                    <h2>Health Insurance Calculator</h2>

                    <div className="calculator-card">
                        <h3>Whom do you want the insurance for?</h3>
                        <div className="members-list">
                            {members.map((member) => (
                                <div
                                    key={member}
                                    className={`member-tag ${selectedMember === member ? 'active' : ''}`}
                                    onClick={() => setSelectedMember(member)}
                                >
                                    {member}
                                </div>
                            ))}
                        </div>

                        <div className="input-group">
                            <label htmlFor="age">Enter Your Age</label>
                            <input
                                id="age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="pincode">Enter Area Pincode</label>
                            <input
                                id="pincode"
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                        </div>

                        <h3>Choose required coverage for your family</h3>
                        <div className="coverage-options">
                            {coverageOptions.map((opt) => (
                                <label key={opt.value} className="coverage-option">
                                    <input
                                        type="radio"
                                        name="coverage"
                                        value={opt.value}
                                        checked={coverage === opt.value}
                                        onChange={() => setCoverage(opt.value)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {error && <div className="error">{error}</div>}

                        <button className="calculate-btn" onClick={handleCalculate}>
                            Calculate Price
                        </button>

                        <p className="disclaimer">
                            <strong>Disclaimer:</strong> Actual Premium might vary based on your location, age and number of members.
                        </p>
                    </div>
                </section>


                {/* Features Section */}
            </div>
        </>
    );
};


export default HealthInsurance;