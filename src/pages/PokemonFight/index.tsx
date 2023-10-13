import styles from "./PokemonFight.module.scss";
import PokemonCard from "../../components/PokemonCard";
import sword_img from "public/swords.png";

import React from "react";
import { useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { selectPokemonData } from "../../redux/slices/pokemonSlice";

const PokemonFight = () => {
  const dispatch = useAppDispatch();
  const { pokemons, status, choosenPokemon, randomPokemon } =
    useSelector(selectPokemonData);

  const onButtonClick = () => {
    console.log("lol");
  };

  const onChangeInput = (query: string) => {};

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Read the form data
    const form = e.target;
    console.log(form);
  };

  return (
    <>
      {choosenPokemon && randomPokemon && (
        <>
          <div className={styles.pokemon_wrapper}>
            <div className={styles.pokemon_wrapper__outer}>
              <div className={styles.pokemon_wrapper__inner}>
                <PokemonCard
                  pokemon={choosenPokemon!}
                  onPokemonButtonClick={onButtonClick}
                />
                <img
                  className={styles.img_swords}
                  src={`${process.env.PUBLIC_URL}/assets/swords3.jpg`}
                  alt="swords.png"
                />
                <PokemonCard
                  pokemon={randomPokemon!}
                  onPokemonButtonClick={onButtonClick}
                />
              </div>
            </div>
          </div>

          <form className={styles.fight_form}>
            <input
              className={styles.effect_1}
              type="text"
              placeholder="Введите число от 1 до 10"
              onChange={(event) => onChangeInput(event.target.value)}
            />
            <button type="submit" onClick={handleSubmit}>
              Атаковать
            </button>
          </form>
        </>
      )}
      {(!choosenPokemon || !randomPokemon) && <h1>Покемоны не выбраны</h1>}
    </>
  );
};

export default PokemonFight;
