// Footer.jsx
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} MSID FILMS — Réalisé par <strong>Mamouni Mohamed</strong> | Master MSID - Module DWM
        </p>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/mohamed-mamouni/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <span>•</span>
          <a href="https://github.com/omis-mamouni" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
