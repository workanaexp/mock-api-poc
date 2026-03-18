export const reportsMockConfig = {
  list: true,
  detail: true,
  create: true,
} as const

export type ReportsEndpointId = keyof typeof reportsMockConfig

