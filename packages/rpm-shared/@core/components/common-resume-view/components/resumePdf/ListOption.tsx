import React from 'react'
import {StyleSheet, Text, View} from '@react-pdf/renderer'

const ListOption = ({children}) => children

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        marginBottom: 5
    },
    bulletPoint: {
        width: 10,
        fontSize: 10
    },

    itemContentLevel: {
        flex: 1,
        fontSize: 10,
        fontFamily: 'Lato',
        color: '#a6a6a6',
        textAlign: 'left'
    }
})

export const ItemOptions = ({children, level, color}) => (
    <View style={styles.item}>
        {level ? (
            <Text
                style={{
                    flex: 1,
                    fontSize: 10,
                    fontFamily: 'Lato',
                    color: color
                }}
            >
                {children} : <Text style={styles.itemContentLevel}> {level}</Text>
            </Text>
        ) : (
            <Text
                style={{
                    flex: 1,
                    fontSize: 10,
                    fontFamily: 'Lato',
                    color: color
                }}
            >
                {children}{' '}
            </Text>
        )}
    </View>
)

export default ListOption
