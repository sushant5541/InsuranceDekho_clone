import React from 'react';
import './Footer.css';

const FooterLinks = ({ title, links }) => {
  return (
    <div className="footer-links-section">
      <div className="link-listing">
        <p className="footer-list-heading">{title}</p>
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                title={link.title}
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;