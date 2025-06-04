import { render, screen, fireEvent } from '@testing-library/react'
import FormFields from '../form-fields'
import { vi } from 'vitest'

vi.mock('../form-item-active', () => ({
  default: ({ label, onRemove }: any) => (
    <li data-testid="active" onClick={onRemove}>
      {label}
    </li>
  ),
}))
vi.mock('../form-item-basic', () => ({
  default: ({ label, onClick }: any) => (
    <li data-testid="basic" onClick={onClick}>
      {label}
    </li>
  ),
}))

describe('FormFields', () => {
  const fieldKeys = ['a', 'b', 'c']
  const isFieldActive = (key: string) => key === 'b'
  const getActiveLabel = (key: string) => `Active ${key}`
  const getBasicLabel = (key: string) => `Basic ${key}`
  const onRemove = vi.fn()
  const onSelect = vi.fn()

  it('renders active and basic fields correctly', () => {
    render(
      <FormFields
        fieldKeys={fieldKeys}
        isFieldActive={isFieldActive}
        getActiveLabel={getActiveLabel}
        getBasicLabel={getBasicLabel}
        onRemove={onRemove}
        onSelect={onSelect}
      />
    )
    expect(screen.getAllByTestId('active')).toHaveLength(1)
    expect(screen.getAllByTestId('basic')).toHaveLength(2)
    expect(screen.getByText('Active b')).toBeInTheDocument()
    expect(screen.getByText('Basic a')).toBeInTheDocument()
    expect(screen.getByText('Basic c')).toBeInTheDocument()
  })

  it('calls onRemove when active item is clicked', () => {
    render(
      <FormFields
        fieldKeys={fieldKeys}
        isFieldActive={isFieldActive}
        getActiveLabel={getActiveLabel}
        getBasicLabel={getBasicLabel}
        onRemove={onRemove}
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByText('Active b'))
    expect(onRemove).toHaveBeenCalledWith('b')
  })

  it('calls onSelect when basic item is clicked', () => {
    render(
      <FormFields
        fieldKeys={fieldKeys}
        isFieldActive={isFieldActive}
        getActiveLabel={getActiveLabel}
        getBasicLabel={getBasicLabel}
        onRemove={onRemove}
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByText('Basic a'))
    expect(onSelect).toHaveBeenCalledWith('a')
    fireEvent.click(screen.getByText('Basic c'))
    expect(onSelect).toHaveBeenCalledWith('c')
  })
})
