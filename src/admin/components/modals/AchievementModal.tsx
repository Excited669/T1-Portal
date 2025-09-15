import { X } from 'lucide-react';
import { AdminAchievement, Category } from '@/features/admin/adminSlice';
import { notify } from '@/features/notifications/notify';
import { useState } from 'react';

interface AchievementAttribute {
  key: string;
  label: string;
  value: string;
}

interface AchievementForm {
  title: string;
  descriptionMd: string;
  sectionIds: string[]; // Изменено на массив строк
  points: number;
  icon: string;
  animation: string;
  criteria: { typeCode: string; value: number }[];
}

interface AchievementModalProps {
  isOpen: boolean;
  isEdit: boolean;
  achievementForm: AchievementForm;
  selectedAttrs: AchievementAttribute[];
  imagePreview: string;
  sections: Array<{ id: string; name: string; description: string }>;
  attributeCatalog: Array<{ key: string; label: string; type: 'number' | 'text' }>;
  selectedAttrKey: string;
  attrValue: string;
  createBody: string;
  updateBody: string;
  onClose: () => void;
  onSave: () => void;
  onAchievementFormChange: (form: AchievementForm) => void;
  onSelectedAttrsChange: (attrs: AchievementAttribute[]) => void;
  onImagePreviewChange: (preview: string) => void;
  onSelectedAttrKeyChange: (key: string) => void;
  onAttrValueChange: (value: string) => void;
  onCreateBodyChange: (body: string) => void;
  onUpdateBodyChange: (body: string) => void;
  onAddAttribute: () => void;
  onRemoveAttribute: (index: number) => void;
  onRemoveImage: () => void;
  onImageFileChange?: (file: File | null) => void;
  onAnimationFileChange?: (file: File | null) => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  isEdit,
  achievementForm,
  selectedAttrs,
  imagePreview,
  sections,
  attributeCatalog,
  selectedAttrKey,
  attrValue,
  createBody,
  updateBody,
  onClose,
  onSave,
  onAchievementFormChange,
  onSelectedAttrsChange,
  onImagePreviewChange,
  onSelectedAttrKeyChange,
  onAttrValueChange,
  onCreateBodyChange,
  onUpdateBodyChange,
  onAddAttribute,
  onRemoveAttribute,
  onRemoveImage,
  onImageFileChange,
  onAnimationFileChange
}) => {
  // Состояние для выбора секций
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  // Функции для работы с секциями
  const handleAddSection = () => {
    if (selectedSectionId && !achievementForm.sectionIds.includes(selectedSectionId)) {
      onAchievementFormChange({
        ...achievementForm,
        sectionIds: [...achievementForm.sectionIds, selectedSectionId]
      });
      setSelectedSectionId('');
    }
  };

  const handleRemoveSection = (index: number) => {
    const newSectionIds = achievementForm.sectionIds.filter((_, i) => i !== index);
    onAchievementFormChange({
      ...achievementForm,
      sectionIds: newSectionIds
    });
  };
  if (!isOpen) return null;

  const handleSave = () => {
    // Валидация полей
    if (!achievementForm.title.trim()) {
      notify.error('Пожалуйста, заполните название ачивки');
      return;
    }
    if (!achievementForm.descriptionMd.trim()) {
      notify.error('Пожалуйста, заполните описание');
      return;
    }
    if (achievementForm.sectionIds.length === 0) {
      notify.error('Пожалуйста, выберите хотя бы один раздел');
      return;
    }
    
    onSave();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImagePreviewChange(url);
      onImageFileChange?.(file);
      onAchievementFormChange({ ...achievementForm, icon: url });
    }
  };

  const handleAnimationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onAnimationFileChange?.(file);
      onAchievementFormChange({ ...achievementForm, animation: file.name });
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-inner">
          <div className="admin-modal-header">
            <h3>{isEdit ? 'Изменить ачивку' : 'Создать ачивку'}</h3>
            <button className="admin-icon-btn" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
            </button>
          </div>
          <div className="admin-modal-content">
          <div className="admin-form">
            <label className="admin-label">Название ачивки *</label>
            <input 
              className="admin-input" 
              placeholder="Введите название ачивки" 
              value={achievementForm.title} 
              onChange={(e) => onAchievementFormChange({ ...achievementForm, title: e.target.value })} 
            />
            
                         <label className="admin-label">Описание (Markdown) *</label>
             <textarea 
               className="admin-input" 
               placeholder="Введите описание в формате Markdown" 
               value={achievementForm.descriptionMd} 
               onChange={(e) => onAchievementFormChange({ ...achievementForm, descriptionMd: e.target.value })} 
             />
            
                         <label className="admin-label">Иконка ачивки (PNG, JPG)</label>
             <input 
               className="admin-input" 
               type="file" 
               accept="image/png,image/jpeg" 
               onChange={handleImageChange}
             />
             
             <label className="admin-label">Анимация ачивки (GIF)</label>
             <input 
               className="admin-input" 
               type="file" 
               accept="image/gif" 
               onChange={handleAnimationChange}
             />
            {imagePreview && (
              <div style={{ position: 'relative', width: 64, height: 64 }}>
                <img src={imagePreview} alt="Превью" style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }} />
                {imagePreview.includes('blob:') && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 4, 
                    right: 4, 
                    background: 'rgba(0,0,0,0.7)', 
                    color: 'white', 
                    fontSize: '10px', 
                    padding: '2px 4px', 
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    {imagePreview.includes('.gif') ? 'GIF' : 'IMG'}
                  </div>
                )}
                <button
                  className="admin-icon-btn"
                  title="Удалить изображение"
                  onClick={onRemoveImage}
                  style={{ position: 'absolute', top: -10, left: -10 }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
                         <label className="admin-label">URL иконки</label>
             <input 
               className="admin-input" 
               type="text" 
               placeholder="Введите URL иконки" 
               value={achievementForm.icon} 
               onChange={(e) => onAchievementFormChange({ ...achievementForm, icon: e.target.value })} 
             />
             
             <label className="admin-label">URL анимации (GIF)</label>
             <input 
               className="admin-input" 
               type="text" 
               placeholder="Введите URL анимации" 
               value={achievementForm.animation} 
               onChange={(e) => onAchievementFormChange({ ...achievementForm, animation: e.target.value })} 
             />
             
             <label className="admin-label">Количество очков</label>
             <input 
               className="admin-input" 
               type="number" 
               placeholder="Введите количество очков" 
               value={achievementForm.points} 
               onChange={(e) => onAchievementFormChange({ ...achievementForm, points: parseInt(e.target.value) || 0 })} 
             />
             
                          <label className="admin-label">Разделы *</label>
             <div className="admin-inline-row">
               <select 
                 className="admin-input" 
                 value={selectedSectionId} 
                 onChange={(e) => setSelectedSectionId(e.target.value)}
               >
                 <option value="">Выберите раздел</option>
                 {sections.map((s, index) => (
                   <option key={s.id || `section-${index}`} value={s.id}>{s.name}</option>
                 ))}
               </select>
               <button 
                 className="admin-primary-btn" 
                 onClick={handleAddSection}
                 disabled={!selectedSectionId}
               >
                 Добавить
               </button>
             </div>
             {achievementForm.sectionIds.length > 0 && (
               <div className="admin-chips">
                 {achievementForm.sectionIds.map((sectionId, i) => {
                   const section = sections.find(s => s.id === sectionId);
                   return (
                     <span key={`${sectionId}-${i}`} className="admin-chip">
                       {section?.name || sectionId}
                       <button 
                         className="admin-chip-remove" 
                         onClick={() => handleRemoveSection(i)}
                       >
                         ×
                       </button>
                     </span>
                   );
                 })}
               </div>
             )}

            <div className="admin-subtitle" style={{ marginTop: 6 }}>Новые атрибуты</div>
            <div className="admin-inline-row">
              <select 
                className="admin-input" 
                style={{ width: '70%' }}
                value={selectedAttrKey} 
                onChange={(e) => onSelectedAttrKeyChange(e.target.value)}
              >
                {attributeCatalog.map((a, index) => (
                  <option key={a.key || `attr-${index}`} value={a.key}>{a.label}</option>
                ))}
              </select>
              {attributeCatalog.find(a => a.key === selectedAttrKey)?.type === 'number' ? (
                <input 
                  className="admin-input" 
                  style={{ width: '30%' }}
                  type="number" 
                  placeholder="Значение" 
                  value={attrValue} 
                  onChange={(e) => onAttrValueChange(e.target.value)} 
                />
              ) : (
                <input 
                  className="admin-input" 
                  type="text" 
                  placeholder="Значение" 
                  value={attrValue} 
                  onChange={(e) => onAttrValueChange(e.target.value)} 
                />
              )}
              <button className="admin-primary-btn" onClick={onAddAttribute}>
                Добавить
              </button>
            </div>
            {selectedAttrs.length > 0 && (
              <div className="admin-chips">
                {selectedAttrs.map((a, i) => (
                  <span key={`${a.key}-${i}`} className="admin-chip">
                    {a.label}: {a.value}
                    <button 
                      className="admin-chip-remove" 
                      onClick={() => onRemoveAttribute(i)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="admin-modal-actions">
            <button className="admin-secondary-btn" onClick={onClose}>
              Отмена
            </button>
                         <button 
               className="admin-primary-btn" 
               onClick={handleSave}
               disabled={achievementForm.sectionIds.length === 0}
             >
              {isEdit ? 'Отправить' : 'Отправить'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;
