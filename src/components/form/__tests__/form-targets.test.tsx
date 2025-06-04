import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormTargets from '../form-targets'
import { vi } from 'vitest'

vi.mock('@heroui/react', () => ({
  Accordion: (props: any) => <div data-testid="accordion">{props.children}</div>,
  AccordionItem: (props: any) => (
    <section data-testid="accordion-item">
      <h3>{props.title}</h3>
      {props.children}
    </section>
  ),
}))

vi.mock('../form-item-basic', () => ({
  default: ({ label, isSelected, onClick }: any) => (
    <li data-testid="form-item-basic" data-selected={isSelected ? 'true' : 'false'} onClick={onClick}>
      {label}
    </li>
  ),
}))

describe('FormTargets', () => {
  const nodeIds = ['n1', 'n2']
  const getNodeTitle = (id: string) => `Node ${id}`
  const getFieldKeys = (id: string) => (id === 'n1' ? ['a', 'b'] : ['c'])
  const getFieldLabel = (nodeId: string, key: string) => `${nodeId}-${key}`
  const isFieldSelected = (nodeId: string, key: string) => nodeId === 'n1' && key === 'b'
  const onFieldSelect = vi.fn()

  it('renders all nodes and fields with correct props', () => {
    render(
      <FormTargets
        nodeIds={nodeIds}
        getNodeTitle={getNodeTitle}
        getFieldKeys={getFieldKeys}
        getFieldLabel={getFieldLabel}
        isFieldSelected={isFieldSelected}
        onFieldSelect={onFieldSelect}
      />
    )
    expect(screen.getAllByTestId('accordion-item')).toHaveLength(2)
    expect(screen.getByText('Node n1')).toBeInTheDocument()
    expect(screen.getByText('Node n2')).toBeInTheDocument()

    expect(screen.getAllByTestId('form-item-basic')).toHaveLength(3)
    expect(screen.getByText('n1-a')).toBeInTheDocument()
    expect(screen.getByText('n1-b')).toBeInTheDocument()
    expect(screen.getByText('n2-c')).toBeInTheDocument()

    expect(screen.getByText('n1-b').closest('li')).toHaveAttribute('data-selected', 'true')
    expect(screen.getByText('n1-a').closest('li')).toHaveAttribute('data-selected', 'false')
    expect(screen.getByText('n2-c').closest('li')).toHaveAttribute('data-selected', 'false')
  })

  it('calls onFieldSelect with correct args when field is clicked', async () => {
    render(
      <FormTargets
        nodeIds={nodeIds}
        getNodeTitle={getNodeTitle}
        getFieldKeys={getFieldKeys}
        getFieldLabel={getFieldLabel}
        isFieldSelected={isFieldSelected}
        onFieldSelect={onFieldSelect}
      />
    )
    await userEvent.click(screen.getByText('n1-a'))
    expect(onFieldSelect).toHaveBeenCalledWith('n1', 'a')
    await userEvent.click(screen.getByText('n2-c'))
    expect(onFieldSelect).toHaveBeenCalledWith('n2', 'c')
  })
})
