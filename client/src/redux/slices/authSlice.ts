import { IUser } from './../../../models/IUser';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import LoginForm from '../../components/LoginForm';
import AuthService from '../../services/AuthService';

interface IAuthSliceState {
  user: IUser;
  isAuth: boolean;
}

const initialState: IAuthSliceState = {
  user: {} as IUser,
  isAuth: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    }
  }
});

export const selectAuth = (state: RootState) => state.auth;
// Action creators are generated for each case reducer function
export const { setIsAuth, setUser } = authSlice.actions;

export default authSlice.reducer;
