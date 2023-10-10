import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

import styles from "./PokemonCard.module.scss";
import IPokemon, { IStats } from "../../types/pokemon.interface";

interface IPokemonCardProps {
  pokemon: IPokemon;
  onPokemonButtonClick: (pokemon: IPokemon) => void;
}

enum StatsEnum {
  HP = "hp",
  ATTACK = "attack",
  SPEED = "speed",
}

type TChooseIconForStatProps = {
  stat: IStats;
};

const ChooseIconForStat: React.FC<TChooseIconForStatProps> = ({ stat }) => {
  const iconName = stat.stat.name;
  if (iconName === StatsEnum.HP) {
    return (
      <div className={styles.pokemon_stats}>
        <FavoriteIcon />
        <p>{stat.base_stat}</p>
      </div>
    );
  } else if (iconName === StatsEnum.ATTACK) {
    return (
      <div className={styles.pokemon_stats}>
        <SportsMmaIcon />
        <p>{stat.base_stat}</p>
      </div>
    );
  } else if (iconName === StatsEnum.SPEED) {
    return (
      <div className={styles.pokemon_stats}>
        <DirectionsRunIcon />
        <p>{stat.base_stat}</p>
      </div>
    );
  }
  return <></>;
};

const PokemonCard: React.FC<IPokemonCardProps> = ({
  pokemon,
  onPokemonButtonClick,
}) => {
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
        <div className={styles.pokemon_stats}>
          {pokemon.stats.map((stat, i) => (
            <ChooseIconForStat key={i} stat={stat} />
          ))}
        </div>
      </div>

      <button
        onClick={() => onPokemonButtonClick(pokemon)}
        className={styles.pokemon_button}
      >
        Выбрать
      </button>
    </div>
  );
};

export default PokemonCard;
