import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import GraphCanvas from '../graph-canvas'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'

vi.mock('../../../hooks/use-graph-drawer')
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, onNodeClick, nodes, edges, colorMode, fitView }: any) => (
    <div
      data-testid="react-flow"
      data-nodes={JSON.stringify(nodes)}
      data-edges={JSON.stringify(edges)}
      data-color-mode={colorMode}
      data-fit-view={fitView ? 'true' : 'false'}
    >
      {children}
      <button data-testid="node-click-trigger" onClick={() => onNodeClick(null, { id: 'test-node-id' })}>
        Trigger Node Click
      </button>
    </div>
  ),
  Background: () => <div data-testid="flow-background">Background</div>,
}))
vi.mock('../../loader/loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))
vi.mock('../drawer/graph-drawer', () => ({
  default: () => <div data-testid="graph-drawer">Graph Drawer</div>,
}))

describe('GraphCanvas', () => {
  const mockHandleOpenDrawer = vi.fn()
  const mockCanvasNodes = [{ id: 'node1', position: { x: 0, y: 0 } }]
  const mockCanvasEdges = [{ id: 'edge1', source: 'node1', target: 'node2' }]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render Loader when isLoading is true', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      isLoading: true,
      canvasNodes: [],
      canvasEdges: [],
      handleOpenDrawer: mockHandleOpenDrawer,
    } as any)

    render(<GraphCanvas />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.queryByTestId('react-flow')).not.toBeInTheDocument()
    expect(screen.queryByTestId('graph-drawer')).not.toBeInTheDocument()
  })

  it('should render ReactFlow and GraphDrawer when isLoading is false', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      isLoading: false,
      canvasNodes: mockCanvasNodes,
      canvasEdges: mockCanvasEdges,
      handleOpenDrawer: mockHandleOpenDrawer,
    } as any)

    render(<GraphCanvas />)

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    expect(screen.getByTestId('react-flow')).toBeInTheDocument()
    expect(screen.getByTestId('graph-drawer')).toBeInTheDocument()
  })

  it('should pass correct props to ReactFlow', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      isLoading: false,
      canvasNodes: mockCanvasNodes,
      canvasEdges: mockCanvasEdges,
      handleOpenDrawer: mockHandleOpenDrawer,
    } as any)

    render(<GraphCanvas />)

    const reactFlow = screen.getByTestId('react-flow')
    expect(reactFlow).toHaveAttribute('data-nodes', JSON.stringify(mockCanvasNodes))
    expect(reactFlow).toHaveAttribute('data-edges', JSON.stringify(mockCanvasEdges))
    expect(reactFlow).toHaveAttribute('data-color-mode', 'dark')
    expect(reactFlow).toHaveAttribute('data-fit-view', 'true')
  })

  it('should render Background component inside ReactFlow', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      isLoading: false,
      canvasNodes: mockCanvasNodes,
      canvasEdges: mockCanvasEdges,
      handleOpenDrawer: mockHandleOpenDrawer,
    } as any)

    render(<GraphCanvas />)

    expect(screen.getByTestId('flow-background')).toBeInTheDocument()
  })

  it('should call handleOpenDrawer with node id when a node is clicked', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      isLoading: false,
      canvasNodes: mockCanvasNodes,
      canvasEdges: mockCanvasEdges,
      handleOpenDrawer: mockHandleOpenDrawer,
    } as any)

    render(<GraphCanvas />)

    const nodeClickTrigger = screen.getByTestId('node-click-trigger')
    nodeClickTrigger.click()

    expect(mockHandleOpenDrawer).toHaveBeenCalledTimes(1)
    expect(mockHandleOpenDrawer).toHaveBeenCalledWith('test-node-id')
  })

  it('should render correct components in the expected order', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      isLoading: false,
      canvasNodes: mockCanvasNodes,
      canvasEdges: mockCanvasEdges,
      handleOpenDrawer: mockHandleOpenDrawer,
    } as any)

    render(<GraphCanvas />)

    const reactFlow = screen.getByTestId('react-flow')
    const graphDrawer = screen.getByTestId('graph-drawer')

    expect(reactFlow.parentElement).toBe(graphDrawer.parentElement)
  })

  it('should handle empty nodes and edges arrays', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      isLoading: false,
      canvasNodes: [],
      canvasEdges: [],
      handleOpenDrawer: mockHandleOpenDrawer,
    } as any)

    render(<GraphCanvas />)

    const reactFlow = screen.getByTestId('react-flow')
    expect(reactFlow).toHaveAttribute('data-nodes', '[]')
    expect(reactFlow).toHaveAttribute('data-edges', '[]')
  })

  it('should properly use useGraphDrawer hook', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      isLoading: false,
      canvasNodes: mockCanvasNodes,
      canvasEdges: mockCanvasEdges,
      handleOpenDrawer: mockHandleOpenDrawer,
    } as any)

    render(<GraphCanvas />)

    expect(useGraphDrawer).toHaveBeenCalledTimes(1)
  })
})
