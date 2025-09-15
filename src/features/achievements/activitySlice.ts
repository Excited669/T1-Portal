import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/shared/api/http';

interface ActivityItem {
  achievementId: string;
  title: string;
  iconUrl: string;
  awardedAt: string;
  message: string;
}

interface ActivityResponse {
  items: ActivityItem[];
}

interface ActivityState {
  data: ActivityResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUserActivity = createAsyncThunk(
  'activity/fetchUserActivity',
  async (userId: string) => {
    const response = await api.get<ActivityResponse>(`/achievements/activity/${userId}`);
    return response.data;
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivity: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки активности';
      });
  },
});

export const { clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
