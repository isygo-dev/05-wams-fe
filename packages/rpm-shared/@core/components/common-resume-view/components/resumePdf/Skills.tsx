/* eslint-disable react/no-array-index-key */

import React from 'react'
import { StyleSheet, Text, View } from '@react-pdf/renderer'

import Title from './Title'
import { Skill } from 'rpm-shared/@core/types/rpm/ResumeDetails'
import ListOption from './ListOption'

const styles = StyleSheet.create({
  container: {
    fontSize: 11,
    marginTop: 10
  },
  divProgressBar: {
    width: '150px',
    height: '8px',
    background: '#F8F7FA',
    borderBottom: '8px solid white',
    marginTop: 4,
    marginBottom: 4
  }
})

const SkillEntry = ({ skills }) => (
  <View>
    <ListOption>
      {skills?.map((skill: Skill, i) => (
        <View key={i}>
          <Text style={{ color: 'white' }}>{skill.name}</Text>
          <View style={styles.divProgressBar} key={i}>
            <View
              style={{
                width: `${skill.score + '%'}`,
                borderBottom: '8px solid #CE0128'
              }}
            ></View>
          </View>
        </View>
      ))}
    </ListOption>
  </View>
)

type Props = {
  skills: Skill[]
}
const Skills = (props: Props) => {
  const { skills } = props

  return (
    <View style={styles.container}>
      <Title titleChildren={'Skills'} color='white'></Title>
      <SkillEntry skills={skills} />
    </View>
  )
}

export default Skills
