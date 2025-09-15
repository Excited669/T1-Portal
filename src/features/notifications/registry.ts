const handlers = new Map<string, () => void>();

export const registerToastAction = (id: string, handler: () => void) => {
  handlers.set(id, handler);
};

export const callAndUnregister = (id: string) => {
  const fn = handlers.get(id);
  if (fn) fn();
  handlers.delete(id);
};
