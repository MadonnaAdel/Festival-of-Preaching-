import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfige/instance";



export const loginadmin = createAsyncThunk(
  "admin/loginadmin",
  async (adminData) => {
    try {
      const res = await axiosInstance.post("/admin/login", adminData);
      return res;
    } catch (error) {
      throw error;
    }
  }
);
const adminSlice = createSlice({
    name: 'admins',
    initialState: {
        admins: [],
        admin: {},
        status: 'idle',
        error: null,
    },
    reducers: {
      
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginadmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginadmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.admins = action.payload;
            })
            .addCase(loginadmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    }
});
export default adminSlice.reducer;