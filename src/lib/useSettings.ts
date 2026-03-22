'use client';

import { useState, useEffect } from 'react';

export type CVSettings = {
  includePhoto: boolean;
  photoStyle: string;
  language: string;
  emailNotifications: boolean;
  publicProfile: boolean;
};

const DEFAULTS: CVSettings = {
  includePhoto: true,
  photoStyle: 'professional',
  language: 'pt-BR',
  emailNotifications: true,
  publicProfile: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<CVSettings>(DEFAULTS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('elite_cv_settings');
      if (stored) setSettings({ ...DEFAULTS, ...JSON.parse(stored) });
    } catch {}
  }, []);

  function updateSetting<K extends keyof CVSettings>(key: K, value: CVSettings[K]) {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem('elite_cv_settings', JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return { settings, updateSetting };
}

/** Leitura síncrona — use fora de componentes React ou no SSR com fallback */
export function getSettings(): CVSettings {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const stored = localStorage.getItem('elite_cv_settings');
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
