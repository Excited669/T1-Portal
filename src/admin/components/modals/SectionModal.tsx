import { X } from 'lucide-react';
import { notify } from '@/features/notifications/notify';

interface SectionModalProps {
  isOpen: boolean;
  isEdit: boolean;
  section: { id: string | null; name: string; description: string };
  onClose: () => void;
  onSave: (section: { id: string | null; name: string; description: string }) => void;
  onSectionChange: (section: { id: string | null; name: string; description: string }) => void;
}

const SectionModal: React.FC<SectionModalProps> = ({
  isOpen,
  isEdit,
  section,
  onClose,
  onSave,
  onSectionChange
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    if (!section.name.trim()) {
      notify.error('Пожалуйста, заполните название раздела');
      return;
    }
    onSave(section);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{isEdit ? 'Изменить раздел' : 'Создать раздел'}</h3>
          <button className="admin-icon-btn" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal-content">
          <div className="admin-form">
            <label className="admin-label">Название раздела</label>
            <input 
              className="admin-input" 
              value={section.name} 
              onChange={(e) => onSectionChange({ ...section, name: e.target.value })} 
            />
            <label className="admin-label">Описание</label>
            <input 
              className="admin-input" 
              value={section.description} 
              onChange={(e) => onSectionChange({ ...section, description: e.target.value })} 
            />
          </div>
          <div className="admin-modal-actions">
            <button className="admin-secondary-btn" onClick={onClose}>
              Отмена
            </button>
            <button className="admin-primary-btn" onClick={handleSave}>
              {isEdit ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionModal;
