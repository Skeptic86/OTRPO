import React from "react";
import ReactPaginate from "react-paginate";

import styles from "./PokemonList.module.scss";
import IPokemon from "../../types/pokemon.interface";
import PokemonCard from "../PokemonCard";
import { useDispatch, useSelector } from "react-redux";
import { selectQuery } from "../../redux/slices/querySlice";
import { useAppDispatch } from "../../redux/store";
import {
  choosePokemon,
  selectChoosenPokemon,
} from "../../redux/slices/pokemonSlice";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

type PaginationProps = {
  onChangePage: (page: number) => void;
  currentPage: number;
  pokemons: IPokemon[];
};

interface IItemsProps {
  currentItems: IPokemon[];
}

const Items: React.FC<IItemsProps> = ({ currentItems }) => {
  const dispatch = useAppDispatch();
  const { query } = useSelector(selectQuery);

  const onPokemonButtonClick = (pokemon: IPokemon) => {
    dispatch(choosePokemon(pokemon));
  };

  return (
    <div className={styles.pokemon_wrapper__outer}>
      <div className={styles.pokemon_wrapper__inner}>
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
            <PokemonCard
              onPokemonButtonClick={onPokemonButtonClick}
              key={pokemon.id}
              pokemon={pokemon}
            />
          ))}
      </div>
    </div>
  );
};

const PokemonList: React.FC<PaginationProps> = ({
  onChangePage,
  pokemons,
  currentPage,
}) => {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = React.useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + 10;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = pokemons.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(pokemons.length / 10);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % pokemons.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
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
