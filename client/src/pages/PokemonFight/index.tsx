import styles from './PokemonFight.module.scss';
import PokemonCard, { StatsEnum } from '../../components/PokemonCard';
import sword_img from 'public/swords.png';

import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { selectPokemonData } from '../../redux/slices/pokemonSlice';
import IPokemon, { IStats } from '../../types/pokemon.interface';
import IFightResult from '../../types/fightResult.interface';
import FightResult from '../../components/FightResult';
import axios from 'axios';
import { chownSync } from 'fs';

const PokemonFight: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pokemons, status, choosenPokemon, randomPokemon } = useSelector(selectPokemonData);

  const [attackInput, setAttackInput] = useState<string>('');
  const [choosenPokemonHP, setChoosenPokemonHP] = useState<number>(0);
  const [randomPokemonHP, setRandomPokemonHP] = useState<number>(0);
  const [choosenPokemonAttack, setChoosenPokemonAttack] = useState<number>(0);
  const [randomPokemonAttack, setRandomPokemonAttack] = useState<number>(0);
  const [winnerPokemon, setWinnerPokemon] = useState<IPokemon>();
  const [fightResults, setFightResults] = useState<IFightResult[]>([]);
  const [roundNumber, setRoundNumber] = useState<number>(1);

  const onButtonClick = () => {
    console.log('lol');
  };

  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttackInput(e.target.value);
  };

  const pokemonAttack = (isAttackUsers: boolean) => {
    if (isAttackUsers) {
      setRandomPokemonHP(randomPokemonHP - choosenPokemonAttack);
      console.log(`pokemonAttack MY: ${choosenPokemonHP}  ${randomPokemonHP}`);
      addToFightResults({
        winner: choosenPokemon?.name,
        winner_hp: choosenPokemonHP,
        loser: randomPokemon?.name,
        loser_hp: randomPokemonHP,
        round_number: roundNumber,
      } as IFightResult);
    } else {
      setChoosenPokemonHP(choosenPokemonHP - randomPokemonAttack);
      console.log(`pokemonAttack ENEMY: ${choosenPokemonHP}  ${randomPokemonHP}`);
      addToFightResults({
        winner: randomPokemon?.name,
        winner_hp: randomPokemonHP,
        loser: choosenPokemon?.name,
        loser_hp: choosenPokemonHP,
        round_number: roundNumber,
      } as IFightResult);
    }
    setRoundNumber(roundNumber + 1);
  };

  React.useEffect(() => {
    if (choosenPokemon && randomPokemon) {
      let _choosenPokemonHP = choosenPokemon?.stats.filter((stat) => {
        return stat.stat.name === StatsEnum.HP;
      });
      let _randomPokemonHP = randomPokemon?.stats.filter((stat) => {
        return stat.stat.name === StatsEnum.HP;
      });
      let _choosenPokemonAttack = choosenPokemon?.stats.filter((stat) => {
        return stat.stat.name === StatsEnum.ATTACK;
      });
      let _randomPokemonAttack = randomPokemon?.stats.filter((stat) => {
        return stat.stat.name === StatsEnum.ATTACK;
      });

      setChoosenPokemonHP(_choosenPokemonHP![0].base_stat);
      setRandomPokemonHP(_randomPokemonHP![0].base_stat);
      setChoosenPokemonAttack(_choosenPokemonAttack![0].base_stat);
      setRandomPokemonAttack(_randomPokemonAttack![0].base_stat);
    }
  }, []);

  const isFightEnd = () => {
    console.log(`isFightEnd: ${choosenPokemonHP}  ${randomPokemonHP}`);
    if (randomPokemonHP <= 0) {
      setWinnerPokemon(choosenPokemon);
      // axios.post('https://localhost:5000/api/fightResult', {
      //   winner: choosenPokemon?.name,
      //   loser: randomPokemon?.name,
      // });
    } else if (choosenPokemonHP <= 0) {
      setWinnerPokemon(randomPokemon);
      // axios.post('https://localhost:5000/api/fightResult', {
      //   winner: randomPokemon?.name,
      //   loser: choosenPokemon?.name,
      // });
    }
  };

  const addToFightResults = (result: IFightResult) => {
    const newArray = [...fightResults];
    newArray.push(result);
    setFightResults(newArray);
  };

  const handleFight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const attackInputNumber = parseInt(attackInput, 10);
    setAttackInput('');
    if (attackInputNumber < 1 || attackInputNumber > 10 || Number.isNaN(attackInputNumber)) {
      alert('Можно вводить только числа от 1 до 10');
      return;
    }
    const attackRandomNumber = getRandomInt(1, 10);
    if (attackInputNumber % 2 === attackRandomNumber % 2) {
      pokemonAttack(true);
    } else {
      pokemonAttack(false);
    }
    isFightEnd();
  };

  const handleQuickFight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const _choosenPokemonHP = choosenPokemonHP;
    const _randomPokemonHP = randomPokemonHP;
    while (_choosenPokemonHP > 0 && _randomPokemonHP > 0) {
      const attackRandomNumber = getRandomInt(1, 10);
      const attackChosenNumber = getRandomInt(1, 10);
      if (attackChosenNumber % 2 === attackRandomNumber % 2) {
        console.log(_choosenPokemonHP);
        pokemonAttack(true);
      } else {
        console.log(_randomPokemonHP);
        pokemonAttack(false);
      }
    }
    isFightEnd();
  };

  return (
    <>
      {choosenPokemon && randomPokemon && !winnerPokemon && (
        <>
          <div className={styles.pokemon_wrapper}>
            <div className={styles.pokemon_wrapper__outer}>
              <div className={styles.pokemon_wrapper__inner}>
                <PokemonCard pokemon={choosenPokemon!} onPokemonButtonClick={onButtonClick} />
                <img
                  className={styles.img_swords}
                  src={`${process.env.PUBLIC_URL}/assets/swords3.jpg`}
                  alt="swords.png"
                />
                <PokemonCard pokemon={randomPokemon!} onPokemonButtonClick={onButtonClick} />
              </div>
            </div>
          </div>

          {!winnerPokemon && (
            <form className={styles.fight_form}>
              <input
                className={styles.effect_1}
                type="number"
                placeholder="Введите число от 1 до 10"
                value={attackInput}
                onChange={(e) => onChangeInput(e)}
              />
              <div className={styles.buttons}>
                <button className={styles.pokemon_button} type="submit" onClick={handleFight}>
                  Атаковать
                </button>
                <button className={styles.pokemon_button} type="submit" onClick={handleQuickFight}>
                  Быстрый бой
                </button>
              </div>
            </form>
          )}
        </>
      )}
      {fightResults.map((result, i) => (
        <FightResult key={i} {...result} />
      ))}
      {winnerPokemon && (
        <div className={styles.winner_pokemon__wrapper}>
          <h1 className={styles.winner_pokemon__header}>Победил</h1>
          <PokemonCard pokemon={winnerPokemon} onPokemonButtonClick={onButtonClick} />
        </div>
      )}
      {(!choosenPokemon || !randomPokemon) && (
        <h1 className={styles.winner_pokemon__header}>Покемоны не выбраны</h1>
      )}
    </>
  );
};

export default PokemonFight;
