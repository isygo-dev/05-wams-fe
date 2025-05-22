import React from 'react';
import {alpha, Box, Card, Chip, Typography, useTheme} from '@mui/material';
import {Icon} from '@iconify/react';
import {useTranslation} from "react-i18next";

interface TopCategoriesWidgetProps {
  categories: Array<{
    name: string;
    count: number;
  }>;
  denseMode: boolean;
}

const TopCategoriesWidget: React.FC<TopCategoriesWidgetProps> = ({
                                                                   categories,
                                                                   denseMode
                                                                 }) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <Card sx={{
      p: denseMode ? 2 : 3,
      mb: 3,
      borderRadius: 3,
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
    }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 600
        }}
      >
        {t('Top Catégories')}
      </Typography>

      {categories?.length > 0 ? (
        <Box>
          {categories.map((category, index) => (
            <Box
              key={category.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.action.hover,
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: theme.palette.action.selected
                }
              }}
            >
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }}>
                  #{index + 1}
                </Box>
                <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                  {category.name}
                </Typography>
              </Box>
              <Chip
                label={t('template_with_count', {
                  count: category.count,
                  template: category.count === 1 ? t('template_one') : t('template_other')
                })}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  borderRadius: 1
                }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{
          p: 3,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: theme.palette.action.hover
        }}>
          <Icon
            icon="mdi:folder-outline"
            width={48}
            style={{
              color: theme.palette.text.disabled,
              marginBottom: 16
            }}
          />
          <Typography variant="body2" sx={{
            color: theme.palette.text.disabled
          }}>
            {t('Aucune catégorie disponible')}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default TopCategoriesWidget;
