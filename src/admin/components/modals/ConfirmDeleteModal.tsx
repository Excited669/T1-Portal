import { X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  deleteTarget: { type: 'section' | 'achievement'; id: string } | null;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  deleteTarget,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !deleteTarget) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>Подтверждение удаления</h3>
          <button className="admin-icon-btn" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal-content">
          <p>Вы уверены, что хотите удалить {deleteTarget.type === 'section' ? 'раздел' : 'ачивку'}?</p>
          <div className="admin-modal-actions">
            <button className="admin-secondary-btn" onClick={onClose}>
              Отмена
            </button>
            <button className="admin-primary-btn" onClick={onConfirm}>
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
