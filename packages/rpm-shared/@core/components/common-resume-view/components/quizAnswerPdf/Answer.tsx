import React from 'react'
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import { QuestionDetailsType } from 'quiz-shared/@core/types/quiz/quizCandidateType'
import quizApiUrls from 'quiz-shared/configs/quiz_apis'

const styles = StyleSheet.create({
  container: {
    fontSize: 11,
    marginTop: 10
  },
  questionDetailsContainer: {
    display: 'flex',
    padding: 10,
    marginTop: 15,
    marginBottom: 5,
    border: '1px solid grey'
  },
  label: {
    marginRight: 5,
    color: 'black'
  },
  titleName: {
    fontSize: 14,
    fontFamily: 'Lato Bold',
    color: 'black'
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 3
  },
  answerContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
    fontSize: 14,
    paddingLeft: 8
  },
  answerArgContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 5
  },
  redText: {
    color: 'red'
  },
  greenText: {
    color: 'green'
  },

  image: {
    alt: 'resume image',
    marginTop: 20,
    width: '100%',
    height: 'auto',
    alignSelf: 'center'
  }
})

type Props = {
  allQuestions: QuestionDetailsType[]
}
const Answer = (props: Props) => {
  const { allQuestions } = props

  return (
    <View style={styles.container}>
      {allQuestions &&
        allQuestions.length > 0 &&
        allQuestions.map((question, i) => (
          <View key={i}>
            <View style={styles.questionDetailsContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.label}>Question {i + 1}</Text>
                <Text style={styles.label}>({question.type}) : </Text>
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.titleName}>{question.question}</Text>
              </View>
              <View style={styles.titleContainer}>
                {question.imagePath ? (
                  <Image
                    src={`${quizApiUrls.apiUrl_QUIZ_Question_ImageDownload_EndPoint}/${question?.id}`}
                    style={styles.image}
                  />
                ) : null}
              </View>
            </View>

            <View style={[styles.answerContainer, question.score >= 1 ? styles.greenText : styles.redText]}>
              {question.type === 'TAQ' || question.type === 'CODE' ? (
                <Text>{question.textAnswer}</Text>
              ) : (
                question.options.map((option, i) =>
                  option.checked ? (
                    <View key={i}>
                      <Text>{option.option}</Text>
                      {option.textAnswer !== '' ? (
                        <View style={styles.answerArgContainer}>
                          <Text>Text answer: </Text>
                          <Text>{option.textAnswer}</Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null
                )
              )}
            </View>
          </View>
        ))}
    </View>
  )
}

export default Answer
