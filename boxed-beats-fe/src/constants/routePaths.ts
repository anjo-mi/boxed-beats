export const routePaths = {
  home: '/',
  account: '/account',
  checkout: '/checkout',

  admin: '/admin',
  adminBeats: '/admin/beats',
  adminBeatNew: '/admin/beats/new',
  adminBeatEdit: (id: string) => `/admin/beats/${id}/edit`,
  adminUsers: '/admin/users',
  adminContracts: '/admin/contracts',
  adminContractNew: '/admin/contracts/new',
  adminContractEdit: (id: string) => `/admin/contracts/${id}/edit`,
} as const
