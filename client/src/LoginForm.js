// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/login`, { username, password });
      onLogin(res.data.userId);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
      <button onClick={handleLogin} style={styles.button}>Login</button>
    </div>
  );
};

const styles = {
  formContainer: { maxWidth: '300px', margin: '0 auto', padding: '2rem' },
  input: { display: 'block', width: '100%', padding: '0.5rem', marginBottom: '1rem' },
  button: { padding: '0.5rem 1rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px' },
  error: { color: 'red' }
};

export default LoginForm;