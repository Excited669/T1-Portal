import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import styles from './AchievementCard.module.css';
import { fetchAchievementsDetails } from '@/features/achievements/achievementDetailsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { getUserDetails } from '@/shared/auth/token';
import { useSelector } from 'react-redux';


 interface Achievement {
  id: string;
  title: string;
  iconUrl: string;
  currentStep: number;
  totalSteps: number;
  awarded: boolean;
  rarityPercent: number;

}

interface AchievementCardProps {
  achievement: Achievement;
  showPopup?: boolean;
}

function AchievementCard ({ achievement, showPopup = false }: AchievementCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPopupState, setShowPopupState] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = getUserDetails();
  const achievementDetails = useSelector((state: RootState) => state.achievementsDetails[achievement.id]);
  const { data } = achievementDetails || { data: null, loading: false, error: undefined };
  
  
  useEffect(() => {
    if (userDetails?.id && achievement.id) {
      dispatch(fetchAchievementsDetails({ userId: userDetails.id, achievementId: achievement.id }));
    }
  }, [dispatch, achievement.id, userDetails?.id]);

  const getRarityColor = (rarityPercent: number) => {
    
    if( rarityPercent < 25 ){
      return '#fd7e14';
    }
    if( rarityPercent < 45 ){
      return '#6f42c1';
    }
    if( rarityPercent < 70 ){
      return '#17a2b8';
    }
    return '#6c757d'; 
  };

  const getRarityName = (rarityPercent: number) => {
    if( rarityPercent < 25 ){
      return 'Legendary';
    }
    if( rarityPercent < 45 ){
      return 'Epic';
    }
    if( rarityPercent < 70 ){
      return 'Rare';
    }
    return 'Common'; 
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleAchievementClick = () => {
    if (showPopup) {
      setShowPopupState(true);
      setShowTooltip(false);
    }
  };

  return (
    <div 
      className={styles.achievementCardContainer}
      onMouseEnter={() => !showPopupState && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleAchievementClick}
    >
      <div 
        className={`${styles.achievementIcon} ${achievement.awarded ? styles.achievementIconEarned : styles.achievementIconLocked}`}
        style={{ 
          backgroundColor: achievement.awarded ? getRarityColor(achievement.rarityPercent) : '#e9ecef',
          color: achievement.awarded ? 'white' : '#6c757d'
        }}
      >
       <img src={achievement.iconUrl} alt="Achievement Icon" className={styles.achievementIconPng} />
      </div>
      
      {showTooltip && !showPopupState && (
        <div className={styles.achievementTooltip}>
          <div className={styles.tooltipHeader}>
            <div 
              className={styles.tooltipIcon}
              style={{ backgroundColor: getRarityColor(achievement.rarityPercent) }}
            >
              <img src={achievement.iconUrl} alt="Achievement Icon" className={styles.achievementIconPng} />
            </div>
            <div className={styles.tooltipInfo}>
              <h4>{achievement.title}</h4>
              <span className={styles.rarityBadge_small} style={{ color: getRarityColor(achievement.rarityPercent) }}>
                {getRarityName(achievement.rarityPercent)}
              </span>
            </div>
          </div>
          
          <p className={styles.tooltipDescription}>{data?.descriptionMd}</p>
          
          
          
          {data?.awarded && data?.awardedAt && (
            <div className={styles.tooltipDate}>
              <Calendar size={14} />
              <span>Получена {formatDate(data.awardedAt)}</span>
            </div>
          )}
          
          {!achievement.awarded && (
            <div className={styles.tooltipLocked}>
              <span>Достижение не открыто</span>
            </div>
          )}
        </div>
      )}

      {showPopupState && (
        <div className={styles.achievementPopupOverlay} onClick={() => setShowPopupState(false)}>
          <div className={styles.achievementPopup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <h3>Детали ачивки</h3>
              <button 
                className={styles.popupClose}
                onClick={() => setShowPopupState(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.popupContent}>
              <div className={styles.popupAchievementIcon}>
                <div 
                  className={`${styles.achievementIcon} ${styles.achievementIconEarned}`}
                  style={{ backgroundColor: getRarityColor(achievement.rarityPercent) }}
                >
                  <img src={data?.animationUrl} alt="Achievement Icon" className={styles.achievementIconPng} />
                </div>
              </div>
              
              <div className={styles.popupAchievementInfo}>
                <h4>{achievement.title}</h4>
                <span className={styles.rarityBadge} style={{ color: getRarityColor(achievement.rarityPercent) }}>
                  {getRarityName(achievement.rarityPercent)}
                </span>
                <p className={styles.popupDescription}>{data?.descriptionMd}</p>
                
                {achievement.currentStep !== undefined && achievement.totalSteps !== undefined && (
                  <div className={styles.popupProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ 
                          width: `${(achievement.currentStep / achievement.totalSteps) * 100}%`,
                          backgroundColor: getRarityColor(achievement.rarityPercent)
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {data?.awarded && data?.awardedAt && (
                  <div className={styles.popupDate}>
                    <Calendar size={16} />
                    <span>Получена {formatDate(data.awardedAt)}</span>
                  </div>
                )}
                
                {data?.awardMethod && (
                  <div className={styles.popupReason}>
                    <h5>Причина получения:</h5>
                    <p>{data?.awardMethod}</p>
                  </div>
                )}
                
                {!achievement.awarded && (
                  <div className={styles.popupLocked}>
                    <span>Достижение не открыто</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementCard;

