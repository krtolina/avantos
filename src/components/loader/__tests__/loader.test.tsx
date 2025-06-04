import { render, screen } from '@testing-library/react'
import Loader from '../loader'
import { vi } from 'vitest'

vi.mock('@heroui/react', () => ({
  Spinner: (props: any) => <div data-testid="spinner" data-variant={props.variant} data-size={props.size}></div>,
}))

describe('Loader', () => {
  it('renders a spinner with correct props', () => {
    render(<Loader />)
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveAttribute('data-variant', 'wave')
    expect(spinner).toHaveAttribute('data-size', 'lg')
  })
})
