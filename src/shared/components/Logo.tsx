import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: styles.logoImgSmall,
    medium: styles.logoImgMedium,
    large: styles.logoImgLarge
  };

  return (
    <div className={`${styles.logoContainer} ${className}`}>
      <img 
        src="/images/t1-logo.png" 
        alt="" 
        className={`${styles.logoImg} ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Logo;

