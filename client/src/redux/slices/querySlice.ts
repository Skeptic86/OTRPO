import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IQuerySliceState {
  query: string;
}

const initialState: IQuerySliceState = {
  query: "",
};

export const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
});

export const selectQuery = (state: RootState) => state.query;
// Action creators are generated for each case reducer function
export const { setQuery } = querySlice.actions;

export default querySlice.reducer;
