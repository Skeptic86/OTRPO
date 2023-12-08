import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../../models/IUser';
import { AuthResponse } from '../../../models/response/AuthResponse';
import { setIsAuth, setUser } from '../../redux/slices/authSlice';
import { useAppDispatch } from '../../redux/store';
import AuthService from '../../services/AuthService';

const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      dispatch(setIsAuth(true));
      dispatch(setUser(response.data.user));
      navigate('/home');
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  };

  const registration = async (email: string, password: string) => {
    try {
      const response = await AuthService.registration(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      dispatch(setIsAuth(true));
      dispatch(setUser(response.data.user));
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={() => login(email, password)}>Логин</button>
      <button onClick={() => registration(email, password)}>Регистрация</button>
    </div>
  );
};

export default LoginForm;
