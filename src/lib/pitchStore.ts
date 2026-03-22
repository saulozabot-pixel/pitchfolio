export type CVData = {
  fullName: string;
  role: string;
  description: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  skills: { name: string; level: number }[];
  experience: { company: string; position: string; period: string; achievements: string[] }[];
  education: { institution: string; degree: string; period: string }[];
};

const KEY = 'pitchfolio_draft';

export function saveDraft(data: CVData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadDraft(): CVData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CVData) : null;
  } catch { return null; }
}

export function hasDraft(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(KEY);
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
