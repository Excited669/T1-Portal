import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  activeTab: 'main' | 'dashboard' | 'users' | 'sections' | 'updates' | 'posts' | 'media' | 'pages' | 'comments' | 'appearance' | 'plugins' | 'tools' | 'settings';
  onTabChange: (tab: 'main' | 'dashboard' | 'users' | 'sections' | 'updates' | 'posts' | 'media' | 'pages' | 'comments' | 'appearance' | 'plugins' | 'tools' | 'settings') => void;
  adminName: string;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, onTabChange, adminName, onLogout }) => {
  return (
    <div className="header">
      <div className="header-left">
        {activeTab !== 'main' && (
          <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => onTabChange('dashboard')}>
              Дашборд
            </button>
            <button className={`admin-tab ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => onTabChange('sections')}>
              Разделы и ачивки
            </button>
            <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => onTabChange('users')}>
              Пользователи
            </button>
          </div>
        )}
      </div>
      <div className="user-profile">
        <div className="user-avatar">AD</div>
        <span className="user-name">{adminName}</span>
        <button className="logout-button" onClick={onLogout} title="Выход" aria-label="Выход">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
