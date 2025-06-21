import React from 'react';
import { Card, Grid, Typography, Box, useTheme, alpha, Divider, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import {DashboardStats, StatItem} from "../../../types/Dashboard";
import { useRouter } from "next/router";

interface ComparisonData {
  previousValue?: number;
  percentChange?: number;
  period?: string;
}

interface StatsWidgetProps {
  stats: DashboardStats;
  items: StatItem[];
  denseMode: boolean;
  statsWidgets: string[];
  showComparison?: boolean;
  comparisonData?: Record<string, ComparisonData>;
  comparisonPeriod?: 'day' | 'week' | 'month' | 'year';
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  stats,
  items,
  denseMode,
  statsWidgets = [],
  showComparison = true,
  comparisonData = {},
  comparisonPeriod = 'day'
}) => {
  const theme = useTheme();
  const router = useRouter();

  const statCardStyle = (hasPath: boolean, color: string) => ({
    p: denseMode ? 2.5 : 3,
    height: '100%',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 10px 30px 0 ${alpha(theme.palette.common.black, 0.08)}`,
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    background: `linear-gradient(135deg, ${alpha(theme.palette[color].light, 0.2)} 0%, ${alpha(theme.palette[color].light, 0.05)} 100%)`,
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha(theme.palette[color].main, 0.12)}`,
    cursor: hasPath ? 'pointer' : 'default',
    '&:hover': {
      transform: hasPath ? 'translateY(-5px)' : 'none',
      boxShadow: hasPath
        ? `0 14px 40px 0 ${alpha(theme.palette.common.black, 0.12)}, 0 0 0 1px ${alpha(theme.palette[color].main, 0.1)}`
        : `0 10px 30px 0 ${alpha(theme.palette.common.black, 0.08)}`,
      '& .stat-icon-container': {
        transform: 'scale(1.1) translateY(-2px)',
        boxShadow: `0 10px 25px 0 ${alpha(theme.palette[color].main, 0.4)}`
      }
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '30%',
      height: '30%',
      background: `radial-gradient(circle at top right, ${alpha(theme.palette[color].main, 0.1)}, transparent 70%)`,
      borderTopRightRadius: 3,
      zIndex: 0
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

  const safeStatsWidgets = Array.isArray(statsWidgets) ? statsWidgets : [];

  const visibleStats = items.filter(item =>
    safeStatsWidgets.includes(item.id) &&
    stats[item.valueKey] !== undefined
  );

  const statsToShow = visibleStats.length > 0 ? visibleStats : items.filter(item => stats[item.valueKey] !== undefined);

  const gridSize = 12 / (statsToShow.length || 1);
  const gridSizeProps = {
    xs: 12,
    sm: statsToShow.length === 1 ? 12 : 6,
    md: gridSize > 6 ? 6 : gridSize,
    lg: gridSize
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }

    return num.toString();
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'mdi:trending-up';
      case 'down':
        return 'mdi:trending-down';
      default:
        return 'mdi:trending-neutral';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

  const getPercentChangeText = (percentChange: number | undefined): string => {
    if (percentChange === undefined) return '';

    const absChange = Math.abs(percentChange);
    const prefix = percentChange > 0 ? '+' : percentChange < 0 ? '-' : '';

    return `${prefix}${absChange.toFixed(1)}%`;
  };

  const getComparisonTrend = (percentChange: number | undefined): 'up' | 'down' | 'neutral' => {
    if (percentChange === undefined) return 'neutral';
    if (percentChange > 0) return 'up';
    if (percentChange < 0) return 'down';

    return 'neutral';
  };

  const getPeriodText = (period: string = comparisonPeriod): string => {
    switch (period) {
      case 'day': return 'hier';
      case 'week': return 'semaine dernière';
      case 'month': return 'mois dernier';
      case 'year': return 'année dernière';
      default: return period;
    }
  };

  return (
    <Grid container spacing={denseMode ? 2 : 3} sx={{ mb: 4 }}>
      {statsToShow.map((stat) => {
        const value = getStatValue(stat.valueKey);
        const comparison = comparisonData[stat.id];
        const hasComparison = showComparison && comparison && comparison.percentChange !== undefined;
        const comparisonTrend = hasComparison ? getComparisonTrend(comparison.percentChange) : stat.trend;

        return (
          <Grid item {...gridSizeProps} key={stat.id}>
            <Card
              elevation={0}
              sx={statCardStyle(!!stat.path, stat.color)}
              onClick={() => handleCardClick(stat.path)}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography variant="body2" sx={{
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      mb: 0.5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.75rem'
                    }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      {formatNumber(value)}
                      <Box component="span" sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: getTrendColor(comparisonTrend),
                        fontSize: '1rem',
                        ml: 1
                      }}>
                        <Icon icon={getTrendIcon(comparisonTrend)} fontSize="1rem" style={{ marginRight: 4 }} />
                      </Box>
                    </Typography>
                  </Box>
                  <Box
                    className="stat-icon-container"
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: theme.palette[stat.color].main,
                      color: 'white',
                      boxShadow: `0 6px 15px 0 ${alpha(theme.palette[stat.color].main, 0.35)}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Icon icon={stat.icon} fontSize={24} />
                  </Box>
                </Box>

                <Divider sx={{
                  my: 1.5,
                  opacity: 0.1,
                  borderColor: theme.palette[stat.color].main
                }} />

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 0.5
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: theme.palette.text.secondary
                  }}>

                  </Box>

                  {hasComparison && (
                    <Tooltip title={`Comparé à ${getPeriodText(comparison.period)}: ${comparison.previousValue}`}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          color: getTrendColor(comparisonTrend),
                          ml: 1,
                          p: '2px 8px',
                          borderRadius: '10px',
                          bgcolor: alpha(getTrendColor(comparisonTrend), 0.1)
                        }}
                      >
                        {getPercentChangeText(comparison.percentChange)}
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsWidget;
