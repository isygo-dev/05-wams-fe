import React from 'react'
import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'normal'
  },
  score: {
    width: '70%',
    textAlign: 'left',
    borderRightColor: 'grey',
    paddingLeft: 8,
    paddingRight: 8
  },
  section: {
    width: '30%',
    borderRightColor: 'grey',
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5
  },
  bar: {
    height: 15,
    backgroundColor: '#A72720',
    position: 'relative'
  },
  barText: {
    position: 'absolute',
    top: '10%',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: 'white'
  }
})

const SummaryRow = ({ sections, scores }) => {
  const rows = sections?.map((section, index) => (
    <View style={styles.row} key={index}>
      <Text style={styles.section}>{section}</Text>
      <View style={styles.score}>
        <View style={[styles.bar, { width: `${scores[index]}%` }]}>
          <Text style={styles.barText}>{scores[index]}%</Text>
        </View>
      </View>
    </View>
  ))

  return <>{rows}</>
}

export default SummaryRow
