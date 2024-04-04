import { createSlice } from "@reduxjs/toolkit";


export const postSlice = createSlice({
    name: 'request',
    initialState: 0,
    reducers: {
        setpostValue: (state, action) => action.payload
    }
})

export const { setpostValue } = postSlice.actions;

export default postSlice.reducer;