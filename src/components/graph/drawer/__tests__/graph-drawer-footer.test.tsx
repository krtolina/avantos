import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GraphDrawerFooter from '../graph-drawer-footer'
import { useGraphDrawer } from '../../../../hooks/use-graph-drawer'

vi.mock('../../../../hooks/use-graph-drawer')
vi.mock('@heroui/react', () => ({
  Button: ({ children, onPress, isDisabled, color, variant }: any) => (
    <button data-testid={`button-${color}-${variant || 'default'}`} onClick={onPress} disabled={isDisabled}>
      {children}
    </button>
  ),
  DrawerFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="drawer-footer">{children}</div>,
}))

describe('GraphDrawerFooter', () => {
  const mockHandleCloseDrawer = vi.fn()
  const mockHandleRemoveFieldSelection = vi.fn()
  const mockHandleAddMapping = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render DrawerFooter component', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedField: null,
      selectedMapping: null,
      handleCloseDrawer: mockHandleCloseDrawer,
      handleRemoveFieldSelection: mockHandleRemoveFieldSelection,
      handleAddMapping: mockHandleAddMapping,
    } as any)

    render(<GraphDrawerFooter />)
    expect(screen.getByTestId('drawer-footer')).toBeInTheDocument()
  })

  it('should render Close button when selectedField is falsy', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedField: null,
      selectedMapping: null,
      handleCloseDrawer: mockHandleCloseDrawer,
      handleRemoveFieldSelection: mockHandleRemoveFieldSelection,
      handleAddMapping: mockHandleAddMapping,
    } as any)

    render(<GraphDrawerFooter />)

    const closeButton = screen.getByText('Close')
    expect(closeButton).toBeInTheDocument()
    expect(screen.queryByText('Back')).not.toBeInTheDocument()
    expect(screen.queryByText('Select')).not.toBeInTheDocument()
  })

  it('should render Back and Select buttons when selectedField is truthy', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedField: { id: 'field1' },
      selectedMapping: null,
      handleCloseDrawer: mockHandleCloseDrawer,
      handleRemoveFieldSelection: mockHandleRemoveFieldSelection,
      handleAddMapping: mockHandleAddMapping,
    } as any)

    render(<GraphDrawerFooter />)

    const backButton = screen.getByText('Back')
    const selectButton = screen.getByText('Select')
    expect(backButton).toBeInTheDocument()
    expect(selectButton).toBeInTheDocument()
    expect(screen.queryByText('Close')).not.toBeInTheDocument()
  })

  it('should disable Select button when selectedMapping is falsy', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedField: { id: 'field1' },
      selectedMapping: null,
      handleCloseDrawer: mockHandleCloseDrawer,
      handleRemoveFieldSelection: mockHandleRemoveFieldSelection,
      handleAddMapping: mockHandleAddMapping,
    } as any)

    render(<GraphDrawerFooter />)

    const selectButton = screen.getByText('Select')
    expect(selectButton).toBeDisabled()
  })

  it('should enable Select button when selectedMapping is truthy', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedField: { id: 'field1' },
      selectedMapping: { id: 'mapping1' },
      handleCloseDrawer: mockHandleCloseDrawer,
      handleRemoveFieldSelection: mockHandleRemoveFieldSelection,
      handleAddMapping: mockHandleAddMapping,
    } as any)

    render(<GraphDrawerFooter />)

    const selectButton = screen.getByText('Select')
    expect(selectButton).not.toBeDisabled()
  })

  it('should call handleCloseDrawer when Close button is clicked', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedField: null,
      selectedMapping: null,
      handleCloseDrawer: mockHandleCloseDrawer,
      handleRemoveFieldSelection: mockHandleRemoveFieldSelection,
      handleAddMapping: mockHandleAddMapping,
    } as any)

    render(<GraphDrawerFooter />)

    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    expect(mockHandleCloseDrawer).toHaveBeenCalledTimes(1)
  })

  it('should call handleRemoveFieldSelection when Back button is clicked', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedField: { id: 'field1' },
      selectedMapping: null,
      handleCloseDrawer: mockHandleCloseDrawer,
      handleRemoveFieldSelection: mockHandleRemoveFieldSelection,
      handleAddMapping: mockHandleAddMapping,
    } as any)

    render(<GraphDrawerFooter />)

    const backButton = screen.getByText('Back')
    fireEvent.click(backButton)
    expect(mockHandleRemoveFieldSelection).toHaveBeenCalledTimes(1)
  })

  it('should call handleAddMapping when Select button is clicked', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedField: { id: 'field1' },
      selectedMapping: { id: 'mapping1' },
      handleCloseDrawer: mockHandleCloseDrawer,
      handleRemoveFieldSelection: mockHandleRemoveFieldSelection,
      handleAddMapping: mockHandleAddMapping,
    } as any)

    render(<GraphDrawerFooter />)

    const selectButton = screen.getByText('Select')
    fireEvent.click(selectButton)
    expect(mockHandleAddMapping).toHaveBeenCalledTimes(1)
  })
})
