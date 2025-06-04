import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormItemActive from '../form-item-active'
import { vi } from 'vitest'

vi.mock('@heroui/react', () => ({
  Button: (props: any) => (
    <button
      data-testid="remove-btn"
      onClick={props.onPress}
      data-size={props.size}
      data-variant={props.variant}
      data-color={props.color}
      data-isicononly={props.isIconOnly ? 'true' : 'false'}
    >
      {props.children}
    </button>
  ),
}))
vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="icon-x" {...props} />,
}))

describe('FormItemActive', () => {
  it('renders label and button with icon', () => {
    render(<FormItemActive label="Active Field" />)
    expect(screen.getByText('Active Field')).toBeInTheDocument()
    const btn = screen.getByTestId('remove-btn')
    expect(btn).toHaveAttribute('data-size', 'sm')
    expect(btn).toHaveAttribute('data-variant', 'light')
    expect(btn).toHaveAttribute('data-color', 'danger')
    expect(btn).toHaveAttribute('data-isicononly', 'true')
    expect(screen.getByTestId('icon-x')).toBeInTheDocument()
  })

  it('calls onRemove when button is clicked', async () => {
    const onRemove = vi.fn()
    render(<FormItemActive label="Active Field" onRemove={onRemove} />)
    await userEvent.click(screen.getByTestId('remove-btn'))
    expect(onRemove).toHaveBeenCalled()
  })
})
