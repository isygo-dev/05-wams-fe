import React from 'react';
import { Card, Grid, Typography, Box, useTheme, alpha } from '@mui/material';
import { Icon } from '@iconify/react';
import { DashboardStats } from "../../../api/dashboard";
import { StatItem } from "../../../types/Dashboard";
import {useRouter} from "next/router";

interface StatsWidgetProps {
  stats: DashboardStats;
  items: StatItem[];
  denseMode: boolean;
  columns: number;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ stats, items, denseMode, columns }) => {
  const theme = useTheme();
  const router = useRouter();

  const statCardStyle = (hasPath: boolean) => ({
    p: denseMode ? 2 : 3,
    height: '100%',
    borderRadius: 3,
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: hasPath ? 'pointer' : 'default',
    '&:hover': {
      transform: hasPath ? 'translateY(-5px)' : 'none',
      boxShadow: hasPath ? '0 8px 25px 0 rgba(0,0,0,0.1)' : '0 4px 20px 0 rgba(0,0,0,0.05)'
    }
  });

  const getStatValue = (valueKey: keyof DashboardStats): number => {
    const value = stats[valueKey];

    return typeof value === 'number' ? value : 0;
  };

  const handleCardClick = (path?: string) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <Grid container spacing={denseMode ? 2 : 3} sx={{ mb: 4 }}>
      {items
        .filter(item => stats[item.valueKey] !== undefined)
        .slice(0, columns === 4 ? 4 : columns)
        .map((stat) => {
          const value = getStatValue(stat.valueKey);

          return (
            <Grid item xs={12} sm={6} md={12 / columns} key={stat.id}>
              <Card
                sx={statCardStyle(!!stat.path)}
                onClick={() => handleCardClick(stat.path)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      mb: 0.5
                    }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary
                    }}>
                      {value}
                    </Typography>
                  </Box>
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[stat.color].main, 0.1)
                  }}>
                    <Icon icon={stat.icon} fontSize={28} color={theme.palette[stat.color].main} />
                  </Box>
                </Box>
                <Box sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  color: stat.trend === 'up' ? theme.palette.success.main :
                    stat.trend === 'down' ? theme.palette.error.main :
                      theme.palette.warning.main
                }}>
                  {/*<Icon icon={*/}
                  {/*  stat.trend === 'up' ? 'mdi:trending-up' :*/}
                  {/*    stat.trend === 'down' ? 'mdi:trending-down' : 'mdi:trending-neutral'*/}
                  {/*} fontSize={20} />*/}
                  {/*<Typography variant="body2" sx={{ ml: 0.5 }}>*/}
                  {/*  {stat.trend === 'up' ? '+12%' : stat.trend === 'down' ? '-5%' : '0%'} vs mois dernier*/}
                  {/*</Typography>*/}
                </Box>
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default StatsWidget;
