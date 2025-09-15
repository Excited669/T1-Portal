import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '@/shared/api/http';
import { notify } from '@/features/notifications/notify';

interface User {
  id: string;
  fullName: string;
  department: string;
  position: string;
  avatarUrl: string;
}

interface Achievement {
  id: string;
  title: string;
  shortDescription: string;
  iconUrl?: string;
  points?: number;
}

interface UsersResponse {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface AssignModalProps {
  isOpen: boolean;
  selectedUserId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignModal: React.FC<AssignModalProps> = ({
  isOpen,
  selectedUserId,
  onClose,
  onSuccess
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [assignForm, setAssignForm] = useState({ user_id: '', achievement_id: '' });
  const [loading, setLoading] = useState(false);

  // Предварительно заполняем форму при открытии модалки
  useEffect(() => {
    if (isOpen && selectedUserId) {
      setAssignForm(prev => ({ ...prev, user_id: selectedUserId }));
    }
  }, [isOpen, selectedUserId]);

  // Загружаем пользователей и достижения при открытии модалки
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Загружаем пользователей
          const usersResponse = await api.get<UsersResponse>('/users');
          setUsers(usersResponse.data.content);
          
                     // Загружаем достижения
           try {
             const achievementsResponse = await api.get('/admin/achievements/full');
             console.log('Ответ с достижениями:', achievementsResponse.data);
             
             if (achievementsResponse.data && Array.isArray(achievementsResponse.data)) {
               setAchievements(achievementsResponse.data);
             } else if (achievementsResponse.data && Array.isArray(achievementsResponse.data.content)) {
               setAchievements(achievementsResponse.data.content);
             } else if (achievementsResponse.data && Array.isArray(achievementsResponse.data)) {
               // Прямой массив достижений
               const allAchievements: Achievement[] = achievementsResponse.data.map((achievement: any) => ({
                 id: achievement.id,
                 title: achievement.title,
                 shortDescription: achievement.shortDescription || achievement.description || '',
                 iconUrl: achievement.iconUrl || '',
                 points: achievement.points || 0
               }));
               setAchievements(allAchievements);
               console.log(`Извлечено ${allAchievements.length} достижений для модалки`);
             } else {
               console.warn('Неожиданная структура ответа с достижениями:', achievementsResponse.data);
               setAchievements([]);
             }
           } catch (err) {
             console.error('Ошибка загрузки достижений:', err);
             // Попробуем альтернативный endpoint - карта ачивок
             try {
               const altResponse = await api.get('/achievements/map');
               console.log('Альтернативный ответ (карта ачивок):', altResponse.data);
               // Извлекаем все достижения из всех секций
               if (altResponse.data && altResponse.data.sections && Array.isArray(altResponse.data.sections)) {
                 const allAchievements: Achievement[] = [];
                 altResponse.data.sections.forEach((section: any) => {
                   if (section.achievements && Array.isArray(section.achievements)) {
                     section.achievements.forEach((achievement: any) => {
                       allAchievements.push({
                         id: achievement.id,
                         title: achievement.title,
                         shortDescription: achievement.shortDescription || achievement.description || '',
                         iconUrl: achievement.iconUrl || '',
                         points: achievement.points || 0
                       });
                     });
                   }
                 });
                 setAchievements(allAchievements);
               }
                            } catch (altErr) {
                 setAchievements([]);
               }
           }
        } catch (err: any) {
          notify.error(`Ошибка загрузки данных: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen]);

  const handleSave = async () => {
    // Валидация полей
    if (!assignForm.user_id.trim()) {
      notify.error('Пожалуйста, выберите пользователя');
      return;
    }
    if (!assignForm.achievement_id.trim()) {
      notify.error('Пожалуйста, выберите ачивку');
      return;
    }

    try {
      setLoading(true);
      
      // Отправляем запрос на назначение достижения
             await api.post(`/admin/users/${assignForm.user_id}/achievements/${assignForm.achievement_id}`);
      
      notify.success('Достижение успешно назначено!');
      onSuccess();
      onClose();
      
      // Сбрасываем форму
      setAssignForm({ user_id: '', achievement_id: '' });
    } catch (err: any) {
      notify.error(`Ошибка назначения достижения: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>Назначить достижение</h3>
          <button className="admin-icon-btn" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal-content">
          {loading ? (
            <div className="admin-loading">Загрузка данных...</div>
          ) : (
            <div className="admin-form">
              <label className="admin-label">Пользователь *</label>
              <select 
                className="admin-input" 
                value={assignForm.user_id} 
                onChange={(e) => setAssignForm({ ...assignForm, user_id: e.target.value })}
              >
                <option value="">Выберите пользователя</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} - {user.department} ({user.position})
                  </option>
                ))}
              </select>
              
              <label className="admin-label">Достижение *</label>
              <select 
                className="admin-input" 
                value={assignForm.achievement_id} 
                onChange={(e) => setAssignForm({ ...assignForm, achievement_id: e.target.value })}
              >
                <option value="">Выберите достижение</option>
                {achievements.map(achievement => (
                  <option key={achievement.id} value={achievement.id}>
                    {achievement.title} {achievement.points ? `(${achievement.points} очков)` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="admin-modal-actions">
            <button className="admin-secondary-btn" onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button 
              className="admin-primary-btn" 
              onClick={handleSave}
              disabled={loading || !assignForm.user_id || !assignForm.achievement_id}
            >
              {loading ? 'Назначаем...' : 'Назначить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
