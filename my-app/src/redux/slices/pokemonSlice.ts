import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import IPokemon from "../../types/pokemon.interface";
import IResult from "../../types/result.interface";

type TPokemonsParams = {
  limit: number;
};

export const fetchPokemons = createAsyncThunk<IResult, TPokemonsParams>(
  "pokemons/fetchPokemon",
  async (params, thunkApi) => {
    const url = `https://pokeapi.co/api/v2/pokemon?page=10&limit=${params.limit}`;
    const { data } = await axios.get<IResult>(url);
    return data;
  }
);

enum Status {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

interface IPokemonSliceState {
  items: IPokemon[];
  status: Status;
}

const initialState: IPokemonSliceState = {
  items: [],
  status: Status.LOADING, // loading | success | error
};

export const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<IResult>) {
      state.items = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPokemons.pending, (state, action) => {
      state.status = Status.LOADING;
      state.items = [];
    });

    builder.addCase(fetchPokemons.fulfilled, (state, action) => {
      state.items = action.payload.results;
      state.status = Status.SUCCESS;
    });

    builder.addCase(fetchPokemons.rejected, (state, action) => {
      state.status = Status.ERROR;
      state.items = [];
    });
  },
});

export const selectPokemonData = (state: RootState) => state.pokemon;
// Action creators are generated for each case reducer function
export const { setItems } = pokemonSlice.actions;

export default pokemonSlice.reducer;
