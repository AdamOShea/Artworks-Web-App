// RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/register`, { username, password });
      if (res.data && res.data.userId) {
        onRegister(res.data.userId); 
      } else {
        setError('Registration succeeded but user ID not returned.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2>Register</h2>
      {error && <p style={styles.error}>{error}</p>}
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
      <button onClick={handleRegister} style={styles.button}>Register</button>
    </div>
  );
};

const styles = {
    formContainer: { maxWidth: '300px', margin: '0 auto', padding: '2rem' },
    input: { display: 'block', width: '100%', padding: '0.5rem', marginBottom: '1rem' },
    button: { padding: '0.5rem 1rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px' },
    error: { color: 'red' }
  };

export default RegisterForm;
