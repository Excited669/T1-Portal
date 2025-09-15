import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from '@/shared/auth/token';
import { store } from '@/app/store';
import { addToast } from '@/features/notifications/notificationsSlice';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const api = axios.create({
  baseURL: 'http://10.10.146.200:8888',
  withCredentials: false
});

api.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  

  if (cfg.data instanceof FormData) {
    delete cfg.headers['Content-Type'];
  } else {
    cfg.headers['Content-Type'] = 'application/json';
  }
  
  return cfg;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Неизвестная ошибка';
    store.dispatch(addToast({ 
      id: genId(), 
      type: 'error', 
      message, 
      title: 'Ошибка', 
      timeout: 6000 
    }));
    return Promise.reject(error);
  }
);

export async function request<T = unknown>(config: AxiosRequestConfig, opts?: { successMessage?: string }) {
  const res = await api.request<T>(config);
  if (opts?.successMessage) {
    store.dispatch(
      addToast({ 
        id: genId(), 
        type: 'success', 
        message: opts.successMessage, 
        title: 'Готово' 
      })
    );
  }
  return res;
}

