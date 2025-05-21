import React from 'react'
import {StyleSheet, Text, View} from '@react-pdf/renderer'

import SummaryRow from './SummaryRow'
import {sectionDetailsType} from 'quiz-shared/@core/types/quiz/quizCandidateType'

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: 'grey'
    },
    container: {
        marginTop: 10,
        flexDirection: 'row',
        borderBottomColor: 'grey',
        backgroundColor: 'white',
        color: 'black',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'normal',
        flexGrow: 1
    },
    score: {
        width: '70%',
        borderRightColor: 'grey'
    },
    section: {
        width: '30%',
        borderRightColor: 'grey',
        borderRightWidth: 1
    }
})

type Props = {
    allSections: sectionDetailsType[]
}

const Summary = (props: Props) => {
    const {allSections} = props

    const sections = allSections?.map(section => section.name)
    const scores = allSections?.map(section =>
        section.questions?.length !== 0 ? Math.floor((section.score / section.questions?.length) * 100) : null
    )

    return (
        <View style={styles.tableContainer}>
            <View style={styles.container}>
                <Text style={styles.section}>Section</Text>
                <Text style={styles.score}>Score</Text>
            </View>
            <SummaryRow sections={sections} scores={scores}></SummaryRow>
        </View>
    )
}

export default Summary
