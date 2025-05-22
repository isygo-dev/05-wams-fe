import React, { useEffect, useState } from 'react'
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import Answer from './Answer'
import Summary from './summary'
import localStorageKeys from 'template-shared/configs/localeStorage'
import { CandidateQuizReportType, QuestionDetailsType } from 'quiz-shared/@core/types/quiz/quizCandidateType'

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    '@media max-width: 400': {
      flexDirection: 'column'
    },
    marginTop: 20
  },
  titleName: {
    fontFamily: 'Lato Bold',
    textTransform: 'uppercase',
    textAlign: 'left',
    color: 'black'
  },

  mainHeader: {
    justifyContent: 'flex-start'
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8
  },
  TitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 8
  },
  label: {
    marginRight: 15
  },
  details: {
    fontSize: 10,
    fontFamily: 'Lato',
    marginBottom: 10,
    color: '#656565'
  }
})

Font.register({
  family: 'Open Sans',
  src: `https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf`
})

Font.register({
  family: 'Lato',
  src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`
})

Font.register({
  family: 'Lato Italic',
  src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`
})

Font.register({
  family: 'Lato Bold',
  src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`
})

type Props = {
  data: CandidateQuizReportType
}

const DocumentPdf = (props: Props) => {
  const { data } = props

  const [allQuestions, setAllQuestions] = useState<QuestionDetailsType[]>([])

  useEffect(() => {
    if (data) {
      const questions = data.sections.flatMap(section => section.questions)
      setAllQuestions(questions)
    }
  }, [data])

  const userData = JSON.parse(localStorage.getItem(localStorageKeys.userData) || '{}')
  const scoreTotal = allQuestions.length > 0 ? Math.floor((data?.score / allQuestions.length) * 100) : null

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.container}>
          <View style={styles.mainHeader}>
            <View style={styles.TitleContainer}>
              <Text style={styles.titleName}>
                {userData.firstName} {userData.lastName} ({userData.email})
              </Text>
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.label}>Code:</Text>
              <Text style={styles.titleName}>{data?.code}</Text>
            </View>

            <View style={styles.headerContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.titleName}>{data?.name}</Text>
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.label}>Score:</Text>
              <Text style={styles.titleName}>{scoreTotal} %</Text>
            </View>
          </View>

          <Summary allSections={data?.sections}></Summary>
          <Answer allQuestions={allQuestions}></Answer>
        </View>
      </Page>
    </Document>
  )
}

export default DocumentPdf
