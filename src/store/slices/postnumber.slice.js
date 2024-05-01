import { createSlice } from "@reduxjs/toolkit";


export const postnumberSlice = createSlice({
    name: 'request',
    initialState: 0,
    reducers: {
        setPostNumberValue: (state, action) => action.payload
    }
})

export const { setPostNumberValue } = postnumberSlice.actions;

export default postnumberSlice.reducer;