import { useSyncExternalStore } from "react";

let accessToken: string | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => {
  l()
});

export const setAccessToken = (token: string) => {
  accessToken = token;
  emit();
};

export const clearAccessToken = () => {
  accessToken = null;
  emit();
};

export const getAccessToken = () => accessToken;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// reactive hooks
export const useAccessToken = () =>
  useSyncExternalStore(
    subscribe,
    getAccessToken,
    () => null,
  );