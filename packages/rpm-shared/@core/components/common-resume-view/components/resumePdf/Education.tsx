/* eslint-disable react/no-array-index-key */

import React from 'react'
import {StyleSheet, Text, View} from '@react-pdf/renderer'

import {ResumeEducation} from 'rpm-shared/@core/types/rpm/ResumeDetails'
import {useTranslation} from 'react-i18next'

type Props = {
    education: ResumeEducation
}
const styles = StyleSheet.create({
    entryContainer: {
        marginTop: 10
    },
    date: {
        fontSize: 11,
        fontFamily: 'Lato Italic'
    },

    headerContainer: {
        flexDirection: 'row',
        marginBottom: 10
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
        fontFamily: 'Lato Bold',
        marginBottom: 5,
        textTransform: 'capitalize'
    },

    subtitle: {
        fontSize: 11,
        fontFamily: 'Lato',
        color: 'black',
        textTransform: 'capitalize'
    },
    itemContent: {
        fontSize: 10,
        fontFamily: 'Lato',
        color: '#a6a6a6'
    }
})

const Education = (props: Props) => {
    const {education} = props
    const {t} = useTranslation()

    return (
        <View style={styles.entryContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.leftColumn}>
                    <Text style={styles.title}>
                        {' '}
                        {education.institution}, {education.fieldOfStudy}{' '}
                    </Text>
                    <Text style={styles.subtitle}>
                        {' '}
                        {t('Resume.Qualification')}: <Text
                        style={styles.itemContent}> {education.qualification} </Text>{' '}
                    </Text>
                </View>
                <View style={styles.rightColumn}>
                    {education.yearOfGraduation ? (
                        <Text style={styles.date}>
                            {' '}
                            {new Date(education.yearOfGraduation).getMonth()} / {new Date(education.yearOfGraduation).getFullYear()}{' '}
                        </Text>
                    ) : null}
                    <Text style={styles.date}>
                        {education.country} - {education.city}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default Education
