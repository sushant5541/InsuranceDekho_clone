import React, { useState } from 'react';

const RenewWithMobile = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (mobile.length === 10) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(generatedOtp);
      setOtpSent(true);
      alert(`OTP sent to ${mobile}: ${generatedOtp}`); // Replace with actual SMS logic
    } else {
      alert('Please enter a valid 10-digit mobile number.');
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.header}>
        <span style={styles.backArrow}>←</span>
        <img
          src="https://static.insurancedekho.com/pwa/img/v2_close.svg"
          alt="close"
          title="Close"
          style={styles.closeIcon}
        />
      </div>

      <div style={styles.title}>Renew With Mobile No</div>

      <div style={styles.inputWrapper}>
        <label htmlFor="renew_mobile" style={styles.label}>Mobile Number</label>
        <input
          id="renew_mobile"
          type="tel"
          name="mobile"
          maxLength="10"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={styles.input}
        />
      </div>

      <button type="button" onClick={handleSendOtp} style={styles.button}>
        Send OTP
      </button>

      <div style={styles.or}>------------- OR -------------</div>

      <a href="#" style={styles.link}>Renew With Policy Number</a>

      <div style={styles.terms}>
        By continuing I agree to <a href="#howItWork" style={styles.termsLink}><sup>*</sup>terms & conditions</a>
      </div>

      {otpSent && (
        <div style={styles.otpBox}>
          <strong>OTP:</strong> {otp}
        </div>
      )}
    </div>
  );
};

const styles = {
  modal: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    width: '300px',
    margin: '40px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    fontFamily: 'Arial',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: '20px',
    cursor: 'pointer',
  },
  closeIcon: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '15px 0',
  },
  inputWrapper: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  or: {
    textAlign: 'center',
    margin: '15px 0',
    color: '#999',
  },
  link: {
    display: 'block',
    textAlign: 'center',
    color: '#007bff',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginBottom: '15px',
  },
  terms: {
    fontSize: '12px',
    textAlign: 'center',
    color: '#666',
  },
  termsLink: {
    color: '#007bff',
    textDecoration: 'underline',
  },
  otpBox: {
    marginTop: '20px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '6px',
    border: '1px dashed #ccc',
  },
};

export default RenewWithMobile;
