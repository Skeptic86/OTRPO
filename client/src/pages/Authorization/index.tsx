import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Authorization = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [registrationSecret, setRegistrationSecret] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/register', {
        username,
        password
      });
      const { qrCode } = response.data;
      setRegistrationSecret(qrCode);
      console.log('Registration successful');
      console.log('Scan the QR code with your 2FA app');
    } catch (error: any) {
      console.error(error.response.data.error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', {
        username,
        password,
        token: twoFactorToken
      });
      const { token } = response.data;
      setToken(token);
      console.log('Login successful');
    } catch (error: any) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div>
      <h1>Two-Factor Authentication Example</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div>
        <button onClick={handleRegister}>Register</button>
      </div>

      {registrationSecret && (
        <div>
          <p>Registration successful. Scan the QR code with your 2FA app.</p>
          <img src={registrationSecret} alt="2FA QR Code" />
          <div>
            <label>Enter 2FA Token:</label>
            <input
              type="text"
              value={twoFactorToken}
              onChange={e => setTwoFactorToken(e.target.value)}
            />
          </div>
          <div>
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

<Link to="/home">
  <button>Пропустить авторизацию</button>
</Link>;

export default Authorization;
