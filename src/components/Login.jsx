import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!identifier || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(identifier, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="logo">cycl3 ♾️</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="input"
              placeholder="Handle (without .bsky.social) or email"
              value={identifier}
              onChange={(e) => {
                // Remove @ if user includes it
                setIdentifier(e.target.value.replace('@', ''));
              }}
              disabled={loading}
            />
            <small style={{ color: 'var(--gray)', marginTop: '0.25rem', display: 'block' }}>
              Example: username or user@example.com
            </small>
          </div>
          <div className="form-group">
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && (
            <div className="error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login with Bluesky'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray)' }}>
          Don't have a Bluesky account?{' '}
          <a 
            href="https://bsky.app" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)' }}
          >
            Join Bluesky
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
