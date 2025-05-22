/* eslint-disable react/no-array-index-key */

import React from 'react'
import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { ResumeEducation, ResumeProfExperience } from 'rpm-shared/@core/types/rpm/ResumeDetails'
import Education from './Education'
import Experience from './Experience'
import TitleGras from './TitleGras'

type Props = {
  profExperiences: ResumeProfExperience[]
  educations: ResumeEducation[]
  presentation?: string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 15,
    '@media max-width: 400': {
      paddingTop: 20,
      paddingLeft: 5
    }
  },
  details: {
    fontSize: 10,
    fontFamily: 'Lato',
    marginBottom: 10,
    color: '#656565'
  }
})

const Details = (props: Props) => {
  const { profExperiences, educations, presentation } = props

  return (
    <>
      <View style={styles.container}>
        {presentation != null && presentation != '' ? (
          <>
            <TitleGras color='black' titleChildren='Resume.Profile_professional'></TitleGras>
            <Text style={styles.details}> {presentation} </Text>
          </>
        ) : null}

        <TitleGras color='black' titleChildren='Job.Experience'></TitleGras>
        {profExperiences?.map(experience => <Experience experience={experience} key={experience.id} />)}
        <TitleGras color='black' titleChildren='Education'></TitleGras>
        {educations?.map(education => <Education education={education} key={education.id} />)}
      </View>
    </>
  )
}

export default Details
