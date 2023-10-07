import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import IPokemon from "../../types/pokemon.interface";
import IResult from "../../types/result.interface";

type TPokemonsParams = {
    limit: number;
};

export const fetchPokemons = createAsyncThunk(
    "pokemons/fetchPokemon",
    async (params: TPokemonsParams, thunkApi) => {
        const url = `https://pokeapi.co/api/v2/pokemon?page=10&limit=${params.limit}`;
        const { data } = await axios.get<IResult>(url);
        console.log(data);
        const pokemonsData: IPokemon[] = await Promise.all(
            data.results.map(async (pokemon) => {
                const pokemonFullInfo = await axios.get(pokemon.url);
                return pokemonFullInfo.data;
            })
        );
        console.log(pokemonsData);
        return pokemonsData;
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
        setItems(state, action: PayloadAction<IPokemon[]>) {
            state.items = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPokemons.pending, (state) => {
            state.status = Status.LOADING;
            state.items = [];
        });

        builder.addCase(
            fetchPokemons.fulfilled,
            (state, action: PayloadAction<IPokemon[]>) => {
                state.items = action.payload;
                state.status = Status.SUCCESS;
            }
        );

        builder.addCase(fetchPokemons.rejected, (state) => {
            state.status = Status.ERROR;
            state.items = [];
        });
    },
});

export const selectPokemonData = (state: RootState) => state.pokemon;
// Action creators are generated for each case reducer function
export const { setItems } = pokemonSlice.actions;

export default pokemonSlice.reducer;
