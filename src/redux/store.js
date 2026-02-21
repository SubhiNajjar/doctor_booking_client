import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import appointmentReducer from './appointmentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer,
  },
});

export default store;
