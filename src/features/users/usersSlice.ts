import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/shared/api/http';

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

interface UsersState {
  data: UsersResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, size = 10 }: { page?: number; size?: number } = {}) => {
    const response = await api.get<UsersResponse>(`/users?page=${page}&size=${size}`);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки пользователей';
      });
  },
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
