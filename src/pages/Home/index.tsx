import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Home.module.scss";
import IPokemon from "../../types/pokemon.interface";
import IResult from "../../types/result.interface";
import PokemonCard from "../../components/PokemonCard";
import PokemonList from "../../components/PokemonList";
import { useAppDispatch } from "../../redux/store";
import {
  fetchPokemons,
  selectPokemonData,
} from "../../redux/slices/pokemonSlice";
import { setQuery } from "../../redux/slices/querySlice";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useSelector(selectPokemonData);

  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const getPokemons = async (limit: number = 100) => {
    dispatch(fetchPokemons({ limit }));
  };

  const onChangeInput = (query: string) => {
    dispatch(setQuery(query));
  };

  useEffect(() => {
    getPokemons();
  }, []);

  const onChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.effect_1}
        type="text"
        placeholder="Enter Pokemon Name"
        onChange={(event) => onChangeInput(event.target.value)}
      />
      <div className="pokemons">
        {/* {pokemons
          ?.filter((pokemon) => {
            if (query === "") {
              return pokemon;
            } else if (
              pokemon.name.toLowerCase().includes(query.toLowerCase())
            ) {
              return pokemon;
            }
          })
          .map((pokemon, i) => (
            <PokemonCard key={i} name={pokemon.name} id={i} />
          ))} */}
        {items && (
          <PokemonList
            pokemons={items}
            currentPage={currentPage}
            onChangePage={onChangePage}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
