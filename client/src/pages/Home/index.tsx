import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from './Home.module.scss';
import IPokemon from '../../types/pokemon.interface';
import PokemonList from '../../components/PokemonList';
import { useAppDispatch } from '../../redux/store';
import {
  Status,
  fetchPokemons,
  selectPokemonData,
  setRandomPokemon
} from '../../redux/slices/pokemonSlice';
import { selectQuery, setQuery } from '../../redux/slices/querySlice';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { IUser } from '../../../models/IUser';
import { setIsAuth, setUser } from '../../redux/slices/authSlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { query } = useSelector(selectQuery);
  const { pokemons, status, choosenPokemon } = useSelector(selectPokemonData);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const getPokemons = useCallback(
    async (limit: number = 100) => {
      dispatch(fetchPokemons({ limit }));
    },
    [dispatch]
  );

  const logout = async () => {
    try {
      const response = await AuthService.logout();
      console.log(response);
      localStorage.removeItem('token');
      dispatch(setIsAuth(false));
      dispatch(setUser({} as IUser));
      navigate('/');
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  };

  const onFightButtonClick = () => {
    const random = Math.floor(Math.random() * pokemons.length);
    let randomPokemon = pokemons[random];
    if (randomPokemon.name === choosenPokemon?.name) {
      randomPokemon = pokemons[random - 1];
    }
    dispatch(setRandomPokemon(randomPokemon));
  };

  const onChangeInput = (query: string) => {
    dispatch(setQuery(query));
  };

  useEffect(() => {
    getPokemons();
  }, [getPokemons]);

  const onChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const foundPokemons = pokemons.filter((pokemon: IPokemon) => {
    return pokemon.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
      {choosenPokemon && (
        <Link to="/fight">
          <button onClick={onFightButtonClick} className={styles.fight_button}>
            Бой!
          </button>
        </Link>
      )}
      <button onClick={() => logout()}>Выйти</button>

      <input
        className={styles.effect_1}
        type="text"
        value={query}
        placeholder="Enter Pokemon Name"
        onChange={event => onChangeInput(event.target.value)}
      />
      <div className={styles.pokemons}>
        {status === Status.SUCCESS && (
          <PokemonList
            pokemons={foundPokemons}
            currentPage={currentPage}
            onChangePage={onChangePage}
          />
        )}
      </div>
    </>
  );
};

export default Home;
