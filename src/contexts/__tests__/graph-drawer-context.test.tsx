import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useContext } from 'react'
import { GraphDrawerProvider, GraphDrawerContext } from '../graph-drawer-context'

vi.mock('../../utils/graph-utils', () => ({
  getNodeMap: (nodes: any) => Object.fromEntries(nodes.map((n: any) => [n.id, n])),
  getCanvasNodes: (nodes: any) => nodes.map((n: any) => ({ ...n, canvas: true })),
  getCanvasEdges: (edges: any) => edges.map((e: any) => ({ ...e, canvas: true })),
}))

const mockNodes = [{ id: 'n1', title: 'Node 1', fields: [], isGlobal: false }]
const mockGlobalNodes = [{ id: 'g1', title: 'Global 1', fields: [], isGlobal: true }]
const mockEdges = [{ source: 'n1', target: 'g1' }]

vi.mock('../../api/blueprint-graph', () => ({
  useReadGraphNodes: () => ({ data: mockNodes, isLoading: false }),
  useReadGlobalNodes: () => ({ data: mockGlobalNodes, isLoading: false }),
  useReadGraphEdges: () => ({ data: mockEdges, isLoading: false }),
}))

function Consumer() {
  const ctx = useContext(GraphDrawerContext)
  if (!ctx) return null
  return (
    <div>
      <span data-testid="isLoading">{String(ctx.isLoading)}</span>
      <span data-testid="nodeMap">{Object.keys(ctx.nodeMap ?? {}).join(',')}</span>
      <span data-testid="canvasNodes">{ctx.canvasNodes?.length}</span>
      <span data-testid="canvasEdges">{ctx.canvasEdges?.length}</span>
      <span data-testid="selectedNode">{ctx.selectedNode?.id ?? ''}</span>
      <span data-testid="selectedField">{ctx.selectedField?.fieldKey ?? ''}</span>
      <span data-testid="selectedMapping">{ctx.selectedMapping?.fieldKey ?? ''}</span>
      <span data-testid="mappings">{ctx.mappings.length}</span>
      <button onClick={() => ctx.setSelectedNode?.({ id: 'n1', title: 'Node 1', fields: [], isGlobal: false })}>
        setNode
      </button>
      <button onClick={() => ctx.handleOpenDrawer?.('g1')}>openDrawer</button>
      <button onClick={() => ctx.handleCloseDrawer?.()}>closeDrawer</button>
      <button onClick={() => ctx.handleFieldSelect?.({ nodeId: 'n1', fieldKey: 'f1' })}>selectField</button>
      <button onClick={() => ctx.handleRemoveFieldSelection?.()}>removeFieldSelection</button>
      <button onClick={() => ctx.handleMappingSelect?.({ nodeId: 'g1', fieldKey: 'f2' })}>selectMapping</button>
      <button onClick={() => ctx.handleRemoveMappingSelection?.()}>removeMappingSelection</button>
      <button onClick={() => ctx.handleAddMapping?.()}>addMapping</button>
      <button onClick={() => ctx.handleRemoveMapping?.({ nodeId: 'n1', fieldKey: 'f1' })}>removeMapping</button>
    </div>
  )
}

describe('GraphDrawerProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides context values and computed data', () => {
    render(
      <GraphDrawerProvider>
        <Consumer />
      </GraphDrawerProvider>
    )
    expect(screen.getByTestId('isLoading').textContent).toBe('false')
    expect(screen.getByTestId('nodeMap').textContent).toContain('n1,g1')
    expect(screen.getByTestId('canvasNodes').textContent).toBe('2')
    expect(screen.getByTestId('canvasEdges').textContent).toBe('1')
  })

  it('can set and clear selectedNode via context', () => {
    render(
      <GraphDrawerProvider>
        <Consumer />
      </GraphDrawerProvider>
    )
    const setNodeBtn = screen.getByText('setNode')
    act(() => setNodeBtn.click())
    expect(screen.getByTestId('selectedNode').textContent).toBe('n1')

    const openDrawerBtn = screen.getByText('openDrawer')
    act(() => openDrawerBtn.click())
    expect(screen.getByTestId('selectedNode').textContent).toBe('g1')

    const closeDrawerBtn = screen.getByText('closeDrawer')
    act(() => closeDrawerBtn.click())
    expect(screen.getByTestId('selectedNode').textContent).toBe('')
  })

  it('can select and remove fields and mappings', () => {
    render(
      <GraphDrawerProvider>
        <Consumer />
      </GraphDrawerProvider>
    )
    const selectFieldBtn = screen.getByText('selectField')
    act(() => selectFieldBtn.click())
    expect(screen.getByTestId('selectedField').textContent).toBe('f1')

    const removeFieldBtn = screen.getByText('removeFieldSelection')
    act(() => removeFieldBtn.click())
    expect(screen.getByTestId('selectedField').textContent).toBe('')
    expect(screen.getByTestId('selectedMapping').textContent).toBe('')

    const selectMappingBtn = screen.getByText('selectMapping')
    act(() => selectMappingBtn.click())
    expect(screen.getByTestId('selectedMapping').textContent).toBe('f2')

    const removeMappingBtn = screen.getByText('removeMappingSelection')
    act(() => removeMappingBtn.click())
    expect(screen.getByTestId('selectedMapping').textContent).toBe('')
  })

  it('can add and remove mappings', () => {
    render(
      <GraphDrawerProvider>
        <Consumer />
      </GraphDrawerProvider>
    )
    act(() => screen.getByText('selectField').click())
    act(() => screen.getByText('selectMapping').click())

    act(() => screen.getByText('addMapping').click())
    expect(screen.getByTestId('mappings').textContent).toBe('1')

    act(() => screen.getByText('removeMapping').click())
    expect(screen.getByTestId('mappings').textContent).toBe('0')
  })
})
