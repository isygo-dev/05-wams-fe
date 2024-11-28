// ** Type import
import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'

const Navigation = (): VerticalNavItemsType => {
  return [{
    sectionTitle: 'Apps & Pages'
  },
    {
      icon: 'grommet-icons:integration',
      title: 'Integration order',
      path: '/apps/integration-order',
    },
    {
      title: 'Integration Flow',
      icon: 'simple-icons:googledataflow',
      path: '/apps/integration-flow',
      applicationConnect: "Integration"
    }
  ]
}

export default Navigation
