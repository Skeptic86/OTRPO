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
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    pokemon.id + 1
                }.png`}
                alt="pokemon_img"
            />
            <h2 className={styles.pokemon_name}>{pokemon.name}</h2>
            <h2 className={styles.pokemon_name}>height: {pokemon.height}</h2>
            <h2 className={styles.pokemon_name}>weight: {pokemon.weight}</h2>
        </div>
    );
};

export default PokemonCard;
