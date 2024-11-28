import React from 'react'
import {Document, Font, Image, Page, StyleSheet, Text, View} from '@react-pdf/renderer'

import {ResumeTypes} from 'rpm-shared/@core/types/rpm/ResumeTypes'
import rpmApiUrls from "rpm-shared/configs/rpm_apis";
import Skills from './Skills'
import {useTranslation} from 'react-i18next'
import Profil from './Profil'
import Language from './Language'
import Details from './Details'
import Certification from './Certification'
import Title from './Title'
import Footer from './Footer'

const styles = StyleSheet.create({
    page: {
        paddingRight: 20
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        '@media max-width: 400': {
            flexDirection: 'column'
        }
    },
    titleName: {
        fontSize: 12,
        fontFamily: 'Lato Bold',
        textTransform: 'uppercase',
        marginBottom: 5,
        textAlign: 'center',
        color: 'white'
    },
    subtitleName: {
        fontSize: 11,
        fontFamily: 'Lato',
        textTransform: 'capitalize',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 100,
        color: 'white'
    },
    linkColumn: {
        paddingTop: 10
    },
    rightColumnPage: {
        width: '100%'
    },
    link: {
        fontFamily: 'Lato',
        fontSize: 10,
        textDecoration: 'none',
        alignSelf: 'flex-start',
        color: 'white'
    },
    image: {
        borderRadius: '100%',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: 100,
        height: 100
    },
    leftColumn: {
        flexDirection: 'column',
        width: 300,

        backgroundColor: '#222D37'
    },

    padding: {
        paddingLeft: 20,
        paddingRight: 20
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
    data: any
    fileName: File
}

const DocumentPdf = (props: Props) => {
    const {data, fileName} = props

    const resumePdf: ResumeTypes = data
    const {t} = useTranslation()
    const photoFile = fileName

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.container}>
                    <View style={styles.leftColumn}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={
                                photoFile
                                    ? URL.createObjectURL(photoFile)
                                    : `${rpmApiUrls.apiUrl_RPM_Resume_ImageDownload_EndPoint}/${resumePdf?.id}`
                            }
                            style={styles.image}
                        />
                        <Text style={styles.titleName}>
                            {resumePdf.firstName} {resumePdf.lastName}
                        </Text>
                        <Text style={styles.subtitleName}>{resumePdf.title}</Text>
                        <View style={styles.padding}>
                            <Title color='white' titleChildren='Resume.Detail'></Title>
                            <View style={styles.linkColumn}>
                                <Text style={styles.link}>
                                    {t('Email')}: {resumePdf.email}
                                </Text>
                                <Text style={styles.link}>
                                    {t('Phone')}: {resumePdf.phone}
                                </Text>
                            </View>

                            <Profil Address={resumePdf.address}/>
                            {resumePdf.details.languages?.length > 0 ?
                                <Language languages={resumePdf.details.languages}/> : null}
                            {resumePdf.details.skills?.length > 0 ? <Skills skills={resumePdf.details.skills}/> : null}
                            {resumePdf.details.certifications?.length > 0 ? (
                                <Certification certification={resumePdf.details.certifications}/>
                            ) : null}
                        </View>
                    </View>

                    <View style={styles.rightColumnPage}>
                        <Details
                            profExperiences={resumePdf.details.profExperiences}
                            presentation={resumePdf.presentation}
                            educations={resumePdf.details.educations}
                        />
                    </View>

                    <Footer/>
                </View>
            </Page>
        </Document>
    )
}

export default DocumentPdf
