/* eslint-disable react/no-array-index-key */

import React from 'react'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import List, { Item } from './List'
import { ResumeProfExperience } from 'rpm-shared/@core/types/rpm/ResumeDetails'

type ExpProps = {
  experience: ResumeProfExperience
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 15,
    '@media max-width: 400': {
      paddingTop: 10,
      paddingLeft: 0
    }
  },
  entryContainer: {
    marginBottom: 10
  },
  entryContainerBottom: {
    borderBottom: '1px dashed #bfbfbf',
    marginBottom: 10,
    paddingBottom: 5
  },
  date: {
    fontSize: 11,
    fontFamily: 'Lato Italic'
  },
  detailContainer: {
    flexDirection: 'row'
  },
  detailLeftColumn: {
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10
  },
  detailRightColumn: {
    flexDirection: 'column',
    flexGrow: 9
  },
  bulletPoint: {
    fontSize: 10
  },
  details: {
    fontSize: 10,
    fontFamily: 'Lato',
    marginBottom: 10,
    color: '#656565'
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 15
  },
  leftColumn: {
    flexDirection: 'column',
    flexGrow: 9
  },
  rightColumn: {
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'flex-end',
    justifySelf: 'flex-end'
  },
  title: {
    fontSize: 11,
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'Lato',
    textTransform: 'capitalize'
  },

  titleJob: {
    fontSize: 11,
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'Lato Bold',
    marginBottom: 5,
    textTransform: 'capitalize'
  }
})

const Experience = (exProps: ExpProps) => {
  const { experience } = exProps

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.titleJob}>
            {experience.jobTitle}, {experience.employer}{' '}
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.date}>
            {experience.startDate !== null ? new Date(experience.startDate).toLocaleDateString() : null} -{' '}
            {!experience.workhere ? new Date(experience.endDate).toLocaleDateString() : null}
          </Text>
          <Text style={styles.date}>
            {experience.country} - {experience.city}
          </Text>
        </View>
      </View>
      <Text style={styles.details}>{experience.description}</Text>
      {experience.technology?.length > 0 ? (
        <List>
          {/*<Text style={styles.titleJob}>{t('Resume.Technology')}</Text>*/}
          <Text style={{ display: 'flex' }}>
            {experience.technology?.map((detail, i) => <Item key={i}>{detail} /</Item>)}
          </Text>
        </List>
      ) : null}
    </View>
  )
}

export default Experience
