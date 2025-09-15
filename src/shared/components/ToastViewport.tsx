import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { removeToast } from '@/features/notifications/notificationsSlice';
import { callAndUnregister } from '@/features/notifications/registry';

const genClass = (type: 'success' | 'error' | 'info') => {
  switch (type) {
    case 'success': return 'toast toast-success';
    case 'error': return 'toast toast-error';
    default: return 'toast toast-info';
  }
};

const DEFAULT_TIMEOUT = 4000;
const TYPE_TIMEOUT: Record<string, number> = { success: 3000, error: 6000, info: 4000 };

function useAutoHide(id: string, ms: number | undefined, onHide: () => void) {
  const [remaining, setRemaining] = useState(ms ?? DEFAULT_TIMEOUT);
  const start = useRef<number | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    start.current = performance.now();
    timer.current = window.setTimeout(onHide, remaining);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [id]);

  const pause = () => {
    if (timer.current && start.current !== null) {
      window.clearTimeout(timer.current);
      const elapsed = performance.now() - start.current;
      setRemaining(prev => Math.max(0, prev - elapsed));
    }
  };
  const resume = () => {
    start.current = performance.now();
    timer.current = window.setTimeout(onHide, remaining);
  };

  return { pause, resume };
}

const ToastItem: React.FC<{
  id: string;
  type: 'success'|'error'|'info';
  title?: string;
  message: string;
  action?: { label: string; actionId: string };
  timeout?: number;
}> = ({ id, type, title, message, action, timeout }) => {
  const dispatch = useDispatch();
  const close = () => dispatch(removeToast(id));
  const ms = timeout ?? TYPE_TIMEOUT[type] ?? DEFAULT_TIMEOUT;
  const { pause, resume } = useAutoHide(id, ms, close);

  const role = type === 'error' ? 'alert' : 'status';
  const ariaLive = type === 'error' ? 'assertive' : 'polite';

  return (
    <div
      className={genClass(type)}
      role={role}
      aria-live={ariaLive}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="toast-body">
        {title && <div className="toast-title">{title}</div>}
        <div className="toast-message">{message}</div>
      </div>
      {action && (
        <button
          className="toast-action"
          onClick={() => { callAndUnregister(action.actionId); close(); }}
        >
          {action.label}
        </button>
      )}
      <button className="toast-close" aria-label="Закрыть" onClick={close}>×</button>
    </div>
  );
};

export const ToastViewport: React.FC = () => {
  const toasts = useSelector((s: RootState) => s.notifications.toasts);
  const items = useMemo(() => toasts.slice(-5), [toasts]);

  return (
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions removals">
      {items.map(t => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
};

export default ToastViewport;
