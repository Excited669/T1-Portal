import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/shared/api/http';

export interface AdminUserAchievement {
  id: string;
  title: string;
  iconUrl: string;
  awardedAt: string;
  rarityPercent: number;
}

export interface AdminUserAchievementsState {
  achievementsByUser: Record<string, AdminUserAchievement[]>; 
  loading: boolean;
  error: string | null;
}

const initialState: AdminUserAchievementsState = {
  achievementsByUser: {},
  loading: false,
  error: null,
};

export const fetchAdminUserAchievements = createAsyncThunk<AdminUserAchievement[], string>(
  'adminUserAchievements/fetchUserAchievements',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/achievements/user/${userId}`);
      
      if (response.data && response.data.sections && Array.isArray(response.data.sections)) {
        const allAchievements: AdminUserAchievement[] = [];
        response.data.sections.forEach((section: any) => {
          if (section.achievements && Array.isArray(section.achievements)) {
            section.achievements.forEach((achievement: any) => {
              allAchievements.push({
                id: achievement.id,
                title: achievement.title,
                iconUrl: achievement.iconUrl || '',
                awardedAt: achievement.awardedAt || new Date().toISOString(),
                rarityPercent: achievement.rarityPercent || 0
              });
            });
          }
        });
        return allAchievements;
      } else if (response.data && Array.isArray(response.data.content)) {
        return response.data.content;
      } else {
        return [];
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки достижений пользователя');
    }
  }
);

export const assignAchievementToUser = createAsyncThunk<void, { userId: string; achievementId: string }>(
  'adminUserAchievements/assignAchievement',
  async ({ userId, achievementId }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/admin/users/${userId}/achievements/${achievementId}`);
      dispatch(fetchAdminUserAchievements(userId));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка назначения достижения');
    }
  }
);

export const removeAchievementFromUser = createAsyncThunk<void, { userId: string; achievementId: string }>(
  'adminUserAchievements/removeAchievement',
  async ({ userId, achievementId }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}/achievements/${achievementId}`);
      dispatch(fetchAdminUserAchievements(userId));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления достижения');
    }
  }
);

const adminUserAchievementsSlice = createSlice({
  name: 'adminUserAchievements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUserAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUserAchievements.fulfilled, (state, action) => {
        state.loading = false;
        const userId = action.meta.arg;
        state.achievementsByUser[userId] = action.payload;
      })
      .addCase(fetchAdminUserAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(assignAchievementToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignAchievementToUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignAchievementToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(removeAchievementFromUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAchievementFromUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeAchievementFromUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminUserAchievementsSlice.actions;
export default adminUserAchievementsSlice.reducer;

