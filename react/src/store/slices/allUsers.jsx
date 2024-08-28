import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from "../../axiosConfige/instance";
import { date } from 'yup';


export const getallUsersWithoutPagenation = createAsyncThunk('allUserss/getallUsers', async () => {
    const response = await axiosInstance.get(`/users/getAll`);
    return response.data
});


const allUserslice = createSlice({
    name: 'allUsers',
    initialState: {
        allUsers: [],
        allUsers: {},
        status: 'idle',
        error: null,
    },
    reducers: {
    
    },
    extraReducers: (builder) => {
        builder
            .addCase(getallUsersWithoutPagenation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getallUsersWithoutPagenation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allUsers = action.payload;
            })
            .addCase(getallUsersWithoutPagenation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    }
})
// export const { updateUserList } = allUserslice.actions;
export default allUserslice.reducer;