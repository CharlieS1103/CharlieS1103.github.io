import React, { useState } from 'react';
import "../styles/SignupModal.scss";
import { createClient } from '@supabase/supabase-js';

// init a client for auth
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function SignupModal({ isOpen, onClose }) {
  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // sign up handler
  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setErrorMsg(error.message);
    else onClose();
  };

  return (
    <div className="signup-modal-backdrop" onClick={onClose}>
      <div className="signup-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          {errorMsg && <p className="error">{errorMsg}</p>}
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up…' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
