import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = () => {
    // Make a POST request to your backend's signup endpoint
    axios.post('http://localhost:3001/api/signup', { username, password, email })
      .then((response) => {
        if (response.status === 200) {
          setMessage('Account created successfully');
        }
      })
      .catch((error) => {
        setMessage('Account creation failed');
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Signup</h2>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default Signup;
