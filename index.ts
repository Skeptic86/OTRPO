export {};

const getPokemons = (limit: number) => {
  let data: Promise<any>;
  const address = `https://pokeapi.co/api/v2/pokemon/ditto/?limit=${limit}`;
  return fetch(address);
};

getPokemons(1)
  .then((pokemons) => {
    pokemons.json().then((data) => {
      //   console.log(data);
      return data;
    });
  })
  .catch((err) => {
    throw err;
  });
