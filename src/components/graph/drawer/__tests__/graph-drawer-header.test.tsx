import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import GraphDrawerHeader from '../graph-drawer-header'
import { useGraphDrawer } from '../../../../hooks/use-graph-drawer'

vi.mock('../../../../hooks/use-graph-drawer')
vi.mock('@heroui/react', () => ({
  DrawerHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="drawer-header" className={className}>
      {children}
    </div>
  ),
}))

describe('GraphDrawerHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null when selectedNode is not provided', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: null,
      selectedField: null,
    } as any)

    const { container } = render(<GraphDrawerHeader />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render DrawerHeader when selectedNode is provided', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { title: 'Test Node' },
      selectedField: null,
    } as any)

    render(<GraphDrawerHeader />)
    expect(screen.getByTestId('drawer-header')).toBeInTheDocument()
    expect(screen.getByText('Prefill')).toBeInTheDocument()
  })

  it('should show "Prefill fields for" message when selectedField is null', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { title: 'Test Node' },
      selectedField: null,
    } as any)

    render(<GraphDrawerHeader />)
    expect(screen.getByText('Prefill fields for')).toBeInTheDocument()
    expect(screen.getByText('Test Node')).toBeInTheDocument()
    expect(screen.queryByText('Select mapping for')).not.toBeInTheDocument()
  })

  it('should apply the correct class to DrawerHeader', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { title: 'Test Node' },
      selectedField: null,
    } as any)

    render(<GraphDrawerHeader />)
    const header = screen.getByTestId('drawer-header')
    expect(header).toHaveClass('flex flex-col gap-1')
  })

  it('should properly format text with strong elements', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { title: 'Test Node' },
      selectedField: { fieldKey: 'testField' },
    } as any)

    render(<GraphDrawerHeader />)
    const strongElements = screen.getAllByText(/testField|Test Node/)
    expect(strongElements).toHaveLength(2)
    strongElements.forEach((element) => {
      expect(element.tagName).toBe('STRONG')
    })
  })
})
