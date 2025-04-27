import React from 'react';
import { 
  FaRocket, 
  FaTools, 
  FaExclamationTriangle, 
  FaLightbulb, 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaWifi, 
  FaPaintBrush, 
  FaShieldAlt, 
  FaSignInAlt, 
  FaPalette, 
  FaCloudUploadAlt 
} from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>About This Project</h1>

      <section style={sectionStyle}>
        <h2 style={sectionHeaderStyle}><FaRocket /> How It Works</h2>
        <p style={paragraphStyle}>
          Welcome to your personal Art Gallery! This app lets you browse artworks, create, edit, delete them, and save favorites
          to your account. It's powered dynamically using Node.js and Axios
          requests made through a RESTful API.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionHeaderStyle}><FaTools /> How it Works</h2>
        <ul style={listStyle}>
          <li>
            <FaReact /> <strong>React</strong> – Handles the frontend UI, managing components, state, and user interactions. React enables a smooth, dynamic experience without full page reloads.
          </li>
          <li>
            <FaNodeJs /> <strong>Express.js & Node.js</strong> – Power the backend server, exposing RESTful API endpoints to create, retrieve, update, and delete artworks and users.
          </li>
          <li>
            <FaDatabase /> <strong>MongoDB</strong> – A flexible NoSQL database that stores all artwork details, user accounts, and saved artwork collections in a document-based format.
          </li>
          <li>
            <FaWifi /> <strong>Axios</strong> – A promise-based HTTP client that allows the frontend to communicate with the backend server, sending and receiving data asynchronously.
          </li>
          <li>
            <FaPaintBrush /> <strong>Inline CSS Styling</strong> – Styles are directly embedded inside React components for fast prototyping and full control over each element's appearance.
          </li>
        </ul>
      </section>


      <section style={sectionStyle}>
        <h2 style={sectionHeaderStyle}><FaExclamationTriangle /> Weaknesses</h2>
        <ul style={listStyle}>
          <li><FaShieldAlt /> Minimal input validation (needs stronger checks)</li>
          <li><FaSignInAlt /> No persistent login after refresh (no sessions yet)</li>
          <li><FaPalette /> Basic design (using inline styles instead of frameworks)</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionHeaderStyle}><FaLightbulb /> Future Improvements</h2>
        <ul style={listStyle}>
          <li><FaShieldAlt /> Add JWT authentication for secure, persistent login</li>
          <li><FaShieldAlt /> Implement better input validation & security</li>
          <li><FaPalette /> Use a CSS framework like TailwindCSS or Material-UI</li>
          <li><FaCloudUploadAlt /> Deploy to a cloud platform like DigitalOcean or Heroku</li>
        </ul>
      </section>
    </div>
  );
};

const pageStyle = {
  padding: '3rem',
  maxWidth: '900px',
  margin: '0 auto',
  fontFamily: 'Arial, sans-serif',
  color: '#2c3e50'
};

const headerStyle = {
  fontSize: '2.5rem',
  textAlign: 'center',
  marginBottom: '2rem',
  color: '#3498db'
};

const sectionStyle = {
  marginBottom: '3rem'
};

const sectionHeaderStyle = {
  fontSize: '1.8rem',
  marginBottom: '1rem',
  color: '#34495e',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const paragraphStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.6'
};

const listStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.8',
  listStyleType: 'none',
  paddingLeft: '0',
  marginTop: '1rem'
};

export default AboutPage;
