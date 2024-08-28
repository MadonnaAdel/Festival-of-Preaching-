import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import adminSlice from './slices/adminSlice';
import allUsers from './slices/allUsers';


const store = configureStore({
    reducer: {
        users: userSlice,
        allUsers: allUsers,
        admins: adminSlice,
    },
  });
  
  export default store;
  