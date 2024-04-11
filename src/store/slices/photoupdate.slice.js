import { createSlice } from "@reduxjs/toolkit";

export const photoupdateSlice = createSlice({
    name: 'newPhoto',
    initialState: false,
    reducers: {
        setPhotoValue: (state, action) => action.payload
    }
})

export const { setPhotoValue } = photoupdateSlice.actions;

export default photoupdateSlice.reducer;