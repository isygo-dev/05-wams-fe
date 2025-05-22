/* eslint-disable react/no-array-index-key */

import React from 'react'
import { StyleSheet, View } from '@react-pdf/renderer'

import Title from './Title'
import { ResumeCertification } from 'rpm-shared/@core/types/rpm/ResumeDetails'
import ListOption, { ItemOptions } from './ListOption'

const styles = StyleSheet.create({
  container: {
    fontSize: 11,
    marginTop: 10
  }
})

const CertificateEntry = ({ otions }) => (
  <View>
    <ListOption>
      {otions?.map((otions: ResumeCertification, i) => (
        <ItemOptions color={'white'} key={i} level=''>
          {' '}
          {otions.name}
        </ItemOptions>
      ))}
    </ListOption>
  </View>
)

type Props = {
  certification: ResumeCertification[]
}
const Skills = (props: Props) => {
  const { certification } = props

  return (
    <View style={styles.container}>
      <Title color='white' titleChildren={'Resume.Certification'}></Title>
      <CertificateEntry key='certification' otions={certification} />
    </View>
  )
}

export default Skills
