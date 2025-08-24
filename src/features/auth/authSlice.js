import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export const requestRegisterOtp = createAsyncThunk('auth/requestRegisterOtp', async (email) => {
  const { data } = await api.post('/auth/register/request-otp', { email });
  return data;
});
export const verifyRegister = createAsyncThunk('auth/verifyRegister', async ({ email, code, name, password }) => {
  const { data } = await api.post('/auth/register/verify', { email, code, name, password });
  return data;
});
export const requestResetOtp = createAsyncThunk('auth/requestResetOtp', async (email) => {
  const { data } = await api.post('/auth/forgot/request-otp', { email });
  return data;
});
export const verifyReset = createAsyncThunk('auth/verifyReset', async ({ email, code, newPassword }) => {
  const { data } = await api.post('/auth/forgot/verify', { email, code, newPassword });
  return data;
});

const slice = createSlice({
  name: 'auth',
  initialState: { loading: false, error: null, message: null, user: null },
  reducers: {
    clearFeedback: (s) => { s.error = null; s.message = null; },
  },
  extraReducers: (b) => {
    const pend = (s) => { s.loading = true; s.error = null; s.message = null; };
    const rej = (s, a) => { s.loading = false; s.error = a.error.message; };

    b.addCase(requestRegisterOtp.pending, pend)
     .addCase(requestRegisterOtp.fulfilled, (s, a) => { s.loading = false; s.message = a.payload.message; })
     .addCase(requestRegisterOtp.rejected, rej)

     .addCase(verifyRegister.pending, pend)
     .addCase(verifyRegister.fulfilled, (s, a) => { s.loading = false; s.message = a.payload.message; s.user = a.payload.user; })
     .addCase(verifyRegister.rejected, rej)

     .addCase(requestResetOtp.pending, pend)
     .addCase(requestResetOtp.fulfilled, (s, a) => { s.loading = false; s.message = a.payload.message; })
     .addCase(requestResetOtp.rejected, rej)

     .addCase(verifyReset.pending, pend)
     .addCase(verifyReset.fulfilled, (s, a) => { s.loading = false; s.message = a.payload.message; })
     .addCase(verifyReset.rejected, rej);
  }
});

export const { clearFeedback } = slice.actions;
export default slice.reducer;
