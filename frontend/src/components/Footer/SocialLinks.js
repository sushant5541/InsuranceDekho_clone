import React from 'react';
import './Footer.css';

const socialLinks = [
  { icon: "https://www.insurancedekho.com/pwa/img/social-facebook.svg", url: "", title: "Facebook" },
  { icon: "https://www.insurancedekho.com/pwa/img/social-youtube.svg", url: "", title: "Youtube" },
  { icon: "https://www.insurancedekho.com/pwa/img/social-insta.svg", url: "", title: "Instagram" },
  { icon: "https://www.insurancedekho.com/pwa/img/social-linkedin.svg", url: "", title: "Linkedin" },
  { icon: "https://www.insurancedekho.com/pwa/img/v2_tw.svg", url: "", title: "Twitter" }
];

const SocialLinks = () => {
  return (
    <div className="footer-social-links">
      {socialLinks.map((link, index) => (
        <a 
          key={index}
          href={link.url} 
          target="_blank" 
          rel="noreferrer" 
          title={link.title}
        >
          <img 
            src={link.icon} 
            alt={link.title} 
            width="24" 
            height="24" 
            loading="lazy" 
          />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;