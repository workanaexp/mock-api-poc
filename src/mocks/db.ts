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
    title: 'Relatório de vendas Q1',
    description: 'Resumo das vendas do primeiro trimestre',
    createdAt: '2025-01-15T10:00:00Z',
  })
  await reports.create({
    id: 'r2',
    title: 'Relatório de vendas Q2',
    description: 'Resumo das vendas do segundo trimestre',
    createdAt: '2025-04-15T10:00:00Z',
  })
  await reports.create({
    id: 'r3',
    title: 'Auditoria interna',
    description: 'Resultados da auditoria interna anual',
    createdAt: '2025-02-20T14:30:00Z',
  })
  await reports.create({
    id: 'r4',
    title: 'Relatório financeiro',
    description: 'Balanço e demonstração de resultados',
    createdAt: '2025-03-01T09:00:00Z',
  })
}
