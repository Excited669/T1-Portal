import { configureStore } from '@reduxjs/toolkit';
import achievementsReducer from '@/features/achievements/userAchievementsSlice';
import authReducer from '@/features/auth/authSlice';
import achievementsDetailsReducer from '@/features/achievements/achievementDetailsSlice';
import allAchievementsReducer from '@/features/achievements/allAchievementsSlice';
import adminReducer from '@/features/admin/adminSlice';
import adminUserAchievementsReducer from '@/features/admin/adminUserAchievementsSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import confirmReducer from '@/features/confirm/confirmSlice';
import testsReducer from '@/features/tests/testsSlice';
import activityReducer from '@/features/achievements/activitySlice';
import usersReducer from '@/features/users/usersSlice';

export const store = configureStore({
  reducer: {
    userAchievements: achievementsReducer,
    auth: authReducer,
    achievementsDetails: achievementsDetailsReducer,
    allAchievements: allAchievementsReducer,
    admin: adminReducer,
    adminUserAchievements: adminUserAchievementsReducer,
    notifications: notificationsReducer,
    confirm: confirmReducer,
    tests: testsReducer,
    activity: activityReducer,
    users: usersReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
