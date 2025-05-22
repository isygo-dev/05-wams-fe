import React from 'react'
import { StyleSheet, Text, View } from '@react-pdf/renderer'

import Title from './Title'
import { AddressTypes } from 'ims-shared/@core/types/ims/addressTypes'

const styles = StyleSheet.create({
  itemContentLevel: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Lato',
    color: 'white',
    textAlign: 'left'
  }
})

interface AddressTypesProps {
  Address: AddressTypes
}

const Profil = (props: AddressTypesProps) => {
  const { Address } = props

  return (
    <View>
      {Address.id ? (
        <>
          <Title color='white' titleChildren='Adresse'></Title>

          <Text style={{ display: 'flex' }}>
            {Address.street ? <Text style={styles.itemContentLevel}> {Address.street}/</Text> : null}

            {Address.zipCode ? <Text style={styles.itemContentLevel}> {Address.zipCode}/ </Text> : null}

            {Address.state ? <Text style={styles.itemContentLevel}> {Address.state}/ </Text> : null}

            {Address.city ? <Text style={styles.itemContentLevel}> {Address.city}/ </Text> : null}

            {Address.country ? <Text style={styles.itemContentLevel}> {Address.country} </Text> : null}
          </Text>
        </>
      ) : null}
    </View>
  )
}

export default Profil
