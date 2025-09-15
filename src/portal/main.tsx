import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { rehydrate } from '@/features/auth/authSlice';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from '@/auth/main';
import NewsFeed from '@/pages/NewsFeed';
import ProfilePage from '@/pages/ProfilePage';
import AchievementsPage from '@/pages/AchievementsPage';
import AchievementsMapPage from '@/pages/AchievementsMapPage';
import EducationPage from '@/pages/education/EducationPage';
import AdminPanel from '@/admin/main';
import { requireAdminLoader, requireUserLoader } from '@/shared/auth/guard';
import '@/styles/toast.css';
import '@/styles/confirm.css';

store.dispatch(rehydrate());

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/news',
    element: <NewsFeed />,
    loader: requireUserLoader
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    loader: requireUserLoader
  },
  {
    path: '/user/:userId',
    element: <ProfilePage />,
    loader: requireUserLoader
  },
  {
    path: '/achievment',
    element: <AchievementsPage />,
    loader: requireUserLoader
  },
  {
    path: '/achievements-map',
    element: <AchievementsMapPage />,
    loader: requireUserLoader
  },
  {
    path: '/education',
    element: <EducationPage />,
    loader: requireUserLoader
  },
  {
    path: '/admin',
    element: <AdminPanel />,
    loader: requireAdminLoader
  }
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);