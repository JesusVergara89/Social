import { createSlice } from "@reduxjs/toolkit";


export const requestSlice = createSlice({
    name: 'request',
    initialState: 0,
    reducers: {
        setRequestValue: (state, action) => action.payload
    }
})

export const { setRequestValue } = requestSlice.actions;

export default requestSlice.reducer;