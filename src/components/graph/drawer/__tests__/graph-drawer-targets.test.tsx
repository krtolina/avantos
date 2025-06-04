import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GraphDrawerTargets from '../graph-drawer-targets'
import { useGraphDrawer } from '../../../../hooks/use-graph-drawer'

vi.mock('../../../../hooks/use-graph-drawer')
vi.mock('../../../form/form-targets', () => ({
  default: vi.fn((props) => (
    <div data-testid="form-targets">
      <div data-testid="nodeIds">{JSON.stringify(props.nodeIds)}</div>
      <div data-testid="getNodeTitle">{typeof props.getNodeTitle}</div>
      <div data-testid="getFieldKeys">{typeof props.getFieldKeys}</div>
      <div data-testid="getFieldLabel">{typeof props.getFieldLabel}</div>
      <div data-testid="isFieldSelected">{typeof props.isFieldSelected}</div>
      <div data-testid="onFieldSelect">{typeof props.onFieldSelect}</div>
      <button data-testid="test-field-select" onClick={() => props.onFieldSelect('node1', 'field1')}>
        Test Field Select
      </button>
    </div>
  )),
}))

describe('GraphDrawerTargets', () => {
  const mockHandleMappingSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null when selectedNode is null', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: null,
      selectedMapping: null,
      nodeMap: {},
      handleMappingSelect: mockHandleMappingSelect,
    } as any)

    const { container } = render(<GraphDrawerTargets />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should return null when nodeMap is null', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1' },
      selectedMapping: null,
      nodeMap: null,
      handleMappingSelect: mockHandleMappingSelect,
    } as any)

    const { container } = render(<GraphDrawerTargets />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render FormTargets with correct props when selectedNode and nodeMap are provided', () => {
    const mockNodeMap = {
      global1: { id: 'global1', title: 'Global 1', fields: ['field1', 'field2'], isGlobal: true },
      pred1: { id: 'pred1', title: 'Predecessor 1', fields: ['field3', 'field4'], isGlobal: false },
      node1: { id: 'node1', title: 'Current Node', fields: ['field5', 'field6'], isGlobal: false },
    }

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: {
        id: 'node1',
        title: 'Current Node',
        predecessorIds: ['pred1'],
      },
      selectedMapping: null,
      nodeMap: mockNodeMap,
      handleMappingSelect: mockHandleMappingSelect,
    } as any)

    render(<GraphDrawerTargets />)

    expect(screen.getByTestId('form-targets')).toBeInTheDocument()

    const nodeIdsJSON = screen.getByTestId('nodeIds').textContent
    const nodeIds = JSON.parse(nodeIdsJSON || '[]')
    expect(nodeIds).toContain('global1')
    expect(nodeIds).toContain('pred1')

    expect(screen.getByTestId('getNodeTitle').textContent).toBe('function')
    expect(screen.getByTestId('getFieldKeys').textContent).toBe('function')
    expect(screen.getByTestId('getFieldLabel').textContent).toBe('function')
    expect(screen.getByTestId('isFieldSelected').textContent).toBe('function')
    expect(screen.getByTestId('onFieldSelect').textContent).toBe('function')
  })

  it('should call handleMappingSelect with correct parameters when a field is selected', () => {
    const mockNodeMap = {
      node1: { id: 'node1', title: 'Node 1', fields: ['field1'], isGlobal: false },
    }

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', title: 'Node 1', predecessorIds: [] },
      selectedMapping: null,
      nodeMap: mockNodeMap,
      handleMappingSelect: mockHandleMappingSelect,
    } as any)

    render(<GraphDrawerTargets />)

    const testButton = screen.getByTestId('test-field-select')
    fireEvent.click(testButton)

    expect(mockHandleMappingSelect).toHaveBeenCalledWith({ nodeId: 'node1', fieldKey: 'field1' })
  })

  it('should handle empty predecessorIds gracefully', () => {
    const mockNodeMap = {
      global1: { id: 'global1', title: 'Global 1', fields: ['field1'], isGlobal: true },
    }

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', title: 'Node 1', predecessorIds: undefined },
      selectedMapping: null,
      nodeMap: mockNodeMap,
      handleMappingSelect: mockHandleMappingSelect,
    } as any)

    render(<GraphDrawerTargets />)

    const nodeIdsJSON = screen.getByTestId('nodeIds').textContent
    const nodeIds = JSON.parse(nodeIdsJSON || '[]')
    expect(nodeIds).toEqual(['global1'])
  })

  it('should filter global nodes correctly from nodeMap', () => {
    const mockNodeMap = {
      global1: { id: 'global1', title: 'Global 1', fields: ['field1'], isGlobal: true },
      global2: { id: 'global2', title: 'Global 2', fields: ['field2'], isGlobal: true },
      regular1: { id: 'regular1', title: 'Regular 1', fields: ['field3'], isGlobal: false },
      regular2: { id: 'regular2', title: 'Regular 2', fields: ['field4'], isGlobal: false },
    }

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'regular1', title: 'Regular 1', predecessorIds: [] },
      selectedMapping: null,
      nodeMap: mockNodeMap,
      handleMappingSelect: mockHandleMappingSelect,
    } as any)

    render(<GraphDrawerTargets />)

    const nodeIdsJSON = screen.getByTestId('nodeIds').textContent
    const nodeIds = JSON.parse(nodeIdsJSON || '[]')
    expect(nodeIds).toContain('global1')
    expect(nodeIds).toContain('global2')
    expect(nodeIds).not.toContain('regular2')
  })

  it('should pass correct field selection status based on selectedMapping', () => {
    const mockSelectedMapping = { nodeId: 'node1', fieldKey: 'field1' }
    const mockNodeMap = {
      node1: { id: 'node1', title: 'Node 1', fields: ['field1'], isGlobal: false },
    }

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', title: 'Node 1', predecessorIds: [] },
      selectedMapping: mockSelectedMapping,
      nodeMap: mockNodeMap,
      handleMappingSelect: mockHandleMappingSelect,
    } as any)

    render(<GraphDrawerTargets />)

    const component = screen.getByTestId('form-targets')
    expect(component).toBeInTheDocument()
  })
})
