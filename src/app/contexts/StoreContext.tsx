'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Store } from '@/lib/types';
import { getCookie } from '@/lib/utils';

interface StoreContextType {
  store: Store | null;
  loading: boolean;
  checkUserStore: () => Promise<Store | null>;
  setStore: (store: Store | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkUserStore = useCallback(async (): Promise<Store | null> => {
    if (hasChecked) return store;

    setLoading(true);
    try {
      // Get user ID from cookies
      const userId = getCookie('user_id');
      
      if (!userId) {
        setStore(null);
        setHasChecked(true);
        return null;
      }

      // Fetch user's store from API
      const response = await fetch(`/api/store?user_id=${userId}`);
      const result = await response.json();

      if (response.ok && result.data) {
        setStore(result.data);
        setHasChecked(true);
        return result.data;
      } else {
        setStore(null);
        setHasChecked(true);
        return null;
      }
    } catch (error) {
      console.error('Error checking user store:', error);
      setStore(null);
      setHasChecked(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, [hasChecked, store]);

  useEffect(() => {
    const userId = getCookie('user_id');
    if (userId && !hasChecked) {
      checkUserStore();
    }
  }, [hasChecked, checkUserStore]);

  return (
    <StoreContext.Provider value={{ store, loading, checkUserStore, setStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
