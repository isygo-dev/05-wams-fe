/* eslint-disable react/no-array-index-key */

import React from 'react'
import { StyleSheet, View } from '@react-pdf/renderer'

import Title from './Title'
import { ResumeLanguage } from 'rpm-shared/@core/types/rpm/ResumeDetails'
import ListOption, { ItemOptions } from './ListOption'

const styles = StyleSheet.create({
  container: {
    fontSize: 11,
    marginTop: 10
  }
})

type Props = {
  languages: ResumeLanguage[]
}
const Language = (props: Props) => {
  const { languages } = props

  return (
    <View style={styles.container}>
      <Title color='white' titleChildren={'Language'}></Title>
      <View>
        <ListOption>
          {languages?.map((language, i) => (
            <ItemOptions color='white' key={i} level={language.level}>
              {' '}
              {language.name}
            </ItemOptions>
          ))}
        </ListOption>
      </View>
    </View>
  )
}

export default Language
