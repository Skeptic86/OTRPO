import React, { useEffect, useState } from "react";

import styles from "./PokemonCard.module.scss";
import IPokemon from "../../types/pokemon.interface";

export const PokemonCard: React.FC<IPokemon> = ({ name, id, sprites }) => {
  return (
    <div className={styles.card}>
      <img
        className={styles.pokemon_img}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          id + 1
        }.png`}
        alt="pokemon_img"
      />
      <h2 className={styles.pokemon_name}>{name}</h2>
    </div>
  );
};
