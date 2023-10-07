import React from "react";

import styles from "./PokemonCard.module.scss";
import IPokemon from "../../types/pokemon.interface";

interface IPokemonCardProps {
  pokemon: IPokemon;
}

const PokemonCard: React.FC<IPokemonCardProps> = ({ pokemon }) => {
  return (
    <div className={styles.card}>
      <img
        className={styles.pokemon_img}
        src={pokemon.sprites.front_default}
        alt="pokemon_img"
      />
      <h2 className={styles.pokemon_name}>{pokemon.name}</h2>
      <div className={styles.pokemon_info}>
        {pokemon.abilities.map((ability, i) => (
          <p key={i} className={styles.pokemon_ability}>{`Способность ${
            i + 1
          }: ${ability.ability.name}`}</p>
        ))}
        <p className={styles.pokemon_ability}>height: {pokemon.height}</p>
        <p className={styles.pokemon_ability}>weight: {pokemon.weight}</p>
      </div>
    </div>
  );
};

export default PokemonCard;
