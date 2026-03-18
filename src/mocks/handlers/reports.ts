import type { RequestHandler } from 'msw'
import { HttpResponse, http } from 'msw'
import { reports, seedReports } from '../db'

export type ReportHandlerId = 'reports:list' | 'reports:detail' | 'reports:create'

export type TaggedReportHandler = {
  id: ReportHandlerId
  handler: RequestHandler
}

export const reportHandlers: TaggedReportHandler[] = [
  {
    id: 'reports:list',
    handler: http.get('/api/reports', async ({ request }) => {
      await seedReports()
      const url = new URL(request.url)
      const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()

      const list = search
        ? reports.findMany((q) =>
            q.where((record) =>
              record.title.toLowerCase().includes(search) ||
              record.description.toLowerCase().includes(search),
            ),
          )
        : reports.findMany()

      return HttpResponse.json(list, { status: 200 })
    }),
  },
  {
    id: 'reports:detail',
    handler: http.get('/api/reports/:id', async ({ params }) => {
      await seedReports()
      const report = reports.findFirst((q) => q.where({ id: params.id }))
      if (!report) {
        return HttpResponse.json(
          { message: 'Report not found' },
          { status: 404 },
        )
      }
      return HttpResponse.json(report, { status: 200 })
    }),
  },
  {
    id: 'reports:create',
    handler: http.post('/api/reports', async ({ request }) => {
      const body = (await request.json()) as {
        title: string
        description?: string
      }
      const report = await reports.create({
        id: `r-${Date.now()}`,
        title: body.title,
        description: body.description ?? '',
        createdAt: new Date().toISOString(),
      })
      return HttpResponse.json(report, { status: 201 })
    }),
  },
]
