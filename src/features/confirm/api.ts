import { store } from '@/app/store';
import { openConfirm, closeConfirm } from './confirmSlice';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const resolvers = new Map<string, (ok: boolean) => void>();

export function confirm(opts: {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}): Promise<boolean> {
  const id = genId();
  store.dispatch(openConfirm({ id, ...opts }));
  return new Promise<boolean>((resolve) => {
    resolvers.set(id, resolve);
  });
}

export function resolveConfirm(id: string, ok: boolean) {
  const r = resolvers.get(id);
  if (r) r(ok);
  resolvers.delete(id);
  store.dispatch(closeConfirm());
}
