export interface Contingent {
  id: string;
  name: string;
  code?: string;
  logoUrl?: string; // base64 or url
  gold: number;
  silver: number;
  bronze: number;
  total?: number;
  officialRank?: number;
}

export interface AppHeaderSettings {
  mainTitle: string;
  subTitle: string;
  tagline: string;
  logo1: string; // Left logo (e.g. Pemkab / Disdik Gresik)
  logo2: string; // Center logo (e.g. POR SD Kecamatan Benjeng)
  logo3: string; // Right logo (e.g. KORWIL / KONI)
  logo1Label?: string;
  logo2Label?: string;
  logo3Label?: string;
}

export interface AppThemeSettings {
  themeMode: 'navy' | 'dark' | 'royal' | 'goldAccent';
  bgPattern: 'grid' | 'dots' | 'geometric' | 'none';
  tickerEnabled: boolean;
  autoScroll: boolean;
  autoScrollSpeed: number; // in seconds
}

export interface MedalLog {
  id: string;
  timestamp: number;
  contingentName: string;
  contingentId: string;
  type: 'gold' | 'silver' | 'bronze';
  delta: number;
  note?: string;
}

export interface AppData {
  contingents: Contingent[];
  header: AppHeaderSettings;
  theme: AppThemeSettings;
  logs: MedalLog[];
  lastUpdated: string;
}
