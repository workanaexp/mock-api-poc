import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
})

