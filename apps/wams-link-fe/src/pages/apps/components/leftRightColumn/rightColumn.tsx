import React from 'react'
import {Card, CardContent} from '@mui/material'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import {useTranslation} from 'react-i18next'

const LeftColumn = () => {
  const {t} = useTranslation()

  return (
    <Card>
      <CardHeader title='Common'/>
      <CardContent>
        <Typography sx={{mb: 4}}>{t('No ability is required to view this card')}</Typography>
        <Typography sx={{color: 'primary.main'}}>This card is visible to 'user' and 'admin' both</Typography>
      </CardContent>
    </Card>
  )
}

export default LeftColumn
