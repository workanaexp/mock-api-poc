export const userMockConfig = {
  getUser: true,
} as const

export type UserEndpointId = keyof typeof userMockConfig

