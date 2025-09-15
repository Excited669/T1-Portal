import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAchievements } from '@/features/achievements/allAchievementsSlice';
import { RootState, AppDispatch } from '../app/store';
import Sidebar from '@/shared/components/Sidebar';
import AchievementCard from '@/shared/components/AchievementCard';
import styles from './AchievementsPage.module.css';
import layoutStyles from '@/shared/layout/MainLayout.module.css';
import mapStyles from './AchievementsMapPage.module.css';
import { getUserDetails } from '@/shared/auth/token';
import { LogOut, Trophy } from 'lucide-react';
import { logout } from '@/features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import '@/styles/toast.css';
import '@/styles/confirm.css';
import ToastViewport from '@/shared/components/ToastViewport';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

export default function AchievementsMapPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state: RootState) => state.allAchievements);
  const userDetails = getUserDetails();

  useEffect(() => {
    if (userDetails?.id) {
      dispatch(fetchAllAchievements());
    }
  }, [dispatch, userDetails?.id]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const getAllAchievements = () => {
    if (!data?.sections) return [];
    return data.sections.flatMap(section => section.achievements);
  };

  if (loading) return (
    <div className={layoutStyles.mainLayout}>
      <Sidebar />
      <div className="main-content">
        <div className={mapStyles.header}>
          <h1 className={mapStyles.pageTitle}>Карта достижений</h1>
          <div className={mapStyles.userProfile}>
            <Link to="/achievements-map" className={mapStyles.achievementsMapButton}>
              <Trophy size={16} />
              <span className={mapStyles.achievementsMapButtonText}>Карта достижений</span>
            </Link>
            <Link to="/profile" className={mapStyles.profileLink}>             
              <img className={mapStyles.userAvatar} src={`${userDetails?.avatarUrl}`} alt="avatar"  />
              <span className={mapStyles.userName}>{userDetails?.fullname}</span>
            </Link>
            <button className={mapStyles.logoutButton} onClick={handleLogout} title="Выйти из аккаунта">
              <LogOut size={20} />
            </button>
          </div>
        </div>
        <div className={`${mapStyles.contentPadding} ${mapStyles.mainContent}`}>
          <p className={mapStyles.loadingText}>Загрузка карты достижений...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className={layoutStyles.mainLayout}>
      <Sidebar />
      <div className="main-content">
        <div className={mapStyles.header}>
          <h1 className={mapStyles.pageTitle}>Карта достижений</h1>
          <div className={mapStyles.userProfile}>
            <Link to="/achievements-map" className={mapStyles.achievementsMapButton}>
              <Trophy size={16} />
              <span className={mapStyles.achievementsMapButtonText}>Карта достижений</span>
            </Link>
            <Link to="/profile" className={mapStyles.profileLink}>             
              <img className={mapStyles.userAvatar} src={`${userDetails?.avatarUrl}`} alt="avatar"  />
              <span className={mapStyles.userName}>{userDetails?.fullname}</span>
            </Link>
            <button className={mapStyles.logoutButton} onClick={handleLogout} title="Выйти из аккаунта">
              <LogOut size={20} />
            </button>
          </div>
        </div>
        <div className={`${mapStyles.contentPadding} ${mapStyles.mainContent}`}>
          <p className={mapStyles.errorText}>Ошибка загрузки: {error}</p>
        </div>
      </div>
    </div>
  );

  const allAchievements = getAllAchievements();

  return (
    <div className={layoutStyles.mainLayout}>
      <Sidebar />
      <div className="main-content">
      <div className={mapStyles.header}>
          <h1 className={mapStyles.pageTitle}>Карта достижений</h1>
          <div className={mapStyles.userProfile}>
            <Link to="/achievements-map" className={mapStyles.achievementsMapButton}>
              <Trophy size={16} />
              <span className={mapStyles.achievementsMapButtonText}>Карта достижений</span>
            </Link>
            <Link to="/profile" className={mapStyles.profileLink}>             
               <img className={mapStyles.userAvatar} src={`${userDetails?.avatarUrl}`} alt="avatar"  />
               <span className={mapStyles.userName}>{userDetails?.fullname}</span>
             </Link>
            <button className={mapStyles.logoutButton} onClick={handleLogout} title="Выйти из аккаунта">
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        <div className={`${mapStyles.mainContentPadding} ${mapStyles.mainContent}`}>
          {!data?.sections || data.sections.length === 0 ? (
            <div className={mapStyles.noAchievementsContainer}>
              <p className={mapStyles.noAchievementsText}>Достижения не найдены</p>
            </div>
          ) : (
            <div>
              {data.sections.map((section) => (
                <div key={section.id} className={styles.achievementSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{section.name}</h2>
                    <p className={styles.sectionDescription}>{section.description}</p>
                  </div>
                  <div className={styles.achievementsGrid}>
                    {section.achievements.map((achievement) => (
                      <AchievementCard 
                        key={achievement.id} 
                        achievement={achievement} 
                        showPopup={true} 
                      />
                    ))}
                  </div>
                </div>
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
