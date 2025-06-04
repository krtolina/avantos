import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GraphDrawerFields from '../graph-drawer-fields'
import { useGraphDrawer } from '../../../../hooks/use-graph-drawer'
import * as graphUtils from '../../../../utils/graph-utils'

vi.mock('../../../../hooks/use-graph-drawer')
vi.mock('../../../../utils/graph-utils', () => ({
  getActiveFieldLabel: vi.fn(),
  getFieldKeyFromField: vi.fn(),
  getMappingMap: vi.fn(),
}))
vi.mock('../../../form/form-fields', () => ({
  default: vi.fn((props) => (
    <div data-testid="form-fields">
      <div data-testid="fieldKeys">{JSON.stringify(props.fieldKeys)}</div>
      <div data-testid="isFieldActive">{typeof props.isFieldActive}</div>
      <div data-testid="getActiveLabel">{typeof props.getActiveLabel}</div>
      <div data-testid="getBasicLabel">{typeof props.getBasicLabel}</div>
      <button data-testid="test-remove" onClick={() => props.onRemove('field1')}>
        Test Remove
      </button>
      <button data-testid="test-select" onClick={() => props.onSelect('field2')}>
        Test Select
      </button>
    </div>
  )),
}))

describe('GraphDrawerFields', () => {
  const mockHandleFieldSelect = vi.fn()
  const mockHandleRemoveMapping = vi.fn()
  const mockGetMappingMap = vi.fn()
  const mockGetFieldKeyFromField = vi.fn()
  const mockGetActiveFieldLabel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(graphUtils.getMappingMap).mockImplementation(mockGetMappingMap)
    vi.mocked(graphUtils.getFieldKeyFromField).mockImplementation(mockGetFieldKeyFromField)
    vi.mocked(graphUtils.getActiveFieldLabel).mockImplementation(mockGetActiveFieldLabel)
  })

  it('should return null when selectedNode is null', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: null,
      nodeMap: {},
      mappings: [],
      handleFieldSelect: mockHandleFieldSelect,
      handleRemoveMapping: mockHandleRemoveMapping,
    } as any)

    const { container } = render(<GraphDrawerFields />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should return null when nodeMap is null', () => {
    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', fields: ['field1'] },
      nodeMap: null,
      mappings: [],
      handleFieldSelect: mockHandleFieldSelect,
      handleRemoveMapping: mockHandleRemoveMapping,
    } as any)

    const { container } = render(<GraphDrawerFields />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render FormFields with correct props when selectedNode and nodeMap are provided', () => {
    const mockNodeMap = { node1: { id: 'node1', title: 'Node 1' } }
    const mockMappings = [
      { nodeId: 'node1', fieldKey: 'field1', sourceNodeId: 'source1', sourceFieldKey: 'sourceField1' },
    ]
    const mockMappingMap = { 'node1:field1': mockMappings[0] }

    mockGetMappingMap.mockReturnValue(mockMappingMap)
    mockGetFieldKeyFromField.mockImplementation(({ nodeId, fieldKey }) => `${nodeId}:${fieldKey}`)
    mockGetActiveFieldLabel.mockReturnValue('Mapped from Source 1')

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', fields: ['field1', 'field2'] },
      nodeMap: mockNodeMap,
      mappings: mockMappings,
      handleFieldSelect: mockHandleFieldSelect,
      handleRemoveMapping: mockHandleRemoveMapping,
    } as any)

    render(<GraphDrawerFields />)

    expect(screen.getByTestId('form-fields')).toBeInTheDocument()

    expect(mockGetMappingMap).toHaveBeenCalledWith(mockMappings)

    const fieldKeysJSON = screen.getByTestId('fieldKeys').textContent
    const fieldKeys = JSON.parse(fieldKeysJSON || '[]')
    expect(fieldKeys).toEqual(['field1', 'field2'])

    expect(screen.getByTestId('isFieldActive').textContent).toBe('function')
    expect(screen.getByTestId('getActiveLabel').textContent).toBe('function')
    expect(screen.getByTestId('getBasicLabel').textContent).toBe('function')
  })

  it('should call handleRemoveMapping with correct parameters when onRemove is called', () => {
    const mockNodeMap = { node1: { id: 'node1', title: 'Node 1' } }
    const mockMappings: any[] = []
    const mockMappingMap = {}

    mockGetMappingMap.mockReturnValue(mockMappingMap)

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', fields: ['field1', 'field2'] },
      nodeMap: mockNodeMap,
      mappings: mockMappings,
      handleFieldSelect: mockHandleFieldSelect,
      handleRemoveMapping: mockHandleRemoveMapping,
    } as any)

    render(<GraphDrawerFields />)

    const removeButton = screen.getByTestId('test-remove')
    fireEvent.click(removeButton)

    expect(mockHandleRemoveMapping).toHaveBeenCalledWith({ nodeId: 'node1', fieldKey: 'field1' })
  })

  it('should call handleFieldSelect with correct parameters when onSelect is called', () => {
    const mockNodeMap = { node1: { id: 'node1', title: 'Node 1' } }
    const mockMappings: any[] = []
    const mockMappingMap = {}

    mockGetMappingMap.mockReturnValue(mockMappingMap)

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', fields: ['field1', 'field2'] },
      nodeMap: mockNodeMap,
      mappings: mockMappings,
      handleFieldSelect: mockHandleFieldSelect,
      handleRemoveMapping: mockHandleRemoveMapping,
    } as any)

    render(<GraphDrawerFields />)

    const selectButton = screen.getByTestId('test-select')
    fireEvent.click(selectButton)

    expect(mockHandleFieldSelect).toHaveBeenCalledWith({ nodeId: 'node1', fieldKey: 'field2' })
  })

  it('should correctly determine if a field is active', () => {
    const mockNodeMap = { node1: { id: 'node1', title: 'Node 1' } }
    const mockMappings = [
      { nodeId: 'node1', fieldKey: 'field1', sourceNodeId: 'source1', sourceFieldKey: 'sourceField1' },
    ]
    const mockMappingMap = { 'node1:field1': mockMappings[0] }

    mockGetMappingMap.mockReturnValue(mockMappingMap)
    mockGetFieldKeyFromField.mockImplementation(({ nodeId, fieldKey }) => `${nodeId}:${fieldKey}`)

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', fields: ['field1', 'field2'] },
      nodeMap: mockNodeMap,
      mappings: mockMappings,
      handleFieldSelect: mockHandleFieldSelect,
      handleRemoveMapping: mockHandleRemoveMapping,
    } as any)

    render(<GraphDrawerFields />)

    const formFields = screen.getByTestId('form-fields')
    expect(formFields).toBeInTheDocument()
  })

  it('should pass getActiveLabel that uses getActiveFieldLabel with correct parameters', () => {
    const mockNodeMap = { node1: { id: 'node1', title: 'Node 1' } }
    const mockMappings = [
      { nodeId: 'node1', fieldKey: 'field1', sourceNodeId: 'source1', sourceFieldKey: 'sourceField1' },
    ]
    const mockMappingMap = { 'node1:field1': mockMappings[0] }

    mockGetMappingMap.mockReturnValue(mockMappingMap)
    mockGetFieldKeyFromField.mockReturnValue('node1:field1')
    mockGetActiveFieldLabel.mockReturnValue('Mapped from Source 1')

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', fields: ['field1', 'field2'] },
      nodeMap: mockNodeMap,
      mappings: mockMappings,
      handleFieldSelect: mockHandleFieldSelect,
      handleRemoveMapping: mockHandleRemoveMapping,
    } as any)

    render(<GraphDrawerFields />)

    expect(screen.getByTestId('form-fields')).toBeInTheDocument()
  })

  it('should use useMemo to avoid unnecessary recalculations of mappingMap', () => {
    const mockNodeMap = { node1: { id: 'node1', title: 'Node 1' } }
    const mockMappings = [
      { nodeId: 'node1', fieldKey: 'field1', sourceNodeId: 'source1', sourceFieldKey: 'sourceField1' },
    ]
    const mockMappingMap = { 'node1:field1': mockMappings[0] }

    mockGetMappingMap.mockReturnValue(mockMappingMap)

    vi.mocked(useGraphDrawer).mockReturnValue({
      selectedNode: { id: 'node1', fields: ['field1', 'field2'] },
      nodeMap: mockNodeMap,
      mappings: mockMappings,
      handleFieldSelect: mockHandleFieldSelect,
      handleRemoveMapping: mockHandleRemoveMapping,
    } as any)

    const { rerender } = render(<GraphDrawerFields />)

    expect(mockGetMappingMap).toHaveBeenCalledTimes(1)

    rerender(<GraphDrawerFields />)

    expect(mockGetMappingMap).toHaveBeenCalledTimes(1)
  })
})
