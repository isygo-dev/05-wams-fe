import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ApexOptions } from 'apexcharts'
import ReactApexcharts from 'template-shared/@core/components/react-apexcharts'
import { useQuery } from 'react-query'
import QuizCandidateApis from 'quiz-shared/@core/api/quiz/candidate'
import { useTranslation } from 'react-i18next'

interface reportProps {
  quizCode: string
  accountCode: string
}

const Summary = (props: reportProps) => {
  const { t } = useTranslation()
  const { quizCode, accountCode } = props
  const { data: quizReport, isLoading } = useQuery(
    ['quizReport', { quizCode, accountCode }],
    () => QuizCandidateApis(t).getQuizReport(quizCode, accountCode),
    {}
  )

  const sections = quizReport?.sectionReports?.map(section => section.name)
  const score = quizReport?.sectionReports?.map(section =>
    section.scale !== 0 ? Math.floor((section.score / section.scale) * 100) : null
  )

  const theme = useTheme()
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '30%',
        horizontal: true
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false }
      },
      padding: {
        top: -10
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#808080',
          fontSize: '15px',
          fontWeight: '700'
        }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      categories: sections,
      labels: {
        style: {
          colors: '#808080',
          fontSize: '15px',
          fontWeight: 'bold'
        }
      },
      max: 100
    },
    tooltip: {
      x: {
        show: false
      },
      custom: function ({ dataPointIndex, w }) {
        const sectionName = w.globals.labels[dataPointIndex]
        const scoreOfSection = quizReport?.sectionReports[dataPointIndex].score
        const scaleOfSection = quizReport?.sectionReports[dataPointIndex].scale

        return `<div><span>${sectionName}: ${scoreOfSection}/${scaleOfSection}</span></div>`
      }
    }
  }

  return !isLoading ? (
    <Card>
      <CardHeader
        title='Result'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        <ReactApexcharts type='bar' height={400} options={options} series={[{ data: score }]} />
      </CardContent>
    </Card>
  ) : null
}

export default Summary
