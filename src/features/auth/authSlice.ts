import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/shared/api/http";
import { setToken, setRole, loadTokenOnBoot } from "@/shared/auth/token";

type AuthState = {
    isAuth : boolean,
    loading: boolean,
    error: string | null,
    role : string | null
}

const initialState: AuthState = {
    isAuth: false,
    loading: false,
    error: null,
    role: null
}


export const login = createAsyncThunk<{token: string, role: string}, {username : string, password : string}>(
    "auth/login",
    async ( payload, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', payload);
            return data
        }catch(e : any){
            if (e?.response?.status === 403) {
                return rejectWithValue('Неверные учетные данные');
            }
            return rejectWithValue(e?.response?.data?.message || 'Ошибка входа в систему');
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            setToken(null);
            setRole(null);
            return { success: true };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
)

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    rehydrate(state) { loadTokenOnBoot(); state.isAuth = !!sessionStorage.getItem('auth.accessToken'); }
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s)=>{ s.loading = true; s.error=null; });
    b.addCase(login.fulfilled, (s, a)=>{ s.loading=false; s.isAuth=true; s.role = a.payload.role; setToken(a.payload.token); setRole(a.payload.role); });
    b.addCase(login.rejected, (s, a)=>{ s.loading=false; s.error = a.payload as string; });
    b.addCase(logout.fulfilled, (s)=>{ Object.assign(s, initialState); });
  }
});

export const { rehydrate } = slice.actions;
export default slice.reducer;