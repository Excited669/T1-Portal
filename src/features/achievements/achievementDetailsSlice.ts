import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../shared/api/http';

export interface Achievement {
    id: string,
    code: string,
    title: string,
    shortDescription: string,
    descriptionMd: string,
    animationUrl: string,
    awarded: boolean,
    awardedAt: string,
    awardMethod: "string",
    currentStep: number,
    totalSteps: number,
    rarityPercent: number
}



interface AchievementDetailsState {
  [achievementId: string]: {
    data: Achievement | null;
    loading: boolean;
    error?: string;
  };
}

const initialState: AchievementDetailsState = {};


export const fetchAchievementsDetails = createAsyncThunk<Achievement, { userId: string, achievementId: string }>(
  'achievements/fetchDetails',
  async ({ userId, achievementId }, { rejectWithValue }) => {
    try {
      const res = await api.get<Achievement>(`/achievements/details/${achievementId}/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const achievementsSlice = createSlice({
  name: 'achievementsDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievementsDetails.pending, (state, action) => {
        const achievementId = action.meta.arg.achievementId;
        if (!state[achievementId]) {
          state[achievementId] = { data: null, loading: false, error: undefined };
        }
        state[achievementId].loading = true;
        state[achievementId].error = undefined;
      })
      .addCase(fetchAchievementsDetails.fulfilled, (state, action) => {
        const achievementId = action.meta.arg.achievementId;
        state[achievementId].loading = false;
        state[achievementId].data = action.payload;
      })
      .addCase(fetchAchievementsDetails.rejected, (state, action) => {
        const achievementId = action.meta.arg.achievementId;
        state[achievementId].loading = false;
        state[achievementId].error = action.payload as string;
      });
  }
});

export default achievementsSlice.reducer;
