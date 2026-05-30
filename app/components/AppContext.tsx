import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { purchaseService } from '../services/PurchaseService';
import { scheduleCountdownNotifications } from '../services/NotificationService';

interface AppState {
  tripDate: Date | null;
  backgroundIndex: number;
  backgroundUri: string | null;
  isPaid: boolean;
  slideshowEnabled: boolean;
  slideshowInterval: number;
  hideMenu: boolean;
  isMenuOpen: boolean;
}

interface AppActions {
  setTripDate: (date: Date) => Promise<void>;
  setBackgroundIndex: (index: number) => Promise<void>;
  setBackgroundUri: (uri: string | null) => Promise<void>;
  setSlideshowEnabled: (enabled: boolean) => Promise<void>;
  setSlideshowInterval: (seconds: number) => Promise<void>;
  setHideMenu: (hide: boolean) => Promise<void>;
  setIsMenuOpen: (open: boolean) => void;
  purchaseFullVersion: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    tripDate: null,
    backgroundIndex: 0,
    backgroundUri: null,
    isPaid: false,
    slideshowEnabled: true,
    slideshowInterval: 5,
    hideMenu: false,
    isMenuOpen: false,
  });

  useEffect(() => {
    (async () => {
      const [tripDate, backgroundIndex, backgroundUri, isPaid, slideshowEnabled, slideshowInterval, hideMenu] =
        await Promise.all([
          StorageService.getTripDate(),
          StorageService.getBackgroundIndex(),
          StorageService.getBackgroundUri(),
          StorageService.getIsPaid(),
          StorageService.getSlideshowEnabled(),
          StorageService.getSlideshowInterval(),
          StorageService.getHideMenu(),
        ]);
      setState(s => ({ ...s, tripDate, backgroundIndex, backgroundUri, isPaid, slideshowEnabled, slideshowInterval, hideMenu }));
    })();
  }, []);

  const setTripDate = useCallback(async (date: Date) => {
    await StorageService.setTripDate(date);
    setState(s => ({ ...s, tripDate: date }));
    await scheduleCountdownNotifications(date);
  }, []);

  const setBackgroundIndex = useCallback(async (index: number) => {
    await StorageService.setBackgroundIndex(index);
    setState(s => ({ ...s, backgroundIndex: index, backgroundUri: null }));
  }, []);

  const setBackgroundUri = useCallback(async (uri: string | null) => {
    await StorageService.setBackgroundUri(uri);
    setState(s => ({ ...s, backgroundUri: uri }));
  }, []);

  const setSlideshowEnabled = useCallback(async (enabled: boolean) => {
    await StorageService.setSlideshowEnabled(enabled);
    setState(s => ({ ...s, slideshowEnabled: enabled }));
  }, []);

  const setSlideshowInterval = useCallback(async (seconds: number) => {
    await StorageService.setSlideshowInterval(seconds);
    setState(s => ({ ...s, slideshowInterval: seconds }));
  }, []);

  const setHideMenu = useCallback(async (hide: boolean) => {
    await StorageService.setHideMenu(hide);
    setState(s => ({ ...s, hideMenu: hide }));
  }, []);

  const setIsMenuOpen = useCallback((open: boolean) => {
    setState(s => ({ ...s, isMenuOpen: open }));
  }, []);

  const purchaseFullVersion = useCallback(async () => {
    const success = await purchaseService.purchaseFullVersion();
    if (success) setState(s => ({ ...s, isPaid: true }));
    return success;
  }, []);

  const restorePurchases = useCallback(async () => {
    const success = await purchaseService.restorePurchases();
    if (success) setState(s => ({ ...s, isPaid: true }));
    return success;
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      setTripDate, setBackgroundIndex, setBackgroundUri,
      setSlideshowEnabled, setSlideshowInterval, setHideMenu,
      setIsMenuOpen, purchaseFullVersion, restorePurchases,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
