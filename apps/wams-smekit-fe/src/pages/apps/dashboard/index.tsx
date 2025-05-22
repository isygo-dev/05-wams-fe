import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Grid,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { useQuery } from 'react-query';
import { useTranslation } from "react-i18next";
import { DashboardStats, fetchDashboardStats } from "../../../api/dashboard";
import DashboardControls from "../../../views/apps/dashboard/DashboardControls";
import StatsWidget from "../../../views/apps/dashboard/StatsWidget";
import RecentTemplatesWidget from "../../../views/apps/dashboard/RecentTemplatesWidget";
import { DashboardLayout, StatItem } from "../../../types/Dashboard";
import DocumentFormatsWidget from "../../../views/apps/dashboard/DocumentFormatsWidget";
import TopCategoriesWidget from "../../../views/apps/dashboard/TopCategoriesWidget";
import LanguagesWidget from "../../../views/apps/dashboard/LanguagesWidget";
import CustomizeDialog from "../../../views/apps/dashboard/CustomizeDialog";

const Dashboard = () => {
  const { t } = useTranslation();

  const defaultLayout: DashboardLayout = {
    widgets: [
      { id: 'stats', title: t('Statistiques'), visible: true },
      { id: 'recent', title: t('Templates Récents'), visible: true, column: 'left' },
      { id: 'formats', title: t('Formats de Documents'), visible: true, column: 'left' },
      { id: 'categories', title: t('Top Catégories'), visible: true, column: 'right' },
      { id: 'languages', title: t('Langues Disponibles'), visible: true, column: 'right' },
      { id: 'pinned', title: t('Templates Épinglés'), visible: true, column: 'right' }

    ],
    denseMode: false,
    colorMode: 'light',
    statsColumns: 3
  };

  const [layout, setLayout] = useState<DashboardLayout>(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');


    return savedLayout ? JSON.parse(savedLayout) : defaultLayout;
  });

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = createTheme({
    palette: {
      mode: layout.colorMode
    }
  });

  const statItems: StatItem[] = [
    {
      id: 'totalTemplates',
      valueKey: 'totalTemplates',
      label: t('Templates Totaux'),
      icon: 'mdi:file-document-outline',
      color: 'primary',
      trend: 'up',
      path: '/apps/template'
    },
    {
      id: 'totalCategories',
      valueKey: 'totalCategories',
      label: t('Catégories'),
      icon: 'mdi:folder-outline',
      color: 'success',
      trend: 'neutral',
      path:'/apps/category'
    },
    {
      id: 'activeAuthors',
      valueKey: 'activeAuthors',
      label: t('Auteurs Actifs'),
      icon: 'mdi:account-group-outline',
      color: 'warning',
      trend: 'up',
      path:'/apps/author'
    },
    {
      id: 'pinnedTemplates',
      valueKey: 'pinnedTemplates',
      label: t('Templates Épinglés'),
      icon: 'mdi:pin',
      color: 'info',
      trend: 'neutral',
      path:'/apps/CustomTemplates'
    }
  ]

  const { data, isLoading, error, refetch } = useQuery<DashboardStats>(
    'dashboardStats',
    fetchDashboardStats,
  {
    onSuccess: (data) => {
      console.log('Dashboard data received:', data);
    }
  }
  );


  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: theme.palette.background.default
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 5, background: theme.palette.background.default }}>
        <Alert severity="error" sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: theme.shadows[1]
        }}>
          Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.
        </Alert>
      </Box>
    );
  }

  if (!data) return null;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        p: { xs: 2, md: layout.denseMode ? 3 : 5 },
        background: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        <DashboardControls
          layout={layout}
          setLayout={setLayout}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          onCustomizeClick={() => setCustomizeOpen(true)}
          setCustomizeOpen={setCustomizeOpen}
        />
        <CustomizeDialog
          open={customizeOpen}
          onClose={() => setCustomizeOpen(false)}
          layout={layout}
          setLayout={setLayout}
        />

        {layout.widgets.find(w => w.id === 'stats')?.visible && (
          <StatsWidget
            stats={data}
            items={statItems}
            denseMode={layout.denseMode}
            columns={layout.statsColumns}
          />
        )}


        <Grid container spacing={layout.denseMode ? 2 : 3}>
          <Grid item xs={12} md={8}>
            {layout.widgets.find(w => w.id === 'recent')?.visible && (
              <RecentTemplatesWidget
                templates={data.recentTemplates}
                denseMode={layout.denseMode}
                onRefresh={refetch}
              />
            )}

            {layout.widgets.find(w => w.id === 'formats')?.visible && (
              <DocumentFormatsWidget
                formats={data.documentFormats}
                totalTemplates={data.totalTemplates}
                denseMode={layout.denseMode}
              />
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            {layout.widgets.find(w => w.id === 'categories')?.visible && (
              <TopCategoriesWidget
                categories={data.topCategories}
                denseMode={layout.denseMode}
              />
            )}

            {layout.widgets.find(w => w.id === 'languages')?.visible && (
              <LanguagesWidget
                languages={data.languageStats}
                denseMode={layout.denseMode}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
