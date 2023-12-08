import query from './slices/querySlice';
import { configureStore } from '@reduxjs/toolkit';
import pokemon from './slices/pokemonSlice';
import { useDispatch } from 'react-redux';
import auth from './slices/authSlice';

export const store = configureStore({
  reducer: { pokemon, query, auth }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
