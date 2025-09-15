import { useEffect, useState, useMemo } from 'react';
import { Pencil, Plus, Trash2, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '@/features/admin/adminSlice';
import { fetchAdminUserAchievements, assignAchievementToUser, removeAchievementFromUser } from '@/features/admin/adminUserAchievementsSlice';
import { AppDispatch, RootState } from '@/app/store';
import { notify } from '@/features/notifications/notify';
import { confirm } from '@/features/confirm/api';

interface AdminUsersProps {
  onOpenAssignAchievement: (userId?: string) => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ onOpenAssignAchievement }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, users, usersPagination } = useSelector((state: RootState) => state.admin);
  const { achievementsByUser } = useSelector((state: RootState) => state.adminUserAchievements);

  // Состояние для фильтрации и поиска
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [hasAchievementsFilter, setHasAchievementsFilter] = useState('');
  const [sortField, setSortField] = useState<'name' | 'department' | 'position' | 'achievements'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Загружаем пользователей с пагинацией
  useEffect(() => {
    dispatch(fetchAllUsers({ page: currentPage, size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Загружаем достижения для каждого пользователя при загрузке компонента
  useEffect(() => {
    if (users.length > 0) {
      users.forEach(user => {
        dispatch(fetchAdminUserAchievements(user.id));
      });
    }
  }, [users, dispatch]);

  // Сбрасываем страницу при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, positionFilter, hasAchievementsFilter]);

  // Получаем уникальные отделы и должности для фильтров
  const departments = useMemo(() => {
    const deps = [...new Set(users.map(user => user.department).filter(Boolean))];
    return deps.sort();
  }, [users]);

  const positions = useMemo(() => {
    const pos = [...new Set(users.map(user => user.position).filter(Boolean))];
    return pos.sort();
  }, [users]);

  // Фильтрация и сортировка пользователей (только для текущей страницы)
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Поиск по имени
      if (searchTerm && !user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Фильтр по отделу
      if (departmentFilter && user.department !== departmentFilter) {
        return false;
      }
      
      // Фильтр по должности
      if (positionFilter && user.position !== positionFilter) {
        return false;
      }
      
      // Фильтр по наличию достижений
      if (hasAchievementsFilter) {
        const userAchievements = achievementsByUser[user.id] || [];
        if (hasAchievementsFilter === 'has' && userAchievements.length === 0) {
          return false;
        }
        if (hasAchievementsFilter === 'none' && userAchievements.length > 0) {
          return false;
        }
      }
      
      return true;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'department':
          aValue = (a.department || '').toLowerCase();
          bValue = (b.department || '').toLowerCase();
          break;
        case 'position':
          aValue = (a.position || '').toLowerCase();
          bValue = (b.position || '').toLowerCase();
          break;
        case 'achievements':
          aValue = (achievementsByUser[a.id] || []).length;
          bValue = (achievementsByUser[b.id] || []).length;
          break;
        default:
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, departmentFilter, positionFilter, hasAchievementsFilter, sortField, sortDirection, achievementsByUser]);

  // Функция для изменения сортировки
  const handleSort = (field: 'name' | 'department' | 'position' | 'achievements') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Функция для назначения достижения пользователю
  const handleAssignAchievement = async (userId: string, achievementId: string) => {
    try {
      await dispatch(assignAchievementToUser({ userId, achievementId })).unwrap();
      notify.success('Достижение успешно назначено!');
    } catch (err: any) {
      notify.error(`Ошибка назначения достижения: ${err.message || 'Неизвестная ошибка'}`);
    }
  };

  // Функция для удаления достижения у пользователя
  const handleRemoveAchievement = async (userId: string, achievementId: string) => {
    const confirmed = await confirm({ 
      message: 'Вы уверены, что хотите удалить это достижение у пользователя?' 
    });
    if (!confirmed) {
      return;
    }

    try {
      await dispatch(removeAchievementFromUser({ userId, achievementId })).unwrap();
      notify.success('Достижение успешно удалено!');
    } catch (err: any) {
      notify.error(`Ошибка удаления достижения: ${err.message || 'Неизвестная ошибка'}`);
    }
  };

  if (loading) {
    return <div className="admin-loading">Загрузка пользователей...</div>;
  }

  if (error) {
    return <div className="admin-error">Ошибка: {error}</div>;
  }

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <h2>Пользователи и их достижения</h2>
        <button className="admin-primary-btn" onClick={() => onOpenAssignAchievement()}>
          {/* <Plus size={16} /> */}
          Назначить достижение
        </button>
      </div>

      {/* Панель фильтрации и поиска */}
      <div className="admin-users-filters">
        <div className="filters-row">
          {/* Поиск по имени */}
          <div className="filter-group">
            <label className="filter-label">
              <Search size={16} />
              Поиск по имени
            </label>
            <input
              type="text"
              className="filter-input"
              placeholder="Введите имя пользователя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Фильтр по отделу */}
          <div className="filter-group">
            <label className="filter-label">
              <Filter size={16} />
              Отдел
            </label>
            <select
              className="filter-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">Все отделы</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Фильтр по должности */}
          <div className="filter-group">
            <label className="filter-label">
              <Filter size={16} />
              Должность
            </label>
            <select
              className="filter-select"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="">Все должности</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Фильтр по наличию достижений */}
          <div className="filter-group">
            <label className="filter-label">
              <Filter size={16} />
              Достижения
            </label>
            <select
              className="filter-select"
              value={hasAchievementsFilter}
              onChange={(e) => setHasAchievementsFilter(e.target.value)}
            >
              <option value="">Все пользователи</option>
              <option value="has">С достижениями</option>
              <option value="none">Без достижений</option>
            </select>
          </div>
        </div>

        {/* Статистика */}
        <div className="filters-stats">
          Страница {currentPage} из {usersPagination?.totalPages || 1} • 
          Показано: {users.length} из {usersPagination?.totalElements || 0} пользователей • 
          Размер страницы: 
          <select 
            value={pageSize} 
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="page-size-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="admin-users-table">
        <table>
          <thead>
            <tr>
              <th 
                className="sortable-header"
                onClick={() => handleSort('name')}
              >
                <div className="header-content">
                  Пользователь
                  <div className="sort-icon">
                    {sortField === 'name' ? (
                      sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    ) : (
                      <SortAsc size={14} style={{ opacity: 0.3 }} />
                    )}
                  </div>
                </div>
              </th>
              <th 
                className="sortable-header"
                onClick={() => handleSort('department')}
              >
                <div className="header-content">
                  Отдел
                  <div className="sort-icon">
                    {sortField === 'department' ? (
                      sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    ) : (
                      <SortAsc size={14} style={{ opacity: 0.3 }} />
                    )}
                  </div>
                </div>
              </th>
              <th 
                className="sortable-header"
                onClick={() => handleSort('position')}
              >
                <div className="header-content">
                  Должность
                  <div className="sort-icon">
                    {sortField === 'position' ? (
                      sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    ) : (
                      <SortAsc size={14} style={{ opacity: 0.3 }} />
                    )}
                  </div>
                </div>
              </th>
              <th 
                className="sortable-header"
                onClick={() => handleSort('achievements')}
              >
                <div className="header-content">
                  Достижения
                  <div className="sort-icon">
                    {sortField === 'achievements' ? (
                      sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    ) : (
                      <SortAsc size={14} style={{ opacity: 0.3 }} />
                    )}
                  </div>
                </div>
              </th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id}>
                <td className="user-info">
                  <div className="user-avatar">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.fullName}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`user-avatar-placeholder ${user.avatarUrl ? 'hidden' : ''}`}>
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.fullName}</div>
                    <div className="user-id">ID: {user.id.slice(0, 8)}...</div>
                  </div>
                </td>
                <td>{user.department || '—'}</td>
                <td>{user.position || '—'}</td>
                <td className="user-achievements">
                  {achievementsByUser[user.id] ? (
                    achievementsByUser[user.id].length > 0 ? (
                      <div className="achievements-list">
                        {achievementsByUser[user.id].map((achievement) => (
                          <div key={achievement.id} className="achievement-item">
                            {achievement.iconUrl ? (
                              <img 
                                src={achievement.iconUrl} 
                                alt={achievement.title}
                                className="achievement-icon"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="achievement-icon-placeholder">
                                🏆
                              </div>
                            )}
                            <div className="achievement-info">
                              <div className="achievement-title">{achievement.title}</div>
                              {achievement.rarityPercent !== undefined && (
                                <div className="achievement-rarity">
                                  Редкость: {achievement.rarityPercent.toFixed(1)}%
                                </div>
                              )}
                            </div>
                            <button
                              className="admin-icon-btn admin-icon-btn-danger"
                              title="Удалить достижение"
                              onClick={() => handleRemoveAchievement(user.id, achievement.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-achievements">
                        Нет достижений
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          ID: {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="no-achievements">
                      Загрузка достижений...
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        ID: {user.id.slice(0, 8)}...
                      </div>
                    </div>
                  )}
                </td>
                <td className="user-actions">
                  <button
                    className="admin-icon-btn"
                    title="Назначить достижение"
                    onClick={() => onOpenAssignAchievement(user.id)}
                  >
                    <Plus size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedUsers.length === 0 && (
        <div className="admin-empty">
          {users.length === 0 ? 'Пользователи не найдены' : 'По вашему запросу ничего не найдено на текущей странице'}
        </div>
      )}

      {/* Пагинация */}
      {users.length > 0 && usersPagination && (
        <div className="admin-pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ← Предыдущая
          </button>
          
                      <div className="pagination-info">
              Страница {currentPage} из {usersPagination.totalPages}
            </div>
            
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= usersPagination.totalPages}
            >
            Следующая →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
