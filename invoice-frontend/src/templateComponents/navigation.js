import { CloudUpload, FileText01, LogOut01 } from './icons.jsx'

export const defaultNavigationPath = '/'
export const implementedNavigationPaths = ['/', '/si-xml-converter']

export const primaryNavigationItems = [
  {
    label: 'Invoice Generator',
    href: '/',
    icon: FileText01,
  },
  {
    label: 'Excel Convert XML',
    href: '/si-xml-converter',
    icon: CloudUpload,
  },
]

export const secondaryNavigationItems = [
  {
    label: 'Back Pilargroup',
    href: 'https://pilargroup.id',
    icon: LogOut01,
    iconFlip: true,
    external: true,
  },
]
