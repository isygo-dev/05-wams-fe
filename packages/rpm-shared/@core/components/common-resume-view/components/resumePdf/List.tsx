import React from 'react'
import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginBottom: 5
  },
  bulletPoint: {
    width: 10,
    fontSize: 10
  },
  itemContent: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Lato',
    marginBottom: 3,
    color: '#656565'
  }
})

const List = ({ children }) => children

export const Item = ({ children }) => (
  <View style={styles.item}>
    {/*<Text style={styles.bulletPoint}>•</Text>*/}
    <Text style={styles.itemContent}>{children}</Text>
  </View>
)

export default List
