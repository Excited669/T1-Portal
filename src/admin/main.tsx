import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories,
  fetchAchievementCriteria,
  fetchAllAchievements,
  fetchAllUsers,
  createSection,
  updateSection,
  createAchievement, 
  updateAchievement,
  clearError 
} from '@/features/admin/adminSlice';
import { RootState, AppDispatch } from '../app/store';
import './admin.css';
import '@/styles/toast.css';
import '@/styles/confirm.css';

// Компоненты
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminDashboard from './components/AdminDashboard';
import AdminSections from './components/AdminSections';
import AdminUsers from './components/AdminUsers';
import AdminMainPage from './components/AdminMainPage';
import StatusMessage from './components/StatusMessage';
import SectionModal from './components/modals/SectionModal';
import AchievementModal from './components/modals/AchievementModal';
import AssignModal from './components/modals/AssignModal';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal';
import ToastViewport from '@/shared/components/ToastViewport';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

// Локальные типы
type Section = { id: string; name: string; description: string };
type AchievementAttribute = { key: string; label: string; value: string };
type Achievement = { id: string; title: string; short_description: string; section_id: string; image_url?: string; attributes?: AchievementAttribute[]; points?: number };



const AdminPanel: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error, categories, achievements: adminAchievements, criteria, users } = useSelector((state: RootState) => state.admin);
	const adminName = 'Администратор';
	
	// Модалки
	type ModalType = null | 'create-section' | 'edit-section' | 'create-achievement' | 'edit-achievement' | 'assign-achievement' | 'confirm-delete';
	const [modal, setModal] = useState<ModalType>(null);
	const [deleteTarget, setDeleteTarget] = useState<{ type: 'section' | 'achievement'; id: string } | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<string>('');

	// Загрузка данных при монтировании компонента
	useEffect(() => {
		dispatch(fetchCategories());
		dispatch(fetchAchievementCriteria());
		dispatch(fetchAllAchievements());
		// Пользователи теперь загружаются в AdminUsers компоненте с пагинацией
	}, [dispatch]);

	// Секция: состояние и форма (используем категории из API)
	const [sections, setSections] = useState<Section[]>([]);
	const [sectionEdit, setSectionEdit] = useState<{ id: string | null; name: string; description: string }>({ id: null, name: '', description: '' });

	// Обновляем секции при загрузке категорий
	useEffect(() => {
		if (categories.length > 0) {
			const mappedSections: Section[] = categories.map(cat => ({
				id: cat.id,
				name: cat.name,
				description: cat.description
			}));
			setSections(mappedSections);
		}
	}, [categories]);

	// Формы ачивки
	const [achievementForm, setAchievementForm] = useState({
		title: '',
		descriptionMd: '',
		sectionIds: [] as string[], // Массив строк для множественного выбора секций
		points: 0,
		icon: '',
		animation: '',
		criteria: [] as { typeCode: string; value: number }[],
	});
	const [selectedAchievementId, setSelectedAchievementId] = useState<string>('');
	const [imagePreview, setImagePreview] = useState<string>('');
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [selectedAnimationFile, setSelectedAnimationFile] = useState<File | null>(null);

	// Каталог атрибутов (используем критерии из API)
	const attributeCatalog = criteria.map(criterion => ({
		key: criterion.code,
		label: criterion.name,
		type: criterion.inputType === 'number' ? 'number' as const : 'text' as const
	}));
	const [selectedAttrKey, setSelectedAttrKey] = useState<string>('');
	const [attrValue, setAttrValue] = useState<string>('');
	const [selectedAttrs, setSelectedAttrs] = useState<AchievementAttribute[]>([]);

	// Ачивки (используем данные из API)
	const [achievements, setAchievements] = useState<Achievement[]>([]);

	// Обновляем ачивки при загрузке из API
	useEffect(() => {
		if (adminAchievements.length > 0) {
			const mappedAchievements: Achievement[] = adminAchievements.map((ach, index) => {
				// Определяем section_id из разных возможных полей
				let section_id = '';
				if (ach.sectionIds && ach.sectionIds.length > 0) {
					section_id = ach.sectionIds[0];
				} else if (ach.sections && ach.sections.length > 0) {
					section_id = ach.sections[0].id;
				}
				
				// Маппим критерии в атрибуты
				const attributes: AchievementAttribute[] = ach.criteria ? ach.criteria.map(criterion => ({
					key: criterion.activityType.code,
					label: criterion.activityType.name,
					value: criterion.requiredCount.toString()
				})) : [];

				return {
					id: ach.id || `achievement-${index}`, // ID всегда строка
					title: ach.title,
					short_description: ach.shortDescription,
					section_id: section_id,
					image_url: ach.iconUrl,
					attributes: attributes,
					points: ach.points
				};
			});
			setAchievements(mappedAchievements);
		}
	}, [adminAchievements]);

	
	// Устанавливаем первый критерий как выбранный при загрузке
	useEffect(() => {
		if (criteria.length > 0 && !selectedAttrKey) {
			setSelectedAttrKey(criteria[0].code);
		}
	}, [criteria, selectedAttrKey]);

	// Функция для расчета процента пользователей с ачивкой
	const getAchievementUserPercentage = (achievementId: string): number => {
		// TODO: Реализовать подсчет процента пользователей с достижением
		return 0;
	};

	const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

	const [activeTab, setActiveTab] = useState<'main' | 'dashboard' | 'users' | 'sections' | 'updates' | 'posts' | 'media' | 'pages' | 'comments' | 'appearance' | 'plugins' | 'tools' | 'settings'>('main');

    // Авто-сокрытие уведомлений через 5 секунд
    useEffect(() => {
        if (!statusMessage) return;
        const t = setTimeout(() => setStatusMessage(null), 5000);
        return () => clearTimeout(t);
    }, [statusMessage]);

	const handleLogout = () => {
		navigate('/login');
	};

	const safeParse = (s: string) => {
		try { return { ok: true as const, data: JSON.parse(s) }; } catch (e: any) { return { ok: false as const, error: e?.message || 'Invalid JSON' }; }
	};

	const submitCreate = () => {
		// Преобразуем выбранные атрибуты в критерии
		const criteria = selectedAttrs.map((attr, index) => ({
			typeCode: attr.key,
			value: parseInt(attr.value) || 0,
			
		}));

		// Создаем объект для отправки на сервер
		const request = {
			title: achievementForm.title,
			descriptionMd: achievementForm.descriptionMd,
			sectionIds: achievementForm.sectionIds,
			points: achievementForm.points,
			criteria: criteria,
			// Убираем icon и animation из request, так как они будут отправляться как файлы
		};



		dispatch(createAchievement({ 
			request, 
			iconFile: selectedImageFile || undefined,
			animationFile: selectedAnimationFile || undefined
		}))
			.unwrap()
			.then(() => {
				setStatusMessage({ type: 'success', text: 'Достижение успешно создано' });
				setModal(null);
				// Перезагружаем список достижений
				dispatch(fetchAllAchievements());
			})
			.catch((error) => {
				setStatusMessage({ type: 'error', text: error?.message || 'Ошибка создания достижения' });
			});
	};

	const submitUpdate = () => {
		if (selectedAchievementId === '') {
			setStatusMessage({ type: 'error', text: 'Не выбран ID достижения для обновления' });
			return;
		}

		// Создаем объект для отправки на сервер
		const request: any = {
			id: selectedAchievementId
		};

		// Добавляем только измененные поля
		if (achievementForm.title) request.title = achievementForm.title;
		if (achievementForm.descriptionMd) request.descriptionMd = achievementForm.descriptionMd;
		if (achievementForm.sectionIds.length > 0) request.sectionIds = achievementForm.sectionIds;
		if (achievementForm.points !== undefined) request.points = achievementForm.points;

		// Добавляем критерии только если они есть
		if (selectedAttrs.length > 0) {
			const criteria = selectedAttrs.map((attr, index) => ({
				typeCode: attr.key,
				value: parseInt(attr.value) || 0,
			}));
			request.criteria = criteria;
		}



		dispatch(updateAchievement({ 
			request, 
			iconFile: selectedImageFile || undefined,
			animationFile: selectedAnimationFile || undefined
		}))
			.unwrap()
			.then(() => {
				setStatusMessage({ type: 'success', text: 'Достижение успешно обновлено' });
				setModal(null);
				// Перезагружаем список достижений
				dispatch(fetchAllAchievements());
			})
			.catch((error) => {
				setStatusMessage({ type: 'error', text: error?.message || 'Ошибка обновления достижения' });
			});
	};



	const confirmDelete = () => {
		if (!deleteTarget) return;
		if (deleteTarget.type === 'section') {
			const id = deleteTarget.id;
			setSections(prev => prev.filter(s => s.id !== id));
			setAchievements(prev => prev.filter(a => a.section_id !== id));
		}
		if (deleteTarget.type === 'achievement') {
			const id = deleteTarget.id;
			setAchievements(prev => prev.filter(a => a.id !== id));
		}
		setStatusMessage({ type: 'success', text: 'Удалено' });
		setDeleteTarget(null);
		setModal(null);
	};

	// Обработчики для секций
	const handleCreateSection = () => {
		setSectionEdit({ id: null, name: '', description: '' });
		setModal('create-section');
	};

	const handleEditSection = (section: Section) => {
		setSectionEdit({ id: section.id.toString(), name: section.name, description: section.description });
		setModal('edit-section');
	};

	const handleDeleteSection = (section: Section) => {
		setDeleteTarget({ type: 'section', id: section.id });
		setModal('confirm-delete');
	};

	const handleSaveSection = (section: { id: string | null; name: string; description: string }) => {
		if (!section.name.trim()) return;
		
		if (section.id === null) {
			// Создание новой секции
			const sectionData = {
				name: section.name.trim(),
				description: section.description.trim()
			};

			dispatch(createSection(sectionData))
				.unwrap()
				.then(() => {
					setStatusMessage({ type: 'success', text: 'Раздел успешно создан' });
					setModal(null);
					// Перезагружаем список категорий
					dispatch(fetchCategories());
				})
				.catch((error) => {
					setStatusMessage({ type: 'error', text: error || 'Ошибка создания раздела' });
				});
		} else {
			// Редактирование существующей секции
			const sectionData = {
				id: section.id,
				name: section.name.trim(),
				description: section.description.trim()
			};

			dispatch(updateSection(sectionData))
				.unwrap()
				.then(() => {
					setStatusMessage({ type: 'success', text: 'Раздел успешно обновлен' });
					setModal(null);
					// Перезагружаем список категорий
					dispatch(fetchCategories());
				})
				.catch((error) => {
					setStatusMessage({ type: 'error', text: error || 'Ошибка обновления раздела' });
				});
		}
		
		setSectionEdit({ id: null, name: '', description: '' });
	};

	// Обработчики для достижений
	const handleCreateAchievement = () => {

		setSelectedAchievementId('');
		setAchievementForm({ 
			title: '', 
			descriptionMd: '', 
			sectionIds: [],
			points: 0,
			icon: '',
			animation: '',
			criteria: []
		});
		setSelectedAttrs([]);
		setImagePreview('');
		setSelectedImageFile(null);
		setSelectedAnimationFile(null);
		setModal('create-achievement');
	};

	const handleEditAchievement = (achievement: Achievement) => {

		
		setSelectedAchievementId(achievement.id.toString());
		setAchievementForm({ 
			title: achievement.title, 
			descriptionMd: achievement.short_description, // Используем краткое описание как полное
			sectionIds: [achievement.section_id], // Пока оставляем как массив с одним элементом
			points: achievement.points || 0,
			icon: achievement.image_url || '',
			animation: '',
			criteria: []
		});
		setSelectedAttrs(achievement.attributes || []);
		setImagePreview(achievement.image_url || '');
		setSelectedImageFile(null);
		setSelectedAnimationFile(null);
		setModal('edit-achievement');
	};

	const handleDeleteAchievement = (achievement: Achievement) => {
		setDeleteTarget({ type: 'achievement', id: achievement.id });
		setModal('confirm-delete');
	};



	// Обработчики для модального окна достижений
	const handleAddAttribute = () => {
		if (!attrValue.trim()) return;
		const meta = attributeCatalog.find(a => a.key === selectedAttrKey)!;
		setSelectedAttrs(prev => [...prev, { key: selectedAttrKey, label: meta.label, value: attrValue.trim() }]);
		setAttrValue('');
	};

	const handleRemoveAttribute = (index: number) => {
		setSelectedAttrs(prev => prev.filter((_, idx) => idx !== index));
	};

	const handleRemoveImage = () => {
		setImagePreview('');
		setSelectedImageFile(null);
		setSelectedAnimationFile(null);
		setAchievementForm(prev => ({ ...prev, icon: '', animation: '' }));
	};

	return (
		<>
			<AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
			<div className="main-content">
				<AdminHeader 
					activeTab={activeTab} 
					onTabChange={setActiveTab} 
					adminName={adminName} 
					onLogout={handleLogout} 
				/>

				{activeTab === 'main' && <AdminMainPage />}

				{activeTab === 'dashboard' && <AdminDashboard />}

				{activeTab === 'sections' && (
					<AdminSections
						sections={sections}
						achievements={achievements}
						onOpenCreateSection={handleCreateSection}
						onOpenCreateAchievement={handleCreateAchievement}
						onOpenEditSection={handleEditSection}
						onOpenEditAchievement={handleEditAchievement}
						onOpenDeleteSection={handleDeleteSection}
						onOpenDeleteAchievement={handleDeleteAchievement}
						getAchievementUserPercentage={getAchievementUserPercentage}
					/>
				)}

				{activeTab === 'users' && (
					<AdminUsers 
						onOpenAssignAchievement={(userId) => {
							setSelectedUserId(userId || '');
							setModal('assign-achievement');
						}}
					/>
				)}
			</div>

			{/* Статус */}
			<StatusMessage message={statusMessage} onClose={() => setStatusMessage(null)} />

			{/* Модалка секций */}
			<SectionModal
				isOpen={modal === 'create-section' || modal === 'edit-section'}
				isEdit={modal === 'edit-section'}
				section={sectionEdit}
				onClose={() => setModal(null)}
				onSave={handleSaveSection}
				onSectionChange={setSectionEdit}
			/>

			{/* Модалка достижений */}
			<AchievementModal
				isOpen={modal === 'create-achievement' || modal === 'edit-achievement'}
				isEdit={modal === 'edit-achievement'}
				achievementForm={achievementForm}
				selectedAttrs={selectedAttrs}
				imagePreview={imagePreview}
				sections={sections}
				attributeCatalog={attributeCatalog}
				selectedAttrKey={selectedAttrKey}
				attrValue={attrValue}
				createBody=""
				updateBody=""
				onClose={() => setModal(null)}
				onSave={modal === 'create-achievement' ? submitCreate : submitUpdate}
				onAchievementFormChange={(form) => {
					setAchievementForm(form);
				}}
				onSelectedAttrsChange={(attrs) => {
					setSelectedAttrs(attrs);
				}}
				onImagePreviewChange={setImagePreview}
				onSelectedAttrKeyChange={setSelectedAttrKey}
				onAttrValueChange={setAttrValue}
				onCreateBodyChange={() => {}}
				onUpdateBodyChange={() => {}}
				onAddAttribute={handleAddAttribute}
				onRemoveAttribute={handleRemoveAttribute}
				onRemoveImage={handleRemoveImage}
				onImageFileChange={setSelectedImageFile}
				onAnimationFileChange={setSelectedAnimationFile}
			/>

			{/* Модалка назначения достижений */}
			<AssignModal
				isOpen={modal === 'assign-achievement'}
				selectedUserId={selectedUserId}
				onClose={() => {
					setModal(null);
					setSelectedUserId('');
				}}
				onSuccess={() => {
					// Обновляем данные после успешного назначения
					dispatch(fetchAllAchievements());
				}}
			/>

			{/* Модалка подтверждения удаления */}
			<ConfirmDeleteModal
				isOpen={modal === 'confirm-delete'}
				deleteTarget={deleteTarget}
				onClose={() => { setModal(null); setDeleteTarget(null); }}
				onConfirm={confirmDelete}
			/>

			{/* Глобальные порталы */}
			<ToastViewport />
			<ConfirmDialog />
		</>
	);
};

export default AdminPanel;


