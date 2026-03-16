export interface BookCoverData {
  title: string;
  subtitle?: string;
  author: string;
  genre: string;
  synopsis: string;
  theme: {
    baseColor: string;
    accentColor: string;
    vibe: 'minimalist' | 'epic' | 'noir' | 'modern';
  };
  features: string[];
}
