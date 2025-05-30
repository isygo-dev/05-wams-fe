// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CustomRadioIconsData, CustomRadioIconsProps } from 'template-shared/@core/components/custom-radio/types'

// ** Demo Components Imports
import CustomRadioIcons from 'template-shared/@core/components/custom-radio/icons'

interface IconType {
  icon: CustomRadioIconsProps['icon']
  iconProps: CustomRadioIconsProps['iconProps']
}

const data: CustomRadioIconsData[] = [
  {
    value: 'starter',
    title: 'Starter',
    isSelected: true,
    content: 'A simple start for everyone.'
  },
  {
    value: 'standard',
    title: 'Standard',
    content: 'For small to medium businesses.'
  },
  {
    value: 'enterprise',
    title: 'Enterprise',
    content: 'Solution for big organizations.'
  }
]

const icons: IconType[] = [
  { icon: 'tabler:rocket', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } },
  { icon: 'tabler:star', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } },
  { icon: 'tabler:briefcase', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } }
]

const CustomRadioWithIcons = () => {
  const initialSelected: string = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1]
    .value

  // ** State
  const [selected, setSelected] = useState<string>(initialSelected)

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected((prop.target as HTMLInputElement).value)
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomRadioIcons
          key={index}
          data={data[index]}
          selected={selected}
          icon={icons[index].icon}
          name='custom-radios-icons'
          handleChange={handleChange}
          gridProps={{ sm: 4, xs: 12 }}
          iconProps={icons[index].iconProps}
        />
      ))}
    </Grid>
  )
}

export default CustomRadioWithIcons
