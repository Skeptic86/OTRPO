import IPokemon from "./pokemon.interface";

export default interface IResult {
  count: number;
  next: string;
  previous?: string;
  results: IPokemon[];
}
