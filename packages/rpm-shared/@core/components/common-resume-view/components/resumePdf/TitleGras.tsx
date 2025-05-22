import React from 'react'
import { Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

const TitleGras = ({ color, titleChildren }) => {
  const { t } = useTranslation()

  return (
    <Text
      style={{
        fontFamily: 'Lato Bold',
        fontSize: 14,
        marginBottom: 3,
        marginTop: 10,
        textTransform: 'capitalize',
        paddingTop: 3,
        paddingBottom: 3,
        color: color
      }}
    >
      {t(titleChildren)}
    </Text>
  )
}

export default TitleGras
