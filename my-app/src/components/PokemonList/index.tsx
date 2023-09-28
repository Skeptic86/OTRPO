import React, { useEffect, useState } from "react";
import axios from "axios";

import styles from "./PokemonList.module.scss";
import IPokemon from "../../types/pokemon.interface";
import IResult from "../../types/result.interface";
import { PokemonCard } from "../PokemonCard";

export const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = React.useState<IPokemon[]>();
  const [query, setQuery] = useState<string>("");
  const getPokemons = async (limit: number = 100) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;
    const { data } = await axios.get<IResult>(url);
    console.log(data);
    setPokemons(data.results);
    return data.results;
  };

  useEffect(() => {
    getPokemons();
  }, []);

  //   const pokemonCards = pokemons?.map((val: any) => (
  //     <PokemonCard key={val.id} {...val} />
  //   ));

  return (
    <div className={styles.container}>
      <input
        className={styles.effect_1}
        type="text"
        placeholder="Enter Pokemon Name"
        onChange={(event) => setQuery(event.target.value)}
      />
      {pokemons
        ?.filter((pokemon) => {
          if (query === "") {
            return pokemon;
          } else if (pokemon.name.toLowerCase().includes(query.toLowerCase())) {
            return pokemon;
          }
        })
        .map((pokemon, i) => (
          <PokemonCard key={i} name={pokemon.name} id={i} />
        ))}
    </div>
  );
};
