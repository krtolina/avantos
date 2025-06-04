import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import GraphDrawerBody from '../graph-drawer-body'
import { useGraphDrawer } from '../../../../hooks/use-graph-drawer'

vi.mock('../../../../hooks/use-graph-drawer')
vi.mock('../graph-drawer-targets', () => ({
  default: () => <div data-testid="graph-drawer-targets">Targets Component</div>,
}))
vi.mock('../graph-drawer-fields', () => ({
  default: () => <div data-testid="graph-drawer-fields">Fields Component</div>,
}))
vi.mock('@heroui/react', () => ({
  DrawerBody: ({ children }: { children: React.ReactNode }) => <div data-testid="drawer-body">{children}</div>,
}))

describe('GraphDrawerBody', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render DrawerBody component', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({ selectedField: null } as any)
    render(<GraphDrawerBody />)
    expect(screen.getByTestId('drawer-body')).toBeInTheDocument()
  })

  it('should render GraphDrawerFields when selectedField is falsy', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({ selectedField: null } as any)
    render(<GraphDrawerBody />)
    expect(screen.getByTestId('graph-drawer-fields')).toBeInTheDocument()
    expect(screen.queryByTestId('graph-drawer-targets')).not.toBeInTheDocument()
  })

  it('should render GraphDrawerTargets when selectedField is truthy', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({ selectedField: { id: 'field1' } } as any)
    render(<GraphDrawerBody />)
    expect(screen.getByTestId('graph-drawer-targets')).toBeInTheDocument()
    expect(screen.queryByTestId('graph-drawer-fields')).not.toBeInTheDocument()
  })

  it('should pass the correct hook data to child components', () => {
    const mockHookData = { selectedField: { id: 'field1' }, otherProp: 'value' }
    vi.mocked(useGraphDrawer).mockReturnValue(mockHookData as any)
    render(<GraphDrawerBody />)
    expect(useGraphDrawer).toHaveBeenCalledTimes(1)
  })
})
