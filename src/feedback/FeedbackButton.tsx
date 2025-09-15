import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';
import styles from './FeedbackButton.module.css';

const FeedbackButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        className={styles.feedbackButton}
        onClick={openModal}
        title="Обратная связь"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#00AAE6';
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa';
          e.currentTarget.style.color = '#333';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <MessageCircle size={18} />
      </button>
      
      <FeedbackModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default FeedbackButton;
