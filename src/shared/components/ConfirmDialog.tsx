import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { resolveConfirm } from '@/features/confirm/api';

export const ConfirmDialog: React.FC = () => {
  const current = useSelector((s: RootState) => s.confirm.current);
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (current) okRef.current?.focus();
  }, [current]);

  if (!current) return null;

  const { id, title, message, confirmLabel = 'Удалить', cancelLabel = 'Отмена' } = current;

  const close = () => resolveConfirm(id, false);
  const confirm = () => resolveConfirm(id, true);

  return (
    <div className="confirm-backdrop" onClick={close}>
      <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
        {title && <h2 id="confirm-title">{title}</h2>}
        <p>{message}</p>
        <div className="confirm-actions">
          <button onClick={close}>{cancelLabel}</button>
          <button ref={okRef} className="danger" onClick={confirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
