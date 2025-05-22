import {useTheme} from "@mui/system";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import {alpha, Chip, MenuItem, Select} from "@mui/material";
import Icon from "template-shared/@core/components/icon";
import Typography from "@mui/material/Typography";
import React from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {fetchAllTemplate} from "../../../api/template";

interface CategorySelectorProps {
  selectedCategory?: number | null;
  setSelectedCategory?: (value: number | null) => void;
  categories?: any[];
}

const CategorySelector = ({selectedCategory, setSelectedCategory, categories = []}: CategorySelectorProps) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const {data: allTemplates, isLoading, error} = useQuery(
    'allTemplates',
    fetchAllTemplate,
    {
      select: (data) => {
        if (Array.isArray(data)) {
          return data.map(item => ({
            ...item,
            author: item.author || null,
            category: item.category || null
          }));
        }

        return [];
      }
    }
  );

  const countTemplatesByCategory = React.useCallback((categoryId: number | null) => {
    if (!allTemplates) return 0;

    if (categoryId === null) {
      return allTemplates.length;
    }

    return allTemplates.filter(template => template.category?.id === categoryId).length;
  }, [allTemplates]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading templates</div>;

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      mb: 3,
      position: 'relative',
      mr: 3,
    }}>
      <FormControl sx={{
        width: '240px',
        '& .MuiInputBase-root': {
          borderRadius: '6px',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light'
            }
          }
        }
      }}>
        <Select
          value={selectedCategory ?? ''}
          onChange={(e) => setSelectedCategory?.(e.target.value ? Number(e.target.value) : null)}
          displayEmpty
          inputProps={{'aria-label': 'Category selector'}}
          sx={{
            height: '40px',
            '& .MuiSelect-select': {
              py: 1,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light'
            }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 1,
                borderRadius: '6px',
                boxShadow: theme.shadows[3],
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                  minHeight: 'auto',
                  py: 1
                }
              }
            }
          }}
          renderValue={(selected) => (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%'
            }}>
              <Icon
                icon="mdi:tag-outline"
                fontSize="1rem"
                color={selected ? 'primary' : 'disabled'}
              />
              <Typography variant="body2" noWrap sx={{flex: 1}}>
                {selected ? (
                  categories.find(c => c.id === selected)?.name
                ) : (
                  t('All categories')
                )}
              </Typography>
              <Chip
                label={countTemplatesByCategory(selected || null)}
                size="small"
                sx={{
                  height: '20px',
                  '& .MuiChip-label': {px: 0.5, fontSize: '0.65rem'}
                }}
              />
            </Box>
          )}
        >
          <MenuItem dense value="">
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%'
            }}>
              <Icon icon="mdi:format-list-bulleted" fontSize="1rem"/>
              <Typography variant="body2" sx={{flex: 1}}>
                {t('All categories')}
              </Typography>
              <Chip
                label={countTemplatesByCategory(null)}
                size="small"
                sx={{
                  height: '20px',
                  '& .MuiChip-label': {px: 0.5, fontSize: '0.65rem'}
                }}
              />
            </Box>
          </MenuItem>

          {categories.map((category) => (
            <MenuItem
              dense
              key={category.id}
              value={category.id}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12)
                  }
                }
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                width: '100%'
              }}>
                <Icon
                  icon={category.icon || "mdi:folder-outline"}
                  fontSize="1rem"
                  color={selectedCategory === category.id ? "primary" : "inherit"}
                />
                <Typography variant="body2" sx={{flex: 1}}>
                  {category.name}
                </Typography>
                <Chip
                  label={countTemplatesByCategory(category.id)}
                  size="small"
                  sx={{
                    height: '20px',
                    '& .MuiChip-label': {px: 0.5, fontSize: '0.65rem'}
                  }}
                />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CategorySelector
