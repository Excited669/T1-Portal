import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/shared/api/http';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface AchievementCriteria {
  code: string;
  name: string;
  description: string;
  inputType: string;
  unit: string;
}

export interface ActivityType {
  id: string;
  code: string;
  name: string;
}

export interface AchievementCriterion {
  id: string;
  activityType: ActivityType;
  requiredCount: number;
  withinDays: number;
  descriptionOverride: string;
  sortOrder: number;
}

export interface AchievementSection {
  id: string;
  code: string;
  name: string;
}

export interface AdminAchievement {
  id: string;
  code?: string;
  title: string;
  shortDescription: string;
  descriptionMd: string;
  sectionIds: string[];
  points: number;
  repeatable?: boolean;
  visibility?: string;
  iconUrl?: string;
  bannerUrl?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  totalSteps?: number;
  criteria?: AchievementCriterion[];
  sections?: AchievementSection[];
}

export interface CreateSectionRequest {
  name: string;
  description: string;
}

export interface UpdateSectionRequest {
  id: string;
  name: string;
  description: string;
}

export interface AchievementCriterionRequest {
  typeCode: string;
  value: number;
  withinDays?: number;
  descriptionOverride?: string;
  sortOrder?: number;
}

export interface CreateAchievementRequest {
  title: string;
  descriptionMd: string;
  sectionIds: string[]; 
  criteria: AchievementCriterionRequest[];
  points: number;
  icon?: string;
  animation?: string;
}

export interface UpdateAchievementRequest {
  id: string;
  title: string;
  descriptionMd: string;
  sectionIds: string[]; 
  criteria: AchievementCriterionRequest[];
  points: number;
  icon?: string;
  animation?: string;
}

interface User {
  id: string;
  fullName: string;
  department: string;
  position: string;
  avatarUrl: string;
}

interface UsersResponse {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface AdminState {
  categories: Category[];
  achievements: AdminAchievement[];
  criteria: AchievementCriteria[];
  users: User[];
  usersPagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  categories: [],
  achievements: [],
  criteria: [],
  users: [],
  usersPagination: null,
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<Category[]>(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки категорий');
    }
  }
);

export const fetchAchievementCriteria = createAsyncThunk<AchievementCriteria[]>(
  'admin/fetchAchievementCriteria',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<AchievementCriteria[]>('/admin/achievements/criteria');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки критериев');
    }
  }
);

export const fetchAllAchievements = createAsyncThunk<AdminAchievement[]>(
  'admin/fetchAllAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<AdminAchievement[]>('/admin/achievements/full');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки достижений');
    }
  }
);

export const createSection = createAsyncThunk<Category, CreateSectionRequest>(
  'admin/createSection',
  async (sectionData, { rejectWithValue }) => {
    try {
      const response = await api.post<Category>('/admin/sections', sectionData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка создания раздела');
    }
  }
);

export const updateSection = createAsyncThunk<Category, UpdateSectionRequest>(
  'admin/updateSection',
  async (sectionData, { rejectWithValue }) => {
    try {
      const response = await api.patch<Category>(`/admin/sections/${sectionData.id}`, {
        name: sectionData.name,
        description: sectionData.description
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка обновления раздела');
    }
  }
);

export const fetchAllUsers = createAsyncThunk<UsersResponse, { page?: number; size?: number }>(
  'admin/fetchAllUsers',
  async ({ page = 1, size = 20 }, { rejectWithValue }) => {
    try {
      const apiPage = page - 1;
      const response = await api.get<UsersResponse>(`/users?page=${apiPage}&size=${size}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки пользователей');
    }
  }
);

export interface CreateAchievementWithFilesRequest {
  request: CreateAchievementRequest;
  iconFile?: File;
  animationFile?: File;
}

export interface UpdateAchievementWithFilesRequest {
  request: UpdateAchievementRequest;
  iconFile?: File;
  animationFile?: File;
}

export const createAchievement = createAsyncThunk<AdminAchievement, CreateAchievementWithFilesRequest>(
  'admin/createAchievement',
  async ({ request, iconFile, animationFile }, { rejectWithValue }) => {
    try {
      const form = new FormData();

       const requestJson = JSON.stringify(request);
       const requestBlob = new Blob([requestJson], { type: 'application/json' });
       form.append('request', requestBlob);

      if (iconFile) {
        form.append('icon', iconFile);
      }
      
      if (animationFile) {
        form.append('animation', animationFile);
      }

       const response = await api.post<AdminAchievement>('/admin/achievements', form);
 
       return response.data;
    } catch (err: any) {
      const payload = err?.response?.data ?? { message: err.message || 'Upload failed. Unknown error.' };
      return rejectWithValue(payload);
    }
  }
);

export const updateAchievement = createAsyncThunk<AdminAchievement, UpdateAchievementWithFilesRequest>(
  'admin/updateAchievement',
  async ({ request, iconFile, animationFile }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      const id = request.id;
      const { id: _, ...requestWithoutId } = request;
      if (Object.keys(requestWithoutId).length > 0) {
        const requestJson = JSON.stringify(requestWithoutId);
        const requestBlob = new Blob([requestJson], { type: 'application/json' });
        form.append('request', requestBlob);
      }

      if (iconFile) {
        form.append('icon', iconFile);
      }
      
      if (animationFile) {
        form.append('animation', animationFile);
      }

      const response = await api.patch<AdminAchievement>(`/admin/achievements/${id}`, form);

      return response.data;
    } catch (err: any) {
      const payload = err?.response?.data ?? { message: err.message || 'Upload failed. Unknown error.' };
      return rejectWithValue(payload);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAchievementCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievementCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria = action.payload;
      })
      .addCase(fetchAchievementCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAllAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAllAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements.push(action.payload);
      })
      .addCase(createAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAchievement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.achievements.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.achievements[index] = action.payload;
        }
      })
      .addCase(updateAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content;
        state.usersPagination = {
          page: action.payload.page + 1,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError
} = adminSlice.actions;

export default adminSlice.reducer;
