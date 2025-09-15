import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch, RootState } from '@/app/store';
import { useState } from 'react';
import { login as loginUser } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '@/shared/components/Logo';
import { getRole } from '@/shared/auth/token';
import styles from './LoginPage.module.css';
import '@/styles/toast.css';
import '@/styles/confirm.css';
import ToastViewport from '@/shared/components/ToastViewport';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const navigate = useNavigate();
  const {loading, error } = useSelector((state: RootState) => state.auth);

  const validateUsername = (username: string): string | undefined => {
    if (!username) return 'Логин обязателен';
    
    if (username.length < 3 || username.length > 50) return 'Логин должен быть от 3 до 50 символов';
    
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Пароль обязателен';
    
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
    
    return undefined;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
    const error = validateUsername(value);
    setErrors(prev => ({ ...prev, username: error }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, password: error }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    
    if (usernameError || passwordError) {
      setErrors({ username: usernameError, password: passwordError });
      return;
    }

    try {
      await dispatch(loginUser({ username, password })).unwrap();
      const role = getRole();
      if( role === 'ADMIN' ) navigate('/admin');
      else navigate('/news');
    } catch (err) {
      setErrors({ 
        username: error || 'Неверные учетные данные', 
        password: error || 'Неверные учетные данные' 
      });
    } finally {
      setUserName('');
      setPassword('');
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginLeft}>
          <div className={styles.logo}>
            <Logo size="large" />
          </div>
          <h1 className={styles.loginHeadline}>Быстро, Эффективно и Продуктивно</h1>
          <p className={styles.loginDescription}>
            Реализуем комплексные проекты по разработке ПО, системной интеграции и промышленной автоматизации на базе ИИ и своего облака
          </p>
        </div>
        <div className={styles.loginRight}>
          <form className={styles.loginForm} onSubmit={onSubmit}>
            <h2>Вход</h2>
            <p className={styles.loginSubtitle}>в свой аккаунт</p>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Логин</label>
              <input
                type="text"
                className={`${styles.formInput} ${errors.username ? styles.error : ''}`}
                value={username}
                onChange={handleUsernameChange}
                placeholder="Введите логин"
                required
              />
              {errors.username && <div className={styles.errorMessage}>{errors.username}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Пароль</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.formInput} ${errors.password ? styles.error : ''}`}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Введите пароль"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
            </div>
            
            <div className={styles.forgotPassword}>
              <a href="#forgot">Забыли пароль?</a>
            </div>
            
             <button 
              type="submit" 
              className={`${styles.loginButton} ${loading ? styles.disabled : ''}`}
              disabled={loading}
            >
              {loading && <div className={styles.spinner}></div>} Войти
            </button>
            
            <div className={styles.registerLink}>
              <span>Нет аккаунта? </span>
              <a href="#register">Регистрация</a>
            </div>
          </form>
        </div>
      </div>

      <ToastViewport />
      <ConfirmDialog />
    </div>
  );
}

