import { createSlice } from "@reduxjs/toolkit";


export const conectionsSlice = createSlice({
    name: 'request',
    initialState: 0,
    reducers: {
        setConectionValue: (state, action) => action.payload
    }
})

export const { setConectionValue } = conectionsSlice.actions;

export default conectionsSlice.reducer;