export type ProjectCategory = 'resume' | 'academic' | 'book' | 'event';

export interface CategoryConfig {
  id: ProjectCategory;
  label: string;
  description: string;
  premium: boolean;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'resume',
    label: 'Extraordinary Resume',
    description: 'Transform standard career data into high-impact interactive profiles.',
    premium: false,
  },
  {
    id: 'academic',
    label: 'Academic Masterpiece',
    description: 'Elevate thesis, papers, and research into visually stunning presentations.',
    premium: true,
  },
  {
    id: 'book',
    label: 'Publishing Elite',
    description: 'Generate extraordinary book covers and interactive digital flipbooks.',
    premium: true,
  },
  {
    id: 'event',
    label: 'Premium Experiences',
    description: 'Create virtual and physical invitations with interactive RSVP systems.',
    premium: false,
  },
];
