import { createSlice } from "@reduxjs/toolkit";


export const countermsgSlice = createSlice({
    name: 'request',
    initialState: 0,
    reducers: {
        setMsgValue: (state, action) => action.payload
    }
})

export const { setMsgValue } = countermsgSlice.actions;

export default countermsgSlice.reducer;