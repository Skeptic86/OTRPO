import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PokemonCard.module.scss";

interface IPokemon {
  name: string;
  id: number;
}

interface IResult {
  count: number;
  next: string;
  previous?: string;
  results: IPokemon[];
}

export const PokemonCard: React.FC = () => {
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

  return (
    <div className={styles.container}>
      <input
        className={styles.effect_1}
        type="text"
        placeholder="Enter Pokemon Name"
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul>
        {pokemons
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
            <li key={i}>{pokemon.name}</li>
          ))}
      </ul>
    </div>
  );
};
