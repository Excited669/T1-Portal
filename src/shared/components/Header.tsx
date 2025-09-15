import { useNavigate, Link } from 'react-router-dom';
import { Trophy, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { AppDispatch } from '@/app/store';
import { getUserDetails } from '@/shared/auth/token';
import FeedbackButton from '@/feedback/FeedbackButton';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = getUserDetails();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="header">
      <h1 className="page-title">{title}</h1>
      <div className="user-profile">
        <Link 
          to="/achievements-map" 
          style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 12px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px', 
            color: '#333', 
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00AAE6';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.color = '#333';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <Trophy size={16} />
          <span>Карта достижений</span>
        </Link>
        <Link 
          to="/profile" 
          style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
          }}
        >             
          <img className="user-avatar" src={`${userDetails.avatarUrl}`} alt="avatar"  />
          <span className="user-name">{userDetails?.fullname}</span>
        </Link>
        <FeedbackButton />
        <button 
          className="logout-button" 
          onClick={handleLogout} 
          title="Выйти из аккаунта"
          style={{
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#dc3545';
            e.currentTarget.style.backgroundColor = '#fff5f5';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
