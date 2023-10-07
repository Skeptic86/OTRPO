import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import IPokemon from "../../types/pokemon.interface";
import IResult from "../../types/result.interface";

type TPokemonsParams = {
    limit: number;
    offset: number;
};

export const fetchPokemons = createAsyncThunk(
    "pokemons/fetchPokemon",
    async (params: TPokemonsParams, thunkApi) => {
        const url = `https://pokeapi.co/api/v2/pokemon`;
        const { data } = await axios.get<IResult>(url, {
            params: {
                offset: params.offset,
                limit: params.limit,
            },
        });
        console.log(data);

        const pokemonsData: IPokemon[] = await Promise.all(
            data.results.map(async (pokemon) => {
                const pokemonFullInfo = await axios.get(pokemon.url);
                return pokemonFullInfo.data;
            })
        );

        return { pokemonsData, count: data.count };
    }
);

enum Status {
    LOADING = "loading",
    SUCCESS = "success",
    ERROR = "error",
}

interface IPokemonSliceState {
    items: IPokemon[];
    count: number;
    status: Status;
}

interface IResponseData {
    pokemonsData: IPokemon[];
    count: number;
}

const initialState: IPokemonSliceState = {
    items: [],
    count: 0,
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
            (state, action: PayloadAction<IResponseData>) => {
                state.items = action.payload.pokemonsData;
                state.count = action.payload.count;
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
