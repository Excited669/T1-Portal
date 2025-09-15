import  { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import Logo from './Logo';
import styles from './Sidebar.module.css';
import {useMediaQuery} from '@/features/hooks/useMediaQuery';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');


  useEffect(() => {
    setIsMobileMenuOpen(!isMobile);
  }, [isMobile]);

  const navItems = [
    { path: '/news', label: 'Новости' },
    { path: '/events', label: 'События' },
    { path: '/knowledge', label: 'База знаний' },
    { path: '/org-structure', label: 'Оргструктура' },
    { path: '/education', label: 'Обучение и развитие' },
    { path: '/community', label: 'Сообщество' },
    { path: '/benefits', label: 'Бенефиты' },
    { path: '/services', label: 'Сервисы' },
    { path: '/tasks', label: 'Мои задачи' },
    { path: '/space', label: 'Пространство' },
    { path: '/forum', label: 'Форум Т1' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoClick = () => {
    		navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={toggleMobileMenu}></div>
      )}

      <div className={`${styles.sidebar}`} style={{ transform: isMobile ? (isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)' }}>
        <div className={styles.sidebarLogo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <Logo size="medium" />
        </div>
        
        <div className={styles.searchContainer}>
          <Search size={16} style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Поиск"
          />
        </div>

        <nav>
          <ul className={styles.navMenu}>
            <li className={styles.navItem}>
              <Link to="/news" className={`${styles.navLink} ${location.pathname === '/news' ? styles.active : ''}`}>
                  Новости
              </Link>
            </li>
            {navItems.slice(1).map((item) => (
              <li key={item.path} className={styles.navItem}>
                {item.path === '/education' ? (
                  <Link
                    to={item.path}
                    className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
