// src/pages/Profile.jsx
import { useState } from 'react';
import { login, signup } from '../lib/authApi';

export default function Login() {
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [isSignup, setMode] = useState(false);
  const [error, setError]   = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      isSignup ? await signup(email, pass) : await login(email, pass);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-sm p-4">
      <h1 className="text-xl mb-4">{isSignup ? 'Create account' : 'Log in'}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
          required
        />
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Password"
          className="input"
          required
        />
        <button className="btn">{isSignup ? 'Sign up' : 'Log in'}</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <button className="text-sm mt-2" onClick={() => setMode(!isSignup)}>
        {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}

