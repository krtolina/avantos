import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import GraphDrawer from '../graph-drawer'
import { useGraphDrawer } from '../../../../hooks/use-graph-drawer'

vi.mock('../../../../hooks/use-graph-drawer')
vi.mock('@heroui/react', () => ({
  Drawer: ({ children, isOpen, onClose, scrollBehavior, size }: any) =>
    isOpen ? (
      <div data-testid="drawer" data-scroll-behavior={scrollBehavior} data-size={size}>
        <button data-testid="close-button" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    ) : null,
  DrawerContent: ({ children }: { children: React.ReactNode }) => <div data-testid="drawer-content">{children}</div>,
}))
vi.mock('../graph-drawer-header', () => ({
  default: () => <div data-testid="graph-drawer-header">Header Component</div>,
}))
vi.mock('../graph-drawer-body', () => ({
  default: () => <div data-testid="graph-drawer-body">Body Component</div>,
}))
vi.mock('../graph-drawer-footer', () => ({
  default: () => <div data-testid="graph-drawer-footer">Footer Component</div>,
}))

describe('GraphDrawer', () => {
  const mockHandleCloseDrawer = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render Drawer when selectedNode is null', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: null,
      handleCloseDrawer: mockHandleCloseDrawer,
    } as any)

    const { container } = render(<GraphDrawer />)
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument()
    expect(container).toBeEmptyDOMElement()
  })

  it('should render Drawer when selectedNode exists', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', title: 'Test Node' },
      handleCloseDrawer: mockHandleCloseDrawer,
    } as any)

    render(<GraphDrawer />)
    expect(screen.getByTestId('drawer')).toBeInTheDocument()
  })

  it('should pass correct props to Drawer component', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', title: 'Test Node' },
      handleCloseDrawer: mockHandleCloseDrawer,
    } as any)

    render(<GraphDrawer />)
    const drawer = screen.getByTestId('drawer')
    expect(drawer).toHaveAttribute('data-scroll-behavior', 'inside')
    expect(drawer).toHaveAttribute('data-size', 'xl')
  })

  it('should render DrawerContent with all drawer components', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', title: 'Test Node' },
      handleCloseDrawer: mockHandleCloseDrawer,
    } as any)

    render(<GraphDrawer />)
    expect(screen.getByTestId('drawer-content')).toBeInTheDocument()
    expect(screen.getByTestId('graph-drawer-header')).toBeInTheDocument()
    expect(screen.getByTestId('graph-drawer-body')).toBeInTheDocument()
    expect(screen.getByTestId('graph-drawer-footer')).toBeInTheDocument()
  })

  it('should call handleCloseDrawer when close button is clicked', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', title: 'Test Node' },
      handleCloseDrawer: mockHandleCloseDrawer,
    } as any)

    render(<GraphDrawer />)
    const closeButton = screen.getByTestId('close-button')
    closeButton.click()
    expect(mockHandleCloseDrawer).toHaveBeenCalledTimes(1)
  })

  it('should handle Boolean conversion for isOpen prop', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: {},
      handleCloseDrawer: mockHandleCloseDrawer,
    } as any)

    render(<GraphDrawer />)
    expect(screen.getByTestId('drawer')).toBeInTheDocument()
  })

  it('should properly use useGraphDrawer hook', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', title: 'Test Node' },
      handleCloseDrawer: mockHandleCloseDrawer,
    } as any)

    render(<GraphDrawer />)
    expect(useGraphDrawer).toHaveBeenCalledTimes(1)
  })
})
