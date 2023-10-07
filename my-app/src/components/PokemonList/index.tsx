import React from "react";
import ReactPaginate from "react-paginate";

import styles from "./PokemonList.module.scss";
import IPokemon from "../../types/pokemon.interface";
import PokemonCard from "../PokemonCard";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

type PaginationProps = {
  onChangePage: (page: number) => void;
  currentPage: number;
  pokemons: IPokemon[];
};

const Items: React.FC<any> = ({ currentItems }) => {
  return (
    <>
      {currentItems
        // ?.filter((pokemon: IPokemon) => {
        //   if ("query" === "") {
        //     return pokemon;
        //   } else if (
        //     pokemon.name.toLowerCase().includes(query.toLowerCase())
        //   ) {
        //     return pokemon;
        //   }
        // })
        .map((pokemon: IPokemon, i: number) => (
          <PokemonCard key={i} name={pokemon.name} id={i} />
        ))}
    </>
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
