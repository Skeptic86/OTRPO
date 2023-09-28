interface ISprites {
  back_default: string;
  front_default: string;
}

export default interface IPokemon {
  name: string;
  id: number;
  sprites?: ISprites;
}
