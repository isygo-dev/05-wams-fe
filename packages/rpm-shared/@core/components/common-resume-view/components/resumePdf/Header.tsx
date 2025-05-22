import React from 'react'

import { Image, StyleSheet, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    alignItems: 'stretch'
  },
  detailColumn: {
    flexDirection: 'column',
    flexGrow: 9,
    textTransform: 'uppercase'
  },
  linkColumn: {
    flexDirection: 'column',
    flexGrow: 2,
    alignSelf: 'flex-end',
    justifySelf: 'flex-end'
  },

  link: {
    fontFamily: 'Lato',
    fontSize: 10,
    color: 'black',
    textDecoration: 'none',
    alignSelf: 'flex-end',
    justifySelf: 'flex-end'
  },
  image: {
    width: '100px'
  }
})
const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.detailColumn}>
        <Image src='/images/apple-touch-icon.png' style={styles.image} />
      </View>
    </View>
  )
}

export default Header
