import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import IPokemon from '../../types/pokemon.interface';
import IResult from '../../types/result.interface';

type TPokemonsParams = {
  limit: number;
};

export const fetchPokemons = createAsyncThunk(
  'pokemons/fetchPokemon',
  async (params: TPokemonsParams, thunkApi) => {
    const url = `https://pokeapi.co/api/v2/pokemon?page=10&limit=${params.limit}`;
    const { data } = await axios.get<IResult>(url);

    const pokemonsData: IPokemon[] = await Promise.all(
      data.results.map(async pokemon => {
        const pokemonFullInfo = await axios.get(pokemon.url);
        return pokemonFullInfo.data;
      })
    );

    return pokemonsData;
  }
);

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

interface IPokemonSliceState {
  pokemons: IPokemon[];
  status: Status;
  choosenPokemon?: IPokemon;
  randomPokemon?: IPokemon;
}

const initialState: IPokemonSliceState = {
  pokemons: [],
  status: Status.LOADING // loading | success | error
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setPokemons(state, action: PayloadAction<IPokemon[]>) {
      state.pokemons = action.payload;
    },
    setChosenPokemon(state, action: PayloadAction<IPokemon>) {
      state.choosenPokemon = action.payload;
    },
    setRandomPokemon(state, action: PayloadAction<IPokemon>) {
      state.randomPokemon = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPokemons.pending, state => {
      state.status = Status.LOADING;
      state.pokemons = [];
    });

    builder.addCase(fetchPokemons.fulfilled, (state, action: PayloadAction<IPokemon[]>) => {
      state.pokemons = action.payload;
      state.status = Status.SUCCESS;
    });

    builder.addCase(fetchPokemons.rejected, state => {
      state.status = Status.ERROR;
      state.pokemons = [];
    });
  }
});

export const selectPokemonData = (state: RootState) => state.pokemon;
// Action creators are generated for each case reducer function
export const { setPokemons, setChosenPokemon, setRandomPokemon } = pokemonSlice.actions;

export default pokemonSlice.reducer;
