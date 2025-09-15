# Система уведомлений и диалогов подтверждения

Этот проект теперь использует современную систему уведомлений (тостов) и диалогов подтверждения вместо устаревших `alert`, `confirm` и `console.error`.

## Что было заменено

### 1. Alert → Toast уведомления
- **Успех**: `notify.success('Достижение успешно создано')`
- **Ошибка**: `notify.error('Ошибка создания достижения')`
- **Информация**: `notify.info('Загрузка завершена')`

### 2. Confirm → Диалог подтверждения
- **Старый код**: `if (confirm('Удалить?')) { ... }`
- **Новый код**: `if (await confirm({ message: 'Удалить?' })) { ... }`

### 3. Console.error → Автоматические тосты
- Все ошибки HTTP запросов автоматически показываются как красные тосты
- Успешные запросы могут показывать зеленые тосты через `request(config, { successMessage: '...' })`

## Как использовать

### Простые уведомления
```tsx
import { notify } from '@/features/notifications/notify';

// Успех
notify.success('Данные сохранены');

// Ошибка
notify.error('Что-то пошло не так');

// Информация
notify.info('Загрузка завершена');
```

### Уведомления с действиями
```tsx
notify.withAction(
  'Файл удален', 
  'Отменить', 
  () => restoreFile(),
  'success'
);
```

### Диалоги подтверждения
```tsx
import { confirm } from '@/features/confirm/api';

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Удалить запись?',
    message: 'Действие необратимо.',
    confirmLabel: 'Удалить',
    cancelLabel: 'Отмена'
  });
  
  if (confirmed) {
    // Выполнить удаление
  }
};
```

### HTTP запросы с автоматическими уведомлениями
```tsx
import { request } from '@/shared/api/http';

// Автоматически покажет ошибку как красный тост
const response = await request({ url: '/api/users', method: 'GET' });

// Покажет успех как зеленый тост
const response = await request(
  { url: '/api/users', method: 'POST', data: userData },
  { successMessage: 'Пользователь создан' }
);
```

## Структура файлов

```
src/
├── features/
│   ├── notifications/
│   │   ├── notificationsSlice.ts    # Redux слайс для тостов
│   │   ├── registry.ts              # Реестр обработчиков действий
│   │   └── notify.ts                # Хелперы для вызова тостов
│   └── confirm/
│       ├── confirmSlice.ts          # Redux слайс для диалогов
│       └── api.ts                   # API для диалогов подтверждения
├── shared/
│   ├── components/
│   │   ├── ToastViewport.tsx        # Компонент отображения тостов
│   │   └── ConfirmDialog.tsx        # Компонент диалога подтверждения
│   └── api/
│       └── http.ts                  # HTTP клиент с перехватчиками
└── styles/
    ├── toast.css                    # Стили для тостов
    └── confirm.css                  # Стили для диалогов
```

## Особенности

- **Автозакрытие**: Тосты автоматически исчезают через 3-6 секунд
- **Пауза при наведении**: Таймер останавливается при наведении мыши
- **Максимум 5 тостов**: Одновременно показывается не более 5 уведомлений
- **Доступность**: Поддержка ARIA атрибутов и клавиатурной навигации
- **Типы**: 3 типа тостов: success (зеленый), error (красный), info (синий)

## Миграция

### Заменить alert на notify
```tsx
// Было
alert('Достижение создано');

// Стало
notify.success('Достижение создано');
```

### Заменить confirm на новую функцию
```tsx
// Было
if (confirm('Удалить?')) { ... }

// Стало
if (await confirm({ message: 'Удалить?' })) { ... }
```

### Убрать console.error
```tsx
// Было
console.error('Ошибка:', error);

// Стало - ничего не нужно, ошибка покажется автоматически
```

## Подключение в новых компонентах

1. Импортировать стили:
```tsx
import '@/styles/toast.css';
import '@/styles/confirm.css';
```

2. Добавить компоненты в рендер:
```tsx
return (
  <div>
    {/* Ваш контент */}
    
    {/* Глобальные порталы */}
    <ToastViewport />
    <ConfirmDialog />
  </div>
);
```

3. Использовать уведомления:
```tsx
import { notify } from '@/features/notifications/notify';
import { confirm } from '@/features/confirm/api';

// Ваш код...
```
