'use client';

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive';
  action?: ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...item, id }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  return { toasts, toast, dismiss };
}
