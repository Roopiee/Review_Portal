'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'pulse-draft-v1';

interface ReturnShape<T> {
  hydrated: boolean;
  loadedDraft: T | null;
  save: (data: T) => void;
  clear: () => void;
}

/** Persist + restore a JSON-serialisable form-state blob via localStorage. */
export function useDraft<T>(): ReturnShape<T> {
  const [hydrated, setHydrated] = useState(false);
  const [loadedDraft, setLoadedDraft] = useState<T | null>(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLoadedDraft(JSON.parse(raw) as T);
    } catch {
      /* corrupt or unavailable storage — ignore */
    }
    setHydrated(true);
  }, []);

  const save = useCallback((data: T) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full or disabled */
    }
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* no-op */
    }
  }, []);

  return { hydrated, loadedDraft, save, clear };
}
