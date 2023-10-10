import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Home.module.scss";
import IPokemon from "../../types/pokemon.interface";
import IResult from "../../types/result.interface";
import PokemonCard from "../../components/PokemonCard";
import PokemonList from "../../components/PokemonList";
import { useAppDispatch } from "../../redux/store";
import {
    fetchPokemons,
    selectPokemonData,
} from "../../redux/slices/pokemonSlice";
import { selectQuery, setQuery } from "../../redux/slices/querySlice";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const { pokemons, status, choosenPokemon } = useSelector(selectPokemonData);
    const { query } = useSelector(selectQuery);

    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const getPokemons = async (limit: number = 100) => {
        dispatch(fetchPokemons({ limit }));
    };

    const onFightButtonClick = () => {
        if (pokemons && choosenPokemon) {
            const randomPokemon = Math.floor(Math.random() * pokemons.length);
        } else {
            alert("Сначала выберите покемона!");
        }
    };

    const onChangeInput = (query: string) => {
        dispatch(setQuery(query));
    };

    useEffect(() => {
        getPokemons();
    }, []);

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    const foundPokemons = pokemons?.filter((pokemon: IPokemon) => {
        if (query === "") {
            return pokemon;
        } else if (pokemon.name.toLowerCase().includes(query.toLowerCase())) {
            return pokemon;
        }
    });

    return (
        <div className={styles.container}>
            <button
                onClick={onFightButtonClick}
                className={styles.fight_button}
            >
                Бой!
            </button>
            <input
                className={styles.effect_1}
                type="text"
                placeholder="Enter Pokemon Name"
                onChange={(event) => onChangeInput(event.target.value)}
            />
            <div className={styles.pokemons}>
                {foundPokemons && (
                    <PokemonList
                        pokemons={foundPokemons}
                        currentPage={currentPage}
                        onChangePage={onChangePage}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
