// Sidebar.js
import React from 'react';
import { FaPaintBrush, FaPlus, FaInfoCircle, FaSignOutAlt, FaSave, FaHome } from 'react-icons/fa';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Sidebar = ({
  userId,
  handleLogin,
  handleLogout,
  setUserId,
  authView,
  setAuthView,
  setShowCreateModal,
  setView
}) => {
  return (
    <aside style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '2rem' }}>
      <h2><FaPaintBrush /> Menu</h2>

      <button onClick={() => setView('gallery')} style={sidebarButtonStyle}>
        <FaHome /> Home
      </button>

      <button onClick={() => setShowCreateModal(true)} style={sidebarButtonStyle}>
        <FaPlus /> New Artwork
      </button>

      <button onClick={() => setView('about')} style={sidebarButtonStyle}>
        <FaInfoCircle /> About
      </button>

      {userId ? (
        <>
          <button onClick={() => setView('saved')} style={sidebarButtonStyle}>
            <FaSave /> Saved Artworks
          </button>
          <button onClick={() => {
            setUserId(null);
            setView('gallery');
          }} style={{ ...sidebarButtonStyle, background: '#e74c3c' }}>
            <FaSignOutAlt /> Logout
          </button>
        </>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={() => setAuthView('login')} style={authTabStyle(authView === 'login')}>Login</button>
            <button onClick={() => setAuthView('register')} style={authTabStyle(authView === 'register')}>Register</button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {authView === 'login' ? (
              <LoginForm onLogin={handleLogin}/>
              
            ) : (
              <RegisterForm onRegister={(id) => {
                handleLogin(id);
                setAuthView('login');
              }} />
              
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

const sidebarButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '0.75rem 1rem',
  margin: '1rem 0',
  background: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  textAlign: 'left'
};

const authTabStyle = (active) => ({
  flex: 1,
  padding: '0.5rem',
  backgroundColor: active ? '#3498db' : '#34495e',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});

export default Sidebar;
