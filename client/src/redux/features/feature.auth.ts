import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        roles: []
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
            state.roles = [];
            state.isAuthenticated = false;
            state.isAdmin = false;
        },
        setIsAdmin: (state, action) => {
            state.isAdmin = action.payload;
        },
        setRoles: (state, action) => {
            state.roles = action.payload;
        }
    }
})

export default userSlice.reducer;
export const { addUser, addToken, setIsAuthenticated, removeUser, setIsAdmin, setRoles } = userSlice.actions;