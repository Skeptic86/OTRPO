import React from 'react';

import styles from './PokemonCard.module.scss';
import IPokemon, { IStats } from '../../types/pokemon.interface';
import ChooseIconForStat from '../ChooseIconForStat';
import { Link } from 'react-router-dom';

export interface IPokemonCardProps {
  pokemon: IPokemon;
  onPokemonButtonClick: (pokemon: IPokemon) => void;
}

export enum StatsEnum {
  HP = 'hp',
  ATTACK = 'attack',
  SPEED = 'speed'
}

const PokemonCard: React.FC<IPokemonCardProps> = ({ pokemon, onPokemonButtonClick }) => {
  return (
    <div className={styles.card}>
      <Link key={pokemon.id} to={`info/${pokemon.id}`}>
        <img
          className={styles.pokemon_img}
          src={pokemon?.sprites?.front_default}
          alt="pokemon_img"
        />
        <h2 className={styles.pokemon_name}>{pokemon.name}</h2>
        <div className={styles.pokemon_info}>
          {pokemon?.abilities?.map((ability, i) => (
            <p key={i} className={styles.pokemon_ability}>{`Способность ${i + 1}: ${
              ability.ability.name
            }`}</p>
          ))}
          <div className={styles.pokemon_stats}>
            {pokemon?.stats?.map((stat, i) => (
              <ChooseIconForStat key={i} stat={stat} />
            ))}
          </div>
        </div>
      </Link>

      <button onClick={() => onPokemonButtonClick(pokemon)} className={styles.pokemon_button}>
        Выбрать
      </button>
    </div>
  );
};

export default PokemonCard;
