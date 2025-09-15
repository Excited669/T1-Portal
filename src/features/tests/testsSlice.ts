import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/shared/api/http';

interface TestPassedRequest {
  userId: string;
  testCode: string;
}

interface TestsState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: TestsState = {
  loading: false,
  error: null,
  success: false,
};

export const sendTestPassed = createAsyncThunk(
  'tests/sendTestPassed',
  async (data: TestPassedRequest) => {
    const response = await api.post('/events/tests/passed', data);
    return response.data;
  }
);

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    clearTestState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendTestPassed.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendTestPassed.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(sendTestPassed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка отправки данных о тесте';
        state.success = false;
      });
  },
});

export const { clearTestState } = testsSlice.actions;
export default testsSlice.reducer;
