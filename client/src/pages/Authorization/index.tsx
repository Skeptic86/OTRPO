import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AuthResponse } from '../../../models/response/AuthResponse';
import LoginForm from '../../components/LoginForm';
import { selectAuth, setIsAuth, setUser } from '../../redux/slices/authSlice';
import { useAppDispatch } from '../../redux/store';

const Authorization = () => {
  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axios.get<AuthResponse>('http://localhost:5000/api/refresh', {
        withCredentials: true
      });
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      dispatch(setIsAuth(true));
      dispatch(setUser(response.data.user));
      navigate('/home');
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  };

  React.useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, []);

  React.useEffect(() => {}, []);

  const CLIENT_ID = '655c5f2e13624fe8a548';

  const loginWithGithub = () => {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID);
  };

  return (
    <div>
      <h1>
        {auth.isAuth
          ? `Пользователь авторизован: ${auth.user.email}`
          : 'Пользователь не авторизован'}
      </h1>
      <LoginForm />
      <button onClick={() => loginWithGithub()}>Login with GitHub</button>
      <Link to="/home">
        <button>Пропустить авторизацию</button>
      </Link>
    </div>
  );
};

export default Authorization;
