import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from "../../axiosConfige/instance";
import { date } from 'yup';


export const getAllUsers = createAsyncThunk('users/getAllUsers', async ({ page, limit }) => {
    const response = await axiosInstance.get(`/users`, { params: { page, limit } });
    return response.data
});
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    const response = await axiosInstance.delete(`/users/delete/${userId}`);
    return response.data
});
export const addUser = createAsyncThunk('users/addUser', async (user) => {
    const response = await axiosInstance.post(`/users/add`, user, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data
});
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, user }) => {
    console.log(id,user);
    
    const response = await axiosInstance.put(`/users/update/${id}`, user, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
});


const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        user: {},
        status: 'idle',
        error: null,
    },
    reducers: {
        updateUserList: (state, action) => {
            state.users = [...state.users, action.payload];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log(state.users);
                
              state.users = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { updateUserList } = userSlice.actions;
export default userSlice.reducer;