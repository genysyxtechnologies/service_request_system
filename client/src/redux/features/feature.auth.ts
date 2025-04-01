import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
    },
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        },
        addToken: (state, action) => {
            state.token = action.payload;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
        },
        setIsAdmin: (state, action) => {
            state.isAdmin = action.payload;
        }
    }
})

export default userSlice.reducer;
export const { addUser, addToken, setIsAuthenticated, removeUser, setIsAdmin } = userSlice.actions;