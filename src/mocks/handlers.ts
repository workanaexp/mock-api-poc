import type { RequestHandler } from 'msw'
import { HttpResponse, http } from 'msw'
import { reportHandlers } from './handlers/reports'
import { isMockIdEnabled } from './config'

type TaggedHandler = { id: string; handler: RequestHandler }

const userHandlers: TaggedHandler[] = [
  {
    id: 'user:getUser',
    handler: http.get('/api/user', () => {
      return HttpResponse.json(
        {
          id: 'mock-user-1',
          name: 'Jane Doe (from MSW)',
        },
        { status: 200 },
      )
    }),
  },
]

const allTaggedHandlers: TaggedHandler[] = [...userHandlers, ...reportHandlers]

export const handlers: RequestHandler[] = allTaggedHandlers
  .filter((h) => isMockIdEnabled(h.id))
  .map((h) => h.handler)

