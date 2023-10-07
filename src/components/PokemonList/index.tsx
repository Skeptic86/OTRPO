import React from "react";
import ReactPaginate from "react-paginate";

import styles from "./PokemonList.module.scss";
import IPokemon from "../../types/pokemon.interface";
import PokemonCard from "../PokemonCard";
import { useSelector } from "react-redux";
import { selectQuery } from "../../redux/slices/querySlice";
import { selectPokemonData } from "../../redux/slices/pokemonSlice";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

type PaginationProps = {
    onChangePage: (page: number) => void;
    currentPage: number;
    pokemons: IPokemon[];
    limit: number;
};

interface IItemsProps {
    currentItems: IPokemon[];
}

const Items: React.FC<IItemsProps> = ({ currentItems }) => {
    const { query } = useSelector(selectQuery);
    return (
        <>
            {currentItems
                ?.filter((pokemon: IPokemon) => {
                    if (query === "") {
                        return pokemon;
                    } else if (
                        pokemon.name.toLowerCase().includes(query.toLowerCase())
                    ) {
                        return pokemon;
                    }
                })
                .map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
        </>
    );
};

const PokemonList: React.FC<PaginationProps> = ({
    onChangePage,
    pokemons,
    currentPage,
    limit,
}) => {
    const { count } = useSelector(selectPokemonData);

    const pageCount = count / limit;

    // Invoke when user click to request another page.
    const handlePageClick = (event: any) => {
        onChangePage(event.selected);
    };

    return (
        <>
            <Items currentItems={pokemons} />
            <ReactPaginate
                className={styles.root}
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
        </>
    );
};

export default PokemonList;
