export default interface IPokemon {
    abilities: object[];
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
    sprites: object;
    stats: object[];
    types: object[];
}
