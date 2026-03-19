import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('calls the mocked /api/user endpoint and shows the response', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /mocked api/i })
    await user.click(button)

    const response = await screen.findByText(/Jane Doe \(from MSW\)/i)
    expect(response).toBeInTheDocument()
  })

  it('creates a new report via POST /api/reports and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)

    const titleInput = screen.getByLabelText(/new report title/i)
    await user.type(titleInput, 'Report created by user')

    const saveButton = screen.getByRole('button', { name: /save report/i })
    await user.click(saveButton)

    const toast = await screen.findByRole('status')
    expect(toast).toHaveTextContent(/report created successfully/i)

    const searchInput = screen.getByLabelText(/search by title or description/i)
    await user.type(searchInput, 'Report created by user')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    const newReport = await screen.findByText(/Report created by user/i)
    expect(newReport).toBeInTheDocument()
  })
})

