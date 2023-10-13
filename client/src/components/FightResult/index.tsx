import React from 'react';
import IFightResult from '../../types/fightResult.interface';
import styles from './FightResult.module.scss';

const FightResult: React.FC<IFightResult> = ({
  winner,
  winner_hp,
  loser,
  loser_hp,
  round_number,
}) => {
  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.card_header}>{`Раунд ${round_number}`}</h2>
        <p
          className={
            styles.card_line
          }>{`Победил: ${winner}. Количество оставшегося здоровья: ${winner_hp}`}</p>
        <p
          className={
            styles.card_line
          }>{`Проиграл: ${loser}. Количество оставшегося здоровья: ${loser_hp}`}</p>
      </div>
    </>
  );
};

export default FightResult;
