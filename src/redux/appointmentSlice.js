import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchPatientAppointments = createAsyncThunk(
  'appointments/fetchPatient',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/patient/appointments');
      return res.data.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load appointments');
    }
  }
);

export const fetchDoctorAppointments = createAsyncThunk(
  'appointments/fetchDoctor',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/doctor/appointments');
      return res.data.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load appointments');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/patient/appointments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/patient/appointments', data);
      return res.data.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to book appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAppointmentError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null; };
    const setError = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchPatientAppointments.pending, setLoading)
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPatientAppointments.rejected, setError)

      .addCase(fetchDoctorAppointments.pending, setLoading)
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDoctorAppointments.rejected, setError)

      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a._id !== action.payload);
      })
      .addCase(cancelAppointment.rejected, setError)

      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(bookAppointment.rejected, setError);
  },
});

export const { clearAppointmentError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
