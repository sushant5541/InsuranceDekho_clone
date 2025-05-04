import React from 'react';
import '../../styles/AddOnsSection.css';


const AddOnsSection = ({ addOns }) => {
  if (!addOns || addOns.length === 0) {
    return (
      <section className="addons-section">
        <div className="container">
          <p>No add-ons currently available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="addons-section">
      <div className="container">
        <h2>Car Insurance Add-ons</h2>
        <p className="subtext">
          Add-ons are optional extra benefits which can be added to your policy to extend the coverage.
        </p>
        
        <div className="addons-grid">
          {addOns.map(addOn => (
            <div key={addOn._id} className="addon-card">
              <div className="addon-header">
                {addOn.icon && (
                  <img src={addOn.icon} alt={addOn.name} />
                )}
                <h3>{addOn.name}</h3>
              </div>
              <p>{addOn.description}</p>
              <div className="addon-price">+ ₹{addOn.price}</div>
              {addOn.benefits?.length > 0 && (
                <ul className="addon-benefits">
                  {addOn.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddOnsSection;