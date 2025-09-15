import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../shared/api/http';

export interface AllAchievement {
  id: string;
  title: string;
  iconUrl: string;
  currentStep: number;
  totalSteps: number;
  awarded: boolean;
  rarityPercent: number;
  awardedAt?: string;
}

export interface AchievementSection {
  id: string;
  name: string;
  description: string;
  achievements: AllAchievement[];
}

export interface AllAchievementsResponse {
  sections: AchievementSection[];
}

interface AllAchievementsState {
  data: AllAchievementsResponse | null;
  loading: boolean;
  error?: string;
}

const initialState: AllAchievementsState = {
  data: null,
  loading: false,
  error: undefined,
};

export const fetchAllAchievements = createAsyncThunk<AllAchievementsResponse>(
  'achievements/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<AllAchievementsResponse>(`/achievements/map`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const allAchievementsSlice = createSlice({
  name: 'allAchievements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAchievements.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAllAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default allAchievementsSlice.reducer;
