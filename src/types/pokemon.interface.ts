export default interface IPokemon {
  abilities: IAbilities[];
  base_experience: number;
  forms: object[];
  game_indices: object[];
  height: number;
  weight: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: object[];
  name: string;
  order: number;
  species: object;
  sprites: ISprites;
  stats: object[];
  types: object[];
}

interface ISprites {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

interface IAbilities {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}
