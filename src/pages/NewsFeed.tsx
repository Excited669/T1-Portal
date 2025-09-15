import Sidebar from '@/shared/components/Sidebar';
import Header from '@/shared/components/Header';
import Logo from '@/shared/components/Logo';
import styles from './NewsFeed.module.css';
import layoutStyles from '@/shared/layout/MainLayout.module.css';
import { getUserDetails } from '@/shared/auth/token';
import '@/styles/toast.css';
import '@/styles/confirm.css';
import ToastViewport from '@/shared/components/ToastViewport';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

const NewsFeed: React.FC = () => {
  const userDetails = getUserDetails();



  const newsItems = [
    {
      id: 1,
      title: 'ИТ-холдинг Т1 принимает участие в крупной технологической конференции',
      description: 'Компания представила новейшие разработки в области ИИ и кибербезопасности, а также провела мастер-классы для участников.',
      image: '/images/office-reception.jpg'
    },
    {
      id: 2,
      title: 'ИТ холдинг Т1 подвел итоги года',
      description: 'По итогам 2024 года компания показала рост выручки на 18% и объявила о планах по расширению на новые рынки.',
      image: '/images/office-space.jpg'
    }
  ];
  return (
    <div className={layoutStyles.mainLayout}>
      <Sidebar />
      <div className="main-content">
        <Header title="Лента" />

        <div className={styles.newsGrid}>
          {newsItems.map((item) => (
            <div key={item.id} className={styles.newsCard}>
              <div className={styles.newsHeader}>
                <div className={styles.newsLogo}>
                  <Logo size="small" />
                </div>
                <h3 className={styles.newsTitle}>{item.title}</h3>
              </div>
              <p className={styles.newsDescription}>{item.description}</p>
              <div className={styles.newsImage}>
                <img src={item.image} alt={item.title} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Глобальные порталы */}
      <ToastViewport />
      <ConfirmDialog />
    </div>
  );
};

export default NewsFeed;

