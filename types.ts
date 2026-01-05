
export enum PortfolioTheme {
  MODERN = 'modern',
  CREATIVE = 'creative',
  MINIMAL = 'minimal',
  DARK_TECH = 'dark-tech'
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  about: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  contact: {
    email: string;
    location: string;
    socials: SocialLink[];
  };
}

export interface AppState {
  resumeFile: File | null;
  photoUrl: string | null;
  theme: PortfolioTheme;
  portfolioData: PortfolioData | null;
  isGenerating: boolean;
  error: string | null;
}
