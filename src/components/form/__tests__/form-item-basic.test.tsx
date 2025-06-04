import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormItemBasic from '../form-item-basic'
import { vi } from 'vitest'

vi.mock('@heroui/react', () => ({
  Button: (props: any) => (
    <button data-testid="basic-btn" data-variant={props.variant} className={props.className} onClick={props.onPress}>
      {props.startContent}
      {props.children}
    </button>
  ),
}))
vi.mock('lucide-react', () => ({
  Database: (props: any) => <svg data-testid="icon-database" {...props} />,
}))

describe('FormItemBasic', () => {
  it('renders label and icon', () => {
    render(<FormItemBasic label="Basic Field" />)
    expect(screen.getByText('Basic Field')).toBeInTheDocument()
    expect(screen.getByTestId('icon-database')).toBeInTheDocument()
  })

  it('uses solid variant when selected', () => {
    render(<FormItemBasic label="Selected Field" isSelected />)
    expect(screen.getByTestId('basic-btn')).toHaveAttribute('data-variant', 'solid')
  })

  it('uses flat variant when not selected', () => {
    render(<FormItemBasic label="Not Selected Field" />)
    expect(screen.getByTestId('basic-btn')).toHaveAttribute('data-variant', 'flat')
  })

  it('calls onClick when button is pressed', async () => {
    const onClick = vi.fn()
    render(<FormItemBasic label="Clickable Field" onClick={onClick} />)
    await userEvent.click(screen.getByTestId('basic-btn'))
    expect(onClick).toHaveBeenCalled()
  })
})
