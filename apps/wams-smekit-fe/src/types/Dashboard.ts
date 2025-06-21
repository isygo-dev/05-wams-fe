import { PaletteMode } from '@mui/material';
import {FavoriteTemplateType} from "./FavoriteTemplate";

export type Widget = {
  id: string;
  title: string;
  visible: boolean;
  column?: 'left' | 'right';
};

export type DashboardLayout = {
  widgets: Widget[];
  denseMode: boolean;
  colorMode: PaletteMode;
  statsWidgets: string[];
};

export interface RecentTemplate {
  id: number;
  name: string;
  author: string;
  date: string;
  category: string;
  status: 'active' | 'pending';
}

export type Category = {
  name: string;
  count: number;
};

export type DashboardStats = {
  totalTemplates: number;
  totalCategories: number;
  activeAuthors: number;
  pinnedTemplates: number;
  recentTemplates: RecentTemplate[];
  documentFormats: Record<string, number>;
  topCategories: Category[];
  languageStats: Record<string, number>;
  favoriteTemplate?: FavoriteTemplateType;
};

export type StatItem = {
  id: string;
  valueKey: keyof DashboardStats;
  label: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'info' | 'error';
  trend: 'up' | 'down' | 'neutral';
  path?: string;
  visible?: boolean;
};
