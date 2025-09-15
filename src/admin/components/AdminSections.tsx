import { Pencil, Trash2 } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  short_description: string;
  section_id: string;
  image_url?: string;
  attributes?: AchievementAttribute[];
  points?: number;
}

interface AchievementAttribute {
  key: string;
  label: string;
  value: string;
}

interface AdminSectionsProps {
  sections: Section[];
  achievements: Achievement[];
  onOpenCreateSection: () => void;
  onOpenCreateAchievement: () => void;
  onOpenEditSection: (section: Section) => void;
  onOpenEditAchievement: (achievement: Achievement) => void;
  onOpenDeleteSection: (section: Section) => void;
  onOpenDeleteAchievement: (achievement: Achievement) => void;
  getAchievementUserPercentage: (achievementId: string) => number;
}

const AdminSections: React.FC<AdminSectionsProps> = ({
  sections,
  achievements,
  onOpenCreateSection,
  onOpenCreateAchievement,
  onOpenEditSection,
  onOpenEditAchievement,
  onOpenDeleteSection,
  onOpenDeleteAchievement,
  getAchievementUserPercentage
  
 }) => {
   return (
    <div className="admin-sections">
      <div className="admin-sections-actions">
        <button className="admin-primary-btn" onClick={onOpenCreateSection}>
          Создать раздел
        </button>
        <button className="admin-primary-btn" onClick={onOpenCreateAchievement}>
          Создать ачивку
        </button>
      </div>
      
      {sections.map((sec, index) => (
        <div className="admin-section-card" key={sec.id || `section-${index}`}>
          <div className="admin-section-card-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-section-title">{sec.name}</div>
              <div className="admin-section-sub">{sec.description || '—'}</div>
            </div>
                         <div style={{ display: 'flex', gap: 6 }}>
               <button 
                 className="admin-icon-btn" 
                 title="Изменить раздел" 
                 onClick={() => onOpenEditSection(sec)}
               >
                 <Pencil size={16} />
               </button>
             </div>
          </div>
          <div className="admin-ach-list">
            {achievements.filter(a => a.section_id === sec.id).map((a, achIndex) => (
              <div className="admin-ach-item" key={a.id || `achievement-${achIndex}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="admin-ach-title">{a.title}</div>
                  <div className="admin-ach-sub">{a.short_description}</div>
                  <div className="admin-ach-percentage" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    У {getAchievementUserPercentage(a.id)}% пользователей
                  </div>
                  {a.points && (
                    <div style={{ fontSize: '12px', color: '#00AAE6', marginTop: '2px', fontWeight: '500' }}>
                      🏆 {a.points} очков
                    </div>
                  )}
                </div>
                                 <div style={{ display: 'flex', gap: 6 }}>
                   <button 
                     className="admin-icon-btn" 
                     title="Изменить ачивку" 
                     onClick={() => onOpenEditAchievement(a)}
                   >
                     <Pencil size={16} />
                   </button>
                 </div>
              </div>
            ))}
            {achievements.filter(a => a.section_id === sec.id).length === 0 && (
              <div className="admin-empty">Нет ачивок</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSections;
