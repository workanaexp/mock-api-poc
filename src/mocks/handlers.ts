import { HttpResponse, http } from 'msw'

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json(
      {
        id: 'mock-user-1',
        name: 'Jane Doe (from MSW)',
      },
      {
        status: 200,
      },
    )
  }),
]

