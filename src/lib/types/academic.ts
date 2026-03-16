export interface AcademicWork {
  title: string;
  subtitle?: string;
  author: string;
  institution: string;
  department: string;
  advisor: string;
  abstract: string;
  chapters: {
    title: string;
    content: string;
    keywords: string[];
  }[];
  references: string[];
  year: number;
}
