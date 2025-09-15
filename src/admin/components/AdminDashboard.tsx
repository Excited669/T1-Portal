import { useEffect, useState } from 'react';
import { api } from '@/shared/api/http';

interface AdminStats {
  totalAchievements: number;
  blockedAchievements: number;
  availableAchievements: number;
  activeUsers: number;
  sectionsCount: number;
  awardsThisMonth: number;
  awardsTotal: number;
  avgAchievementsPerActiveUser: number;
  userCoveragePercent: number;
  topPopularAllTime: Array<{
    id: string;
    title: string;
    awardsCount: number;
  }>;
  topPopular30d: Array<{
    id: string;
    title: string;
    awardsCount: number;
  }>;
  rarestActive: Array<{
    id: string;
    title: string;
    rarityPercent: number;
  }>;
  awardsByMonth: Array<{
    month: string;
    count: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get<AdminStats>('/admin/stats');
        setStats(response.data);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки статистики');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2 className="dashboard-title">Дашборд ачивок</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <h2 className="dashboard-title">Дашборд ачивок</h2>
        <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
          <p>Ошибка: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-dashboard">
        <h2 className="dashboard-title">Дашборд ачивок</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Нет данных</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Дашборд ачивок</h2>
      
      {/* Основная статистика */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-icon">📊</div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-number">{stats.sectionsCount}</div>
            <div className="dashboard-card-label">Разделов</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-icon">👥</div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-number">{stats.activeUsers}</div>
            <div className="dashboard-card-label">Активных пользователей</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-icon">🏆</div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-number">{stats.totalAchievements}</div>
            <div className="dashboard-card-label">Всего ачивок</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-icon">✅</div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-number">{stats.availableAchievements}</div>
            <div className="dashboard-card-label">Доступных ачивок</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-icon">🚫</div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-number">{stats.blockedAchievements}</div>
            <div className="dashboard-card-label">Заблокированных</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-icon">📈</div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-number">{stats.awardsThisMonth}</div>
            <div className="dashboard-card-label">Наград в этом месяце</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-icon">🎯</div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-number">{stats.awardsTotal}</div>
            <div className="dashboard-card-label">Всего наград</div>
          </div>
        </div>
        
        
        
        
      </div>

      {/* Дополнительная статистика */}
      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Популярные ачивки за все время */}
        <div className="admin-card">
          <h3 style={{ marginBottom: '16px', color: '#263238' }}>Популярные ачивки (все время)</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.topPopularAllTime.slice(0, 5).map((achievement, index) => (
              <div key={achievement.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>
                <span style={{ fontWeight: '500' }}>{index + 1}. {achievement.title}</span>
                <span style={{ color: '#00AAE6', fontWeight: '600' }}>{achievement.awardsCount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Популярные ачивки за 30 дней */}
        <div className="admin-card">
          <h3 style={{ marginBottom: '16px', color: '#263238' }}>Популярные ачивки (30 дней)</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.topPopular30d.slice(0, 5).map((achievement, index) => (
              <div key={achievement.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>
                <span style={{ fontWeight: '500' }}>{index + 1}. {achievement.title}</span>
                <span style={{ color: '#00AAE6', fontWeight: '600' }}>{achievement.awardsCount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Самые редкие активные ачивки */}
        <div className="admin-card">
          <h3 style={{ marginBottom: '16px', color: '#263238' }}>Самые редкие активные ачивки</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.rarestActive.slice(0, 5).map((achievement, index) => (
              <div key={achievement.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>
                <span style={{ fontWeight: '500' }}>{index + 1}. {achievement.title}</span>
                <span style={{ color: '#fd7e14', fontWeight: '600' }}>{(achievement.rarityPercent)?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Награды по месяцам */}
        <div className="admin-card">
          <h3 style={{ marginBottom: '16px', color: '#263238' }}>Награды по месяцам</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.awardsByMonth.slice(-6).map((monthData, index) => (
              <div key={monthData.month} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>
                <span style={{ fontWeight: '500' }}>{monthData.month}</span>
                <span style={{ color: '#00AAE6', fontWeight: '600' }}>{monthData.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

