import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '@/shared/components/Sidebar';
import Header from '@/shared/components/Header';
import AchievementCard from '@/shared/components/AchievementCard';
import styles from './ProfilePage.module.css';
import layoutStyles from '@/shared/layout/MainLayout.module.css';
import { getUserDetails } from "@/shared/auth/token";
import { fetchUserAchievements } from "@/features/achievements/userAchievementsSlice";
import { fetchUserActivity } from "@/features/achievements/activitySlice";
import { fetchUsers } from "@/features/users/usersSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useEffect } from "react";
import '@/styles/toast.css';
import '@/styles/confirm.css';
import ToastViewport from '@/shared/components/ToastViewport';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

export default function ProfilePage(){
    const dispatch = useDispatch<AppDispatch>();
    const { userId } = useParams<{ userId: string }>();
    const [activeTab, setActiveTab] = useState('profile');
    const [currentPage, setCurrentPage] = useState(1);

    const { data, loading, error } = useSelector((state: RootState) => state.userAchievements);
    const { data: activityData, loading: activityLoading, error: activityError } = useSelector((state: RootState) => state.activity);
    const { data: usersData, loading: usersLoading, error: usersError } = useSelector((state: RootState) => state.users);
    const userDetails = getUserDetails();
    
    const targetUserId = userId || userDetails?.id;
    const isOwnProfile = !userId || userId === userDetails?.id;

    useEffect(() => {
        setActiveTab('profile');
    }, [targetUserId]);

    useEffect(() => {
      if (targetUserId) {
        dispatch(fetchUserAchievements(targetUserId));
      }
    }, [dispatch, targetUserId]);

    useEffect(() => {
      if (activeTab === 'activity' && targetUserId) {
        dispatch(fetchUserActivity(targetUserId));
      }
    }, [activeTab, targetUserId, dispatch]);

    useEffect(() => {
      if (activeTab === 'colleagues') {
        dispatch(fetchUsers({ page: currentPage, size: 10 }));
      }
    }, [activeTab, currentPage, dispatch]);

    useEffect(() => {
      if (activeTab !== 'colleagues') {
        setCurrentPage(1);
      }
    }, [activeTab]);

    const userDataReal = data?.user;
    const sections  = data?.sections;
    const userData = {
        name: 'Перяшкин Василий Андреевич',
        position: 'Frontend Developer',
        department: 'Отдел разработки для управления персоналом',
        email: 'vasilij.peryashkin@t1.ru',
        phone: '+7 (495) 123-45-67',
        location: 'Москва, ул. Тверская, 1',
        avatar: 'ВА',
        initials: 'ВА'
    };

   
   

    
    const tabs = [
        { id: 'profile', label: 'Профиль' },
        { id: 'activity', label: 'Активность' },
        { id: 'achievements', label: 'Достижения' },
        ...(isOwnProfile ? [{ id: 'colleagues', label: 'Коллеги' }] : [])
    ];

    const renderProfileContent = () => (
        <div className={styles.profileInfoContent}>
            <div className={styles.profileInfoGrid}>
                <div className={styles.infoSection}>
                    <h3>Контактная информация</h3>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Email:</span>
                        <span className={styles.infoValue}>{userData.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Телефон:</span>
                        <span className={styles.infoValue}>{userData.phone}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Адрес:</span>
                        <span className={styles.infoValue}>{userData.location}</span>
                    </div>
                </div>
                
                <div className={styles.infoSection}>
                    <h3>Рабочая информация</h3>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Должность:</span>
                        <span className={styles.infoValue}>{userDataReal?.position}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Отдел:</span>
                        <span className={styles.infoValue}>{userDataReal?.department}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Дата приема:</span>
                        <span className={styles.infoValue}>15.03.2023</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAchievementsContent = () => {
        if( loading ) return <div>Loading...</div>;
        if( error ) return <div>Error: {error}</div>;
        if( !data ) return <div>No data</div>;

        
        return (
            <div className={styles.achievementsContent}>
                {sections?.map((cat) => {
                    const filtered = cat.achievements
                    return (
                        <section key={cat.id} className={styles.achievementSection}>
                            <h2 className={styles.achievementSectionTitle}>{cat.name}</h2>
                            <p className={styles.achievementsDescriptionLarge}>{cat.description}</p>
                            <div className={styles.achievementsGridSmall}>
                                {filtered.map((achievement) => (
                                    <AchievementCard key={achievement.id} achievement={achievement} showPopup={true} />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        );
    };

    const renderActivityContent = () => {
        if (activityLoading) return <div className={styles.loadingState}>Загрузка активности...</div>;
        if (activityError) return <div className={styles.errorState}>Ошибка: {activityError}</div>;
        if (!activityData?.items || activityData.items.length === 0) {
            return <div className={styles.emptyState}>Активность пока отсутствует</div>;
        }

        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        return (
            <div className={styles.activityContent}>
                <h2 className={styles.activityTitle}>Лента активности</h2>
                <div className={styles.activityList}>
                    {activityData.items.map((item, index) => (
                        <div key={index} className={styles.activityItem}>
                            <div className={styles.activityIcon}>
                                <img 
                                    src={item.iconUrl} 
                                    alt={item.title}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className={styles.activityContent}>
                                <div className={styles.activityMessage}>{item.message}</div>
                                <div className={styles.activityDate}>{formatDate(item.awardedAt)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderColleaguesContent = () => {
        if (usersLoading) return <div className={styles.loadingState}>Загрузка коллег...</div>;
        if (usersError) return <div className={styles.errorState}>Ошибка: {usersError}</div>;
        
        const totalPages = usersData?.totalPages || 1;
        const currentPageData = usersData?.page || 0;
        
        if (currentPageData > totalPages && totalPages > 0) {
            setCurrentPage(1);
            return <div className={styles.loadingState}>Переход на первую страницу...</div>;
        }
        
        if (!usersData?.content || usersData.content.length === 0) {
            return <div className={styles.emptyState}>Коллеги не найдены</div>;
        }

        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <div className={styles.colleaguesContent}>
                <h2 className={styles.colleaguesTitle}>Мои коллеги</h2>
                <div className={styles.colleaguesGrid}>
                    {usersData.content.map((user) => (
                        <Link 
                            key={user.id} 
                            to={`/user/${user.id}`} 
                            className={styles.colleagueCard}
                            style={{ textDecoration: 'none' }}
                            onClick={() => {
                                setActiveTab('profile');
                            }}
                        >
                            <div className={styles.colleagueAvatar}>
                                <img 
                                    src={user.avatarUrl} 
                                    alt={user.fullName}
                                    onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.style.display = 'none';
                                        const nextElement = target.nextElementSibling as HTMLElement;
                                        if (nextElement) {
                                            nextElement.style.display = 'flex';
                                        }
                                    }}
                                />
                                {/* <div className={styles.colleagueInitials}>
                                    {user.fullName.split(' ').map(n => n[0]).join('')}
                                </div> */}
                            </div>
                            <div className={styles.colleagueInfo}>
                                <h3 className={styles.colleagueName}>{user.fullName}</h3>
                                <p className={styles.colleagueRole}>{user.position}</p>
                                <p className={styles.colleagueEmail}>{user.department}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button 
                            className={styles.paginationButton}
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        {pages.slice(0, pages.length - 1).map((page) => (
                            <button
                                key={page}
                                className={`${styles.paginationButton} ${currentPage === page ? styles.active : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button 
                            className={styles.paginationButton}
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages-1}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileContent();
            case 'achievements':
                return renderAchievementsContent();
            case 'activity':
                return renderActivityContent();
            case 'colleagues':
                return renderColleaguesContent();
            default:
                return renderProfileContent();
        }
    };


  const achievements = sections?.flatMap(section => section.achievements);
  
    return (
        <div className={layoutStyles.mainLayout}>
            <Sidebar />
            <div className="main-content">
                <Header title={isOwnProfile ? "Профиль" : `Профиль ${userDataReal?.fullName || 'пользователя'}`} />

                <div className={styles.profileLayout}>
                    <div className={styles.leftSidebar}>
                        <div className={styles.userInfoCard}>
                            <div className={styles.userPhoto}>
                                <img className={styles.avatarCircle} src={`${userDataReal?.avatarUrl}`}/>
                            </div>
                            <div className={styles.userDetails}>
                                <h2 className={styles.userNameLarge}>{userDataReal?.fullName}</h2>
                                <p className={styles.userPosition}>{userDataReal?.position}</p>
                                <p className={styles.userDepartment}>{userDataReal?.department}</p>
                                {isOwnProfile && <button className={styles.writeMeButton}>Написать мне</button>}
                            </div>
                        </div>

                        <div className={styles.staticCards}>
                            <div className={styles.staticCard}>
                                <h3 className={styles.cardTitle}>Достижения {achievements?.length}</h3>
                                <div className={styles.achievementsGridSmall}>
                                    {achievements?.slice(0, 12).map((achievement) => (
                                        <AchievementCard key={achievement.id} achievement={achievement} showPopup={false} />
                                    ))}
                                </div>
                                <button type="button" className={styles.viewAllLinkButton} onClick={() => {
                                    setActiveTab('achievements');
                                    if (window.innerWidth <= 900) {
                                        setTimeout(() => {
                                            const achievementsContent = document.querySelector(`.${styles.achievementsContent}`);
                                            if (achievementsContent) {
                                                achievementsContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                setTimeout(() => {
                                                    window.scrollBy({ top: -100, behavior: 'smooth' });
                                                }, 500);
                                            }
                                        }, 100);
                                    }
                                }}>
                                    Посмотреть все
                                </button>
                            </div>

                            <div className={styles.staticCard}>
                                <h3 className={styles.cardTitle}>Грамоты 5</h3>
                                <div className={styles.certificatesPlaceholder}>
                                    <FileText size={40} color="#00AAE6" />
                                </div>
                                <a href="#certificates" className={styles.viewAllLink}>Посмотреть все</a>
                            </div>

                            {isOwnProfile && (
                            <div className={styles.staticCard}>
                                <button 
                                    type="button"
                                    className={styles.colleaguesButton}
                                    onClick={() => {
                                        setActiveTab('colleagues');
                                        if (window.innerWidth <= 900) {
                                            setTimeout(() => {
                                                const colleaguesContent = document.querySelector(`.${styles.colleaguesContent}`);
                                                if (colleaguesContent) {
                                                    colleaguesContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    setTimeout(() => {
                                                        window.scrollBy({ top: -100, behavior: 'smooth' });
                                                    }, 500);
                                                }
                                            }, 100);
                                        }
                                    }}
                                >
                                    <h3 className={styles.cardTitle}>Мои коллеги</h3>
                                    <div className={styles.colleaguesAvatars}>
                                        <div className={`${styles.colleagueAvatar} ${styles.colleagueAvatarTeal}`}>В</div>
                                        <div className={`${styles.colleagueAvatar} ${styles.colleagueAvatarRed}`}>Р</div>
                                        <div className={`${styles.colleagueAvatar} ${styles.colleagueAvatarBlack}`}>А</div>
                                    </div>
                                </button>
                            </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.profileContent}>
                        <div className={styles.profileTabs}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`${styles.profileTab} ${activeTab === tab.id ? styles.active : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className={styles.profileContentArea}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

            <ToastViewport />
            <ConfirmDialog />
        </div>
    );
}