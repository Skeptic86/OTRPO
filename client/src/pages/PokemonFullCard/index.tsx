import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChooseIconForStat from '../../components/ChooseIconForStat';
import { IPokemonCardProps } from '../../components/PokemonCard';
import { selectPokemonData } from '../../redux/slices/pokemonSlice';

import styles from './PokemonFullCard.module.scss';
import axios from 'axios';

const PokemonFullCard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pokemons } = useSelector(selectPokemonData);
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const pokemon = pokemons.filter(pokemon => pokemon.id === parseInt(id!))[0];

  const onChangeInput1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const onChangeInput2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const savePokemonFTP = async () => {
    const name = pokemon.name;
    if (login && password) {
      await axios
        .post('/save-pokemon', {
          name: name
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      alert('Введите логин и пароль!');
    }
  };

  return (
    <div className={styles.card}>
      <img className={styles.pokemon_img} src={pokemon.sprites.front_default} alt="pokemon_img" />
      <h2 className={styles.pokemon_name}>{pokemon.name}</h2>
      <div className={styles.pokemon_info}>
        {pokemon.abilities.map((ability, i) => (
          <p key={i} className={styles.pokemon_ability}>{`Способность ${i + 1}: ${
            ability.ability.name
          }`}</p>
        ))}
        <div className={styles.pokemon_stats}>
          {pokemon.stats.map((stat, i) => (
            <ChooseIconForStat key={i} stat={stat} />
          ))}
        </div>
        {pokemon.forms.map((form, i) => (
          <p key={i} className={styles.pokemon_ability}>{`Форма ${i + 1}: ${form.name}`}</p>
        ))}
        {pokemon.types.map((types, i) => (
          <p key={i} className={styles.pokemon_ability}>{`Тип ${i + 1}: ${types.type.name}`}</p>
        ))}
      </div>
      <form className={styles.fight_form}>
        <input
          className={styles.effect_1}
          type="text"
          placeholder="Логин"
          value={login}
          onChange={e => onChangeInput1(e)}
        />
        <input
          className={styles.effect_1}
          type="text"
          placeholder="Пароль"
          value={password}
          onChange={e => onChangeInput2(e)}
        />
        <button className={styles.pokemon_button} type="submit" onClick={savePokemonFTP}>
          Сохранить
        </button>
      </form>
      <button onClick={() => navigate('/')} className={styles.pokemon_button}>
        Назад
      </button>
    </div>
  );
};

export default PokemonFullCard;
