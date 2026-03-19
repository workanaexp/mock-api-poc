import { Collection } from '@msw/data'
import { z } from 'zod'

const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
})

export const reports = new Collection({ schema: reportSchema })

export async function seedReports(): Promise<void> {
  if (reports.count() > 0) return
  await reports.create({
    id: 'r1',
    title: 'Sales Reports - Q1',
    description: 'Summary of sales for the first quarter',
    createdAt: '2025-01-15T10:00:00Z',
  })
  await reports.create({
    id: 'r2',
    title: 'Sales Reports - Q2',
    description: 'Summary of sales for the second quarter',
    createdAt: '2025-04-15T10:00:00Z',
  })
  await reports.create({
    id: 'r3',
    title: 'Internal Audit Reports - Annual',
    description: 'Results of the annual internal audit',
    createdAt: '2025-02-20T14:30:00Z',
  })
  await reports.create({
    id: 'r4',
    title: 'Financial Reports - Balance Sheet and Income Statement',
    description: 'Balance sheet and income statement',
    createdAt: '2025-03-01T09:00:00Z',
  })
}
