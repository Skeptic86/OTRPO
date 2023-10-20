export default interface IPokemon {
  abilities: IAbilities[];
  base_experience: number;
  forms: IForm[];
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
  stats: IStats[];
  types: IType[];
}

export interface IStats {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
  };
}

interface IType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface IForm {
  name: string;
  url: string;
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
