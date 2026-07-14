import { FileText01, LogOut01 } from './icons.jsx'

export const defaultNavigationPath = '/'
export const implementedNavigationPaths = ['/']

export const primaryNavigationItems = [
  {
    label: 'Invoice Generator',
    href: '/',
    icon: FileText01,
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
