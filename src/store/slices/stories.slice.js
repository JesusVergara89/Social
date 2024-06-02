import { createSlice } from "@reduxjs/toolkit";

export const storySlice = createSlice({
    name: 'storySlice',
    initialState: {
        items: [],
        isActive: false
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        setIsActive: (state, action) => {
            state.isActive = action.payload;
        }
    }
});

export const { setItems, setIsActive } = storySlice.actions;

export default storySlice.reducer;
