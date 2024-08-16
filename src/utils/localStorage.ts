type LocalStorageKey = 'token' | 'user' | 'chatUser';

export const getLocalStorageItem = (key: LocalStorageKey) => localStorage.getItem(key);

export const setLocalStorageItem = (key: LocalStorageKey, payload: string) =>
  localStorage.setItem(key, payload);

export const removeLocalStorageItem = (key: LocalStorageKey) => localStorage.removeItem(key);
