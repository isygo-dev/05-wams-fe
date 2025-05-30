export const CustomCheckboxBasicJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CustomCheckboxBasic from 'template-shared/@core/components/custom-checkbox/basic'

const data = [
  {
    meta: '20%',
    isSelected: true,
    value: 'discount',
    title: 'Discount',
    content: 'Wow! Get 20% off on your next purchase!'
  },
  {
    meta: 'Free',
    value: 'updates',
    title: 'Updates',
    content: 'Get Updates regarding related products.'
  }
]

const BasicCustomCheckbox = () => {
  const initialSelected = data.filter(item => item.isSelected).map(item => item.value)

  // ** State
  const [selected, setSelected] = useState(initialSelected)

  const handleChange = value => {
    if (selected.includes(value)) {
      const updatedArr = selected.filter(item => item !== value)
      setSelected(updatedArr)
    } else {
      setSelected([...selected, value])
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomCheckboxBasic
          key={index}
          data={data[index]}
          selected={selected}
          handleChange={handleChange}
          name='custom-checkbox-basic'
          gridProps={{ sm: 6, xs: 12 }}
        />
      ))}
    </Grid>
  )
}

export default BasicCustomCheckbox
`}</code>
  </pre>
)

export const CustomCheckboxImgJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CustomCheckboxImg from 'template-shared/@core/components/custom-checkbox/image'

const data = [
  {
    value: 'watch',
    isSelected: true,
    img: '/images/pages/custom-checkbox-img-1.png'
  },
  {
    value: 'phone',
    img: '/images/pages/custom-checkbox-img-2.png'
  },
  {
    value: 'laptop',
    img: '/images/pages/custom-checkbox-img-3.png'
  }
]

const CustomCheckboxWithImages = () => {
  const initialSelected = data.filter(item => item.isSelected).map(item => item.value)

  // ** State
  const [selected, setSelected] = useState(initialSelected)

  const handleChange = value => {
    if (selected.includes(value)) {
      const updatedArr = selected.filter(item => item !== value)
      setSelected(updatedArr)
    } else {
      setSelected([...selected, value])
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomCheckboxImg
          key={index}
          data={data[index]}
          selected={selected}
          name='custom-checkbox-img'
          handleChange={handleChange}
          gridProps={{ sm: 4, xs: 12 }}
        />
      ))}
    </Grid>
  )
}

export default CustomCheckboxWithImages
`}</code>
  </pre>
)

export const CustomCheckboxIconsJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CustomCheckboxIcons from 'template-shared/@core/components/custom-checkbox/icons'

const data = [
  {
    value: 'backup',
    title: 'Backup',
    isSelected: true,
    content: 'Backup every file from your project.'
  },
  {
    value: 'encrypt',
    title: 'Encrypt',
    content: 'Translate your data to encrypted text.'
  },
  {
    value: 'site-lock',
    title: 'Site Lock',
    content: 'Security tool to protect your website.'
  }
]

const icons = [
  { icon: 'tabler:folder', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } },
  { icon: 'tabler:ban', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } },
  { icon: 'tabler:lock', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } }
]

const CustomCheckboxWithIcons = () => {
  const initialSelected = data.filter(item => item.isSelected).map(item => item.value)

  // ** State
  const [selected, setSelected] = useState(initialSelected)

  const handleChange = value => {
    if (selected.includes(value)) {
      const updatedArr = selected.filter(item => item !== value)
      setSelected(updatedArr)
    } else {
      setSelected([...selected, value])
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomCheckboxIcons
          key={index}
          data={data[index]}
          selected={selected}
          icon={icons[index].icon}
          handleChange={handleChange}
          name='custom-checkbox-icons'
          gridProps={{ sm: 4, xs: 12 }}
          iconProps={icons[index].iconProps}
        />
      ))}
    </Grid>
  )
}

export default CustomCheckboxWithIcons
`}</code>
  </pre>
)

export const CustomRadioIconsJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CustomRadioIcons from 'template-shared/@core/components/custom-radio/icons'

const data = [
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

const icons = [
  { icon: 'tabler:rocket', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } },
  { icon: 'tabler:star', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } },
  { icon: 'tabler:briefcase', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } }
]

const CustomRadioWithIcons = () => {
  const initialSelected = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1].value

  // ** State
  const [selected, setSelected] = useState(initialSelected)

  const handleChange = prop => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected(prop.target.value)
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
`}</code>
  </pre>
)

export const CustomRadioBasicJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CustomRadioBasic from 'template-shared/@core/components/custom-radio/basic'

const data = [
  {
    meta: 'Free',
    title: 'Basic',
    value: 'basic',
    isSelected: true,
    content: 'Get 1 project with 1 team member.'
  },
  {
    meta: '5.00',
    title: 'Premium',
    value: 'premium',
    content: 'Get 5 projects with 5 team members.'
  }
]

const BasicCustomRadio = () => {
  const initialSelected = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1].value

  // ** State
  const [selected, setSelected] = useState(initialSelected)

  const handleChange = prop => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected(prop.target.value)
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomRadioBasic
          key={index}
          data={data[index]}
          selected={selected}
          name='custom-radios-basic'
          handleChange={handleChange}
          gridProps={{ sm: 6, xs: 12 }}
        />
      ))}
    </Grid>
  )
}

export default BasicCustomRadio
`}</code>
  </pre>
)

export const CustomRadioImgJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CustomRadioImg from 'template-shared/@core/components/custom-radio/image'

const data = [
  {
    value: 'speaker',
    isSelected: true,
    img: '/images/pages/custom-radio-img-1.png'
  },
  {
    value: 'ear-buds',
    img: '/images/pages/custom-radio-img-2.png'
  },
  {
    value: 'headphone',
    img: '/images/pages/custom-radio-img-3.png'
  }
]

const CustomRadioWithImages = () => {
  const initialSelected = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1].value

  // ** State
  const [selected, setSelected] = useState(initialSelected)

  const handleChange = prop => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected(prop.target.value)
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomRadioImg
          key={index}
          data={data[index]}
          selected={selected}
          name='custom-radios-img'
          handleChange={handleChange}
          gridProps={{ sm: 4, xs: 12 }}
        />
      ))}
    </Grid>
  )
}

export default CustomRadioWithImages
`}</code>
  </pre>
)

export const CustomCheckboxBasicTSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CustomCheckboxBasicData } from 'template-shared/@core/components/custom-checkbox/types'

// ** Demo Components Imports
import CustomCheckboxBasic from 'template-shared/@core/components/custom-checkbox/basic'

const data: CustomCheckboxBasicData[] = [
  {
    meta: '20%',
    isSelected: true,
    value: 'discount',
    title: 'Discount',
    content: 'Wow! Get 20% off on your next purchase!'
  },
  {
    meta: 'Free',
    value: 'updates',
    title: 'Updates',
    content: 'Get Updates regarding related products.'
  }
]

const BasicCustomCheckbox = () => {
  const initialSelected: string[] = data.filter(item => item.isSelected).map(item => item.value)

  // ** State
  const [selected, setSelected] = useState<string[]>(initialSelected)

  const handleChange = (value: string) => {
    if (selected.includes(value)) {
      const updatedArr = selected.filter(item => item !== value)
      setSelected(updatedArr)
    } else {
      setSelected([...selected, value])
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomCheckboxBasic
          key={index}
          data={data[index]}
          selected={selected}
          handleChange={handleChange}
          name='custom-checkbox-basic'
          gridProps={{ sm: 6, xs: 12 }}
        />
      ))}
    </Grid>
  )
}

export default BasicCustomCheckbox
`}</code>
  </pre>
)

export const CustomCheckboxIconsTSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CustomCheckboxIconsData, CustomCheckboxIconsProps } from 'template-shared/@core/components/custom-checkbox/types'

// ** Demo Components Imports
import CustomCheckboxIcons from 'template-shared/@core/components/custom-checkbox/icons'

interface IconType {
  CustomCheckboxIconsProps['icon']
  CustomCheckboxIconsProps['iconProps']
}

const data: CustomCheckboxIconsData[] = [
  {
    value: 'backup',
    title: 'Backup',
    isSelected: true,
    content: 'Backup every file from your project.'
  },
  {
    value: 'encrypt',
    title: 'Encrypt',
    content: 'Translate your data to encrypted text.'
  },
  {
    value: 'site-lock',
    title: 'Site Lock',
    content: 'Security tool to protect your website.'
  }
]

const icons: IconType[] = [
  { icon: 'tabler:folder', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } },
  { icon: 'tabler:ban', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } },
  { icon: 'tabler:lock', iconProps: { fontSize: '1.75rem', style: { marginBottom: 8 } } }
]

const CustomCheckboxWithIcons = () => {
  const initialSelected: string[] = data.filter(item => item.isSelected).map(item => item.value)

  // ** State
  const [selected, setSelected] = useState<string[]>(initialSelected)

  const handleChange = (value: string) => {
    if (selected.includes(value)) {
      const updatedArr = selected.filter(item => item !== value)
      setSelected(updatedArr)
    } else {
      setSelected([...selected, value])
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomCheckboxIcons
          key={index}
          data={data[index]}
          selected={selected}
          icon={icons[index].icon}
          handleChange={handleChange}
          name='custom-checkbox-icons'
          gridProps={{ sm: 4, xs: 12 }}
          iconProps={icons[index].iconProps}
        />
      ))}
    </Grid>
  )
}

export default CustomCheckboxWithIcons
`}</code>
  </pre>
)

export const CustomCheckboxImgTSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CustomCheckboxImgData } from 'template-shared/@core/components/custom-checkbox/types'

// ** Demo Components Imports
import CustomCheckboxImg from 'template-shared/@core/components/custom-checkbox/image'

const data: CustomCheckboxImgData[] = [
  {
    value: 'watch',
    isSelected: true,
    img: '/images/pages/custom-checkbox-img-1.png'
  },
  {
    value: 'phone',
    img: '/images/pages/custom-checkbox-img-2.png'
  },
  {
    value: 'laptop',
    img: '/images/pages/custom-checkbox-img-3.png'
  }
]

const CustomCheckboxWithImages = () => {
  const initialSelected: string[] = data.filter(item => item.isSelected).map(item => item.value)

  // ** State
  const [selected, setSelected] = useState<string[]>(initialSelected)

  const handleChange = (value: string) => {
    if (selected.includes(value)) {
      const updatedArr = selected.filter(item => item !== value)
      setSelected(updatedArr)
    } else {
      setSelected([...selected, value])
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomCheckboxImg
          key={index}
          data={data[index]}
          selected={selected}
          name='custom-checkbox-img'
          handleChange={handleChange}
          gridProps={{ sm: 4, xs: 12 }}
        />
      ))}
    </Grid>
  )
}

export default CustomCheckboxWithImages
`}</code>
  </pre>
)

export const CustomRadioIconsTSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CustomRadioIconsData, CustomRadioIconsProps } from 'template-shared/@core/components/custom-radio/types'

// ** Demo Components Imports
import CustomRadioIcons from 'template-shared/@core/components/custom-radio/icons'

interface IconType {
  CustomRadioIconsProps['icon']
  CustomRadioIconsProps['iconProps']
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
`}</code>
  </pre>
)

export const CustomRadioBasicTSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CustomRadioBasicData } from 'template-shared/@core/components/custom-radio/types'

// ** Demo Components Imports
import CustomRadioBasic from 'template-shared/@core/components/custom-radio/basic'

const data: CustomRadioBasicData[] = [
  {
    meta: 'Free',
    title: 'Basic',
    value: 'basic',
    isSelected: true,
    content: 'Get 1 project with 1 team member.'
  },
  {
    meta: '5.00',
    title: 'Premium',
    value: 'premium',
    content: 'Get 5 projects with 5 team members.'
  }
]

const BasicCustomRadio = () => {
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
        <CustomRadioBasic
          key={index}
          data={data[index]}
          selected={selected}
          name='custom-radios-basic'
          handleChange={handleChange}
          gridProps={{ sm: 6, xs: 12 }}
        />
      ))}
    </Grid>
  )
}

export default BasicCustomRadio
`}</code>
  </pre>
)

export const CustomRadioImgTSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CustomRadioImgData } from 'template-shared/@core/components/custom-radio/types'

// ** Demo Components Imports
import CustomRadioImg from 'template-shared/@core/components/custom-radio/image'

const data: CustomRadioImgData[] = [
  {
    value: 'speaker',
    isSelected: true,
    img: '/images/pages/custom-radio-img-1.png'
  },
  {
    value: 'ear-buds',
    img: '/images/pages/custom-radio-img-2.png'
  },
  {
    value: 'headphone',
    img: '/images/pages/custom-radio-img-3.png'
  }
]

const CustomRadioWithImages = () => {
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
        <CustomRadioImg
          key={index}
          data={data[index]}
          selected={selected}
          name='custom-radios-img'
          handleChange={handleChange}
          gridProps={{ sm: 4, xs: 12 }}
        />
      ))}
    </Grid>
  )
}

export default CustomRadioWithImages
`}</code>
  </pre>
)
