import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PremiumDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [gender, setGender] = useState('Male');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    whatsAppOptIn: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, mobile } = formData;

    // Basic validation
    if (!name.trim() || !mobile.trim() || mobile.length !== 10 || isNaN(mobile)) {
      alert('Please enter a valid name and 10-digit mobile number.');
      return;
    }

    console.log('Form submitted:', formData);
    navigate('/health-quote');
  };

  if (!state?.plan) {
    return (
      <div>
        <p>
          No plan data available. Go back to{' '}
          <span onClick={() => navigate(-1)} style={{ color: 'blue', cursor: 'pointer' }}>
            plans
          </span>.
        </p>
      </div>
    );
  }

  const { plan } = state;

  return (
    <div style={styles.container}>
      <div style={styles.banner}>
        <img
          src="https://static.insurancedekho.com/pwa/img/v3_campaign_mobile_Health_insurance_new.webp"
          alt="Insurance Banner"
          style={styles.bannerImage}
        />
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>Save upto ₹75000* of Tax Benefits u/s 80D</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.genderSelector}>
            <button
              type="button"
              style={gender === 'Male' ? { ...styles.genderBtn, ...styles.activeGender } : styles.genderBtn}
              onClick={() => setGender('Male')}
            >
              Male
            </button>
            <button
              type="button"
              style={gender === 'Female' ? { ...styles.genderBtn, ...styles.activeGender } : styles.genderBtn}
              onClick={() => setGender('Female')}
            >
              Female
            </button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength="10"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="whatsAppOptIn"
                checked={formData.whatsAppOptIn}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Get Details on
              <img
                src="https://static.insurancedekho.com/pwa/img/newImages/whatsapp-gray.svg"
                alt="WhatsApp"
                style={styles.whatsappIcon}
              />
              WhatsApp
            </label>
          </div>

          <button type="submit" style={styles.submitBtn}>
            View Plans
            <img
              src="https://static.insurancedekho.com/pwa/img/arrow-animation.gif"
              alt="Arrow"
              style={styles.arrowIcon}
            />
          </button>

          <p style={styles.terms}>
            By clicking, I agree to <a href="/disclaimer" style={styles.link}>*terms & conditions</a> and
            <a href="/privacy-policy" style={styles.link}> privacy policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  banner: {
    width: '100%',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  content: {
    padding: '20px',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  genderSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  genderBtn: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'center',
  },
  activeGender: {
    backgroundColor: '#2a7fba',
    color: 'white',
    borderColor: '#2a7fba',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '14px',
    color: '#555',
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  checkboxGroup: {
    margin: '10px 0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  checkbox: {
    margin: '0',
  },
  whatsappIcon: {
    width: '20px',
    height: '20px',
  },
  submitBtn: {
    backgroundColor: '#2a7fba',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  arrowIcon: {
    width: '22px',
    height: '22px',
  },
  terms: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    marginTop: '10px',
  },
  link: {
    color: '#2a7fba',
    textDecoration: 'none',
    marginLeft: '4px',
  },
};

export default PremiumDetails;
