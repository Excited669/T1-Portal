import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import Logo from '@/shared/components/Logo';

interface AdminSidebarProps {
  activeTab: 'main' | 'dashboard' | 'users' | 'sections' | 'updates' | 'posts' | 'media' | 'pages' | 'comments' | 'appearance' | 'plugins' | 'tools' | 'settings';
  onTabChange: (tab: 'main' | 'dashboard' | 'users' | 'sections' | 'updates' | 'posts' | 'media' | 'pages' | 'comments' | 'appearance' | 'plugins' | 'tools' | 'settings') => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleLogoClick = () => {
    		navigate('/admin');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button className="mobile-menu-button" onClick={toggleMobileMenu} aria-label="Toggle menu">
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu} />}

      <div className={`sidebar admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <Logo size="medium" />
        </div>
        
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'main' ? 'active' : ''}`} onClick={() => onTabChange('main')}>
                <span className="nav-icon">🏠</span>
                Главная
              </button>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">🔄</span>
                Обновления
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">📌</span>
                Записи
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">📷</span>
                Медиафайлы
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">📄</span>
                Страницы
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">💬</span>
                Комментарии
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">🎨</span>
                Внешний вид
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">🔌</span>
                Плагины
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">👥</span>
                Пользователи
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">🔧</span>
                Инструменты
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <span className="nav-icon">⚙️</span>
                Настройки
              </div>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { onTabChange('dashboard'); setIsMobileMenuOpen(false); }}>
                <span className="nav-icon">🏆</span>
                Управление ачивками
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
