import React from 'react'
import {Text} from '@react-pdf/renderer'
import {useTranslation} from 'react-i18next'

const Title = ({color, titleChildren}) => {
    const {t} = useTranslation()

    return (
        <Text
            style={{
                fontFamily: 'Lato Bold',
                fontSize: 12,
                marginBottom: 3,
                marginTop: 3,
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

export default Title
