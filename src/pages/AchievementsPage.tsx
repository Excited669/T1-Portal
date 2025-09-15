import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAchievements } from '@/features/achievements/userAchievementsSlice';
import { RootState, AppDispatch } from '../app/store';
import { Trophy, Star, Target, Users, BookOpen, Award, Calendar, TrendingUp, Code, Heart, Zap, Shield } from 'lucide-react';
import Sidebar from '@/shared/components/Sidebar';
import AchievementCard from '@/shared/components/AchievementCard';
import styles from './AchievementsPage.module.css';
import layoutStyles from '@/shared/layout/MainLayout.module.css';
import { getUserDetails } from '@/shared/auth/token';
import '@/styles/toast.css';
import '@/styles/confirm.css';
import ToastViewport from '@/shared/components/ToastViewport';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

export default function AchievementsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.achievements);
  const userDetails = getUserDetails();
  useEffect(() => {
    dispatch(fetchUserAchievements(userDetails?.id));
  }, [dispatch]);

  const getAchievementIcon = (achievementType: string) => {
    switch (achievementType?.toLowerCase()) {
      case 'trophy':
      case 'first':
        return <Trophy size={20} />;
      case 'star':
      case 'excellent':
        return <Star size={20} />;
      case 'target':
      case 'goal':
        return <Target size={20} />;
      case 'users':
      case 'team':
        return <Users size={20} />;
      case 'book':
      case 'learning':
        return <BookOpen size={20} />;
      case 'award':
      case 'mentor':
        return <Award size={20} />;
      case 'code':
      case 'development':
        return <Code size={20} />;
      case 'heart':
      case 'social':
        return <Heart size={20} />;
      case 'zap':
      case 'speed':
        return <Zap size={20} />;
      case 'shield':
      case 'quality':
        return <Shield size={20} />;
      default:
        return <Trophy size={20} />;
    }
  };

  const getAchievementRarity = (achievement: any): 'common' | 'rare' | 'epic' | 'legendary' => {
    if (achievement.rarityPercent) {
      if (achievement.rarityPercent < 5) return 'legendary';
      if (achievement.rarityPercent < 15) return 'epic';
      if (achievement.rarityPercent < 30) return 'rare';
      return 'common';
    }
    return 'common';
  };

  const transformAchievements = (serverAchievements: any[]) => {
    return serverAchievements.map(achievement => ({
      id: achievement.id,
      title: achievement.name || achievement.title || 'Достижение',
      description: achievement.description || 'Описание достижения',
      icon: getAchievementIcon(achievement.type || achievement.category),
      progress: achievement.currentStep,
      maxProgress: achievement.totalSteps,
      dateEarned: achievement.awardedAt ? new Date(achievement.awardedAt).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) : undefined,
      isEarned: achievement.awarded || false,
      rarity: getAchievementRarity(achievement),
      category: achievement.category || 'general',
      reason: achievement.awardMethod || undefined
    }));
  };

  if (loading) return (
    <div className={layoutStyles.mainLayout}>
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Достижения</h1>
        </div>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p>Загрузка достижений...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className={layoutStyles.mainLayout}>
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Достижения</h1>
        </div>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p>Ошибка загрузки: {error}</p>
        </div>
      </div>
    </div>
  );

  const transformedAchievements = transformAchievements(data);

  return (
    <div className={layoutStyles.mainLayout}>
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Достижения</h1>
        </div>
        
        <div style={{ padding: '24px' }}>
          {transformedAchievements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Достижения не найдены</p>
            </div>
          ) : (
            <div className={styles.achievementsGridFull}>
              {transformedAchievements.map((achievement) => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={achievement} 
                  showPopup={true} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastViewport />
      <ConfirmDialog />
    </div>
  );
}
