import React from 'react'

import {Image, StyleSheet} from '@react-pdf/renderer'

const styles = StyleSheet.create({
    image: {
        textAlign: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        left: 50,
        right: 0,
        width: 100
    }
})
const Footer = () => {
    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image src='/images/pages/qr-code.png' style={styles.image}/>
    )
}

export default Footer
