import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../shared/api/http';

export interface Achievement {
  id: string;
  title: string;
  iconUrl: string;
  currentStep: number;
  totalSteps: number;
  awarded: boolean;
  rarityPercent: number;
}

export interface AchievementSection {
  id: string;
  name: string;
  description: string;
  achievements: Achievement[];
}

export interface UserProfile {
  fullName: string;
  department: string;
  position: string;
  avatarUrl: string;
}

export interface UserAchievementsResponse {
  user: UserProfile;
  unlockedCount: number;
  sections: AchievementSection[];
}

interface UserAchievementsState {
  data: UserAchievementsResponse | null; 
  loading: boolean;
  error?: string;
}

const initialState: UserAchievementsState = {
  data: null,
  loading: false,
  error: undefined,
};


export const fetchUserAchievements = createAsyncThunk<UserAchievementsResponse, string>(
  'achievements/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get<UserAchievementsResponse>(`/achievements/user/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const assignAchievementToUser = createAsyncThunk<void, { userId: string; achievementId: string }>(
  'achievements/assignAchievement',
  async ({ userId, achievementId }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/admin/users/${userId}/achievements/${achievementId}`);
      dispatch(fetchUserAchievements(userId));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка назначения достижения');
    }
  }
);

export const removeAchievementFromUser = createAsyncThunk<void, { userId: string; achievementId: string }>(
  'achievements/removeAchievement',
  async ({ userId, achievementId }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}/achievements/${achievementId}`);
      dispatch(fetchUserAchievements(userId));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления достижения');
    }
  }
);

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAchievements.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(assignAchievementToUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(assignAchievementToUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignAchievementToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeAchievementFromUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(removeAchievementFromUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeAchievementFromUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default achievementsSlice.reducer;
