import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChooseIconForStat from '../../components/ChooseIconForStat';
import { IPokemonCardProps } from '../../components/PokemonCard';
import { selectPokemonData } from '../../redux/slices/pokemonSlice';
import StarRatings from 'react-star-ratings';
import IPokemon from '../../types/pokemon.interface';

import styles from './PokemonFullCard.module.scss';
import axios from 'axios';

interface IComment {
  message: string;
  star_count: number;
}

const PokemonFullCard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pokemons } = useSelector(selectPokemonData);
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [commentList, setCommentList] = React.useState<IComment[]>([]);
  const [comment, setComment] = React.useState<string>('');
  const [rating, setRating] = React.useState<number>(1);
  const [pokemonApi, setPokemonApi] = React.useState<IPokemon>();
  const pokemon = pokemons.filter(pokemon => pokemon.id === parseInt(id!))[0];

  const fetchPokemonById = async (num: number) => {
    const url = `/redis/${num}`;
    const { data } = await axios.get<IPokemon>(url);
    setPokemonApi(data);
    console.log(data);
    return data;
  };

  useEffect(() => {
    fetchPokemonById(pokemon.id);
  }, []);

  const onChangeInput1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const onChangeInput2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeInput3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const savePokemonFTP = async () => {
    const name = pokemonApi?.name;
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
        })
        .finally(() => {
          navigate('/');
        });
    } else {
      alert('Введите логин и пароль!');
    }
  };

  const addToCommentList = (_comment: string) => {
    if (comment.length > 0) {
      const newComment = { message: _comment, star_count: rating } as IComment;
      const newArray = [...commentList];
      newArray.push(newComment);
      setCommentList(newArray);
    }
  };

  if (!pokemonApi) return null;

  return (
    <>
      <div className={styles.card}>
        <img
          className={styles.pokemon_img}
          src={pokemonApi?.sprites?.front_default!}
          alt="pokemon_img"
        />
        <h2 className={styles.pokemon_name}>{pokemonApi?.name}</h2>
        <div className={styles.pokemon_info}>
          {pokemonApi?.abilities.map((ability, i) => (
            <p key={i} className={styles.pokemon_ability}>{`Способность ${i + 1}: ${
              ability.ability.name
            }`}</p>
          ))}
          <div className={styles.pokemon_stats}>
            {pokemonApi?.stats.map((stat, i) => (
              <ChooseIconForStat key={i} stat={stat} />
            ))}
          </div>
          {pokemonApi?.forms.map((form, i) => (
            <p key={i} className={styles.pokemon_ability}>{`Форма ${i + 1}: ${form.name}`}</p>
          ))}
          {pokemonApi?.types.map((types, i) => (
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
      <div className={styles.comment_card}>
        <h2 className={styles.comment_card_header}>{`Комментарии`}</h2>
        <StarRatings numberOfStars={5} rating={rating} changeRating={setRating} />
        <input
          className={styles.effect_1}
          type="text"
          placeholder="Ваш комментарий"
          value={comment}
          onChange={e => onChangeInput3(e)}
        />
        <button onClick={() => addToCommentList(comment)} className={styles.pokemon_button}>
          Добавить комментарий
        </button>
        {commentList.map((item, i) => {
          return (
            <div className={styles.comment_card}>
              <p key={i} className={styles.comment_card_line}>
                {item.message}
              </p>
              <StarRatings numberOfStars={5} rating={item.star_count} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PokemonFullCard;
