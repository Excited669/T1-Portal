import { redirect } from 'react-router-dom';
import { getToken, getRole } from './token';

export function requireUserLoader() {
  if (!getToken()) {
    return redirect('/login');
  }
  return null;
}

export function requireAdminLoader() {
  const token = getToken();
  if (!token) return window.location.href = '/login';
  const role = getRole();
  if (role !== 'ADMIN') return window.location.href = '/login';

  return null;
}

