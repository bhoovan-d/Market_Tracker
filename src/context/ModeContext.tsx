'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DisplayMode = 'expert' | 'simple';

interface ModeContextValue {
  mode: DisplayMode;
  toggleMode: () => void;
  isSimple: boolean;
}

const ModeContext = createContext<ModeContextValue>({
  mode: 'simple',
  toggleMode: () => {},
  isSimple: true,
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<DisplayMode>('simple');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nifty-pulse-mode') as DisplayMode | null;
      if (stored === 'expert' || stored === 'simple') setMode(stored);
    } catch {}
  }, []);

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'simple' ? 'expert' : 'simple';
      try { localStorage.setItem('nifty-pulse-mode', next); } catch {}
      return next;
    });
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, isSimple: mode === 'simple' }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
