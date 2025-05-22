import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Icon from '../icon'
import IconButton from '@mui/material/IconButton'
import { useTranslation } from 'react-i18next'
import { Select } from '@mui/material'
import Divider from '@mui/material/Divider'
import Styles from '../../../style/style.module.css'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

const PaginationCard = ({
  paginationModel,
  onChangePagination,
  paginationPage,
  countList,
  disabledNextBtn,
  ListLength,
  onChangePage
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Divider sx={{ width: '100%', marginTop: 31 }} />
      <Grid item sm={12} md={12} xs={12}>
        <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
          <Typography variant={'subtitle2'} color={'rgba(51, 48, 60, 0.87)'} marginRight={'2rem'} fontSize={'0.8rem'}>
            {t('Rows_per_page')}
          </Typography>

          <Box>
            <Select
              sx={{ fontSize: '0.95rem' }}
              size='small'
              className={Styles.selectPagination}
              labelId='demo-simple-select-label'
              value={paginationModel.pageSize}
              onChange={e => {
                const itemData = {
                  page: paginationModel.page,
                  pageSize: e.target.value
                }
                onChangePagination(itemData)
              }}
            >
              <MenuItem key='pagination' value='10'>
                10
              </MenuItem>
              <MenuItem key='pagination' value='20'>
                20
              </MenuItem>
              <MenuItem key='pagination' value='50'>
                50
              </MenuItem>
            </Select>
          </Box>
          <Typography fontSize={'0.8rem'} variant={'subtitle2'} color={'rgba(51, 48, 60, 0.87)'}>
            {t('pagination footer')} {paginationPage + 1} - {paginationModel.pageSize} of {countList}
          </Typography>

          <IconButton disabled={paginationModel.page === 0} onClick={() => onChangePage('backIconButtonProps')}>
            <Icon
              icon='material-symbols:keyboard-arrow-left'
              color={paginationModel.page === 0 ? 'rgb(51 48 60 / 35%)' : 'rgba(51, 48, 60, 0.87)'}
            />
          </IconButton>
          <IconButton
            disabled={disabledNextBtn || ListLength < paginationModel.pageSize}
            onClick={() => onChangePage('nextIconButtonProps')}
          >
            <Icon
              icon='material-symbols:keyboard-arrow-right'
              color={
                disabledNextBtn || ListLength < paginationModel.pageSize
                  ? 'rgb(51 48 60 / 35%)'
                  : 'rgba(51, 48, 60, 0.87)'
              }
            />
          </IconButton>
        </Box>
      </Grid>
    </>
  )
}

export default PaginationCard
