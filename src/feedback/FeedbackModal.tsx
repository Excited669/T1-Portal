import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, MessageCircle } from 'lucide-react';
import styles from './FeedbackModal.module.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    // Имитация отправки сообщения
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Закрываем модал через 2 секунды
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
      onClose();
    }, 2000);
  };

  if (!isOpen || !mounted) return null;

  // Используем Portal для рендеринга в корне документа
  return createPortal(
    <div 
      className={styles.modalOverlay} 
      onClick={onClose}
      style={{ zIndex: 999999 }}
    >
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 1000000 }}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <MessageCircle size={20} />
            Обратная связь
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className={styles.feedbackForm}>
            <div className={styles.formGroup}>
              <label htmlFor="feedback-message" className={styles.label}>
                Расскажите, что можно улучшить или что вас беспокоит:
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите вашу проблему или предложение..."
                className={styles.textarea}
                rows={6}
                required
              />
            </div>
            
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!message.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner}></div>
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Отправить
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h4>Сообщение отправлено!</h4>
            <p>Спасибо за вашу обратную связь. Мы рассмотрим ваше сообщение и свяжемся с вами при необходимости.</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default FeedbackModal;
