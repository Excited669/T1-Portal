import { addToast } from './notificationsSlice';
import { store } from '@/app/store';
import { registerToastAction } from './registry';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const notify = {
  success(message: string, title?: string) {
    store.dispatch(addToast({ id: genId(), type: 'success', message, title }));
  },
  error(message: string, title?: string) {
    store.dispatch(addToast({ id: genId(), type: 'error', message, title }));
  },
  info(message: string, title?: string) {
    store.dispatch(addToast({ id: genId(), type: 'info', message, title }));
  },
  withAction(message: string, actionLabel: string, onClick: () => void, type: 'success'|'error'|'info' = 'info') {
    const id = genId();
    const actionId = genId();
    registerToastAction(actionId, onClick);
    store.dispatch(addToast({ id, type, message, action: { label: actionLabel, actionId } }));
  },
};
