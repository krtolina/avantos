import { describe, it, expect } from 'vitest'
import {
  getFieldKeyFromField,
  getActiveFieldLabel,
  getCanvasNodes,
  getCanvasEdges,
  getNodeMap,
  getMappingMap,
} from '../graph-utils'
import type { DrawerFormField, DrawerFormMapping, GraphNode, NodeMap } from '../../types/graph'
import type { BlueprintEdge } from '../../types/blueprint-graph'

describe('graph-utils', () => {
  it('getFieldKeyFromField returns correct key', () => {
    const field: DrawerFormField = { nodeId: 'n1', fieldKey: 'f1' }
    expect(getFieldKeyFromField(field)).toBe('f1-n1')
  })

  it('getActiveFieldLabel returns correct label', () => {
    const mapping: DrawerFormMapping = {
      field: { nodeId: 'n1', fieldKey: 'f1' },
      target: { nodeId: 'n2', fieldKey: 'f2' },
    }
    const nodeMap: NodeMap = {
      n2: { id: 'n2', title: 'Node 2', fields: [], isGlobal: false },
    }
    expect(getActiveFieldLabel({ mapping, nodeMap })).toBe('f1: Node 2.f2')
  })

  it('getCanvasNodes returns correct nodes', () => {
    const nodes: GraphNode[] = [
      { id: 'n1', title: 'Node 1', fields: [], isGlobal: false, position: { x: 10, y: 20 } },
      { id: 'n2', title: 'Node 2', fields: [], isGlobal: false },
    ]
    const result = getCanvasNodes(nodes)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'n1',
      position: { x: 10, y: 20 },
      data: { label: 'Node 1' },
    })
  })

  it('getCanvasEdges returns correct edges', () => {
    const edges: BlueprintEdge[] = [
      { source: 'n1', target: 'n2' },
      { source: 'n2', target: 'n3' },
    ]
    const result = getCanvasEdges(edges)
    expect(result).toEqual([
      { id: 'n1-n2', source: 'n1', target: 'n2' },
      { id: 'n2-n3', source: 'n2', target: 'n3' },
    ])
  })

  it('getNodeMap returns correct map', () => {
    const nodes: GraphNode[] = [
      { id: 'n1', title: 'Node 1', fields: [], isGlobal: false },
      { id: 'n2', title: 'Node 2', fields: [], isGlobal: false },
    ]
    const map = getNodeMap(nodes)
    expect(map.n1.title).toBe('Node 1')
    expect(map.n2.title).toBe('Node 2')
  })

  it('getMappingMap returns correct map', () => {
    const mappings: DrawerFormMapping[] = [
      {
        field: { nodeId: 'n1', fieldKey: 'f1' },
        target: { nodeId: 'n2', fieldKey: 'f2' },
      },
    ]
    const map = getMappingMap(mappings)
    expect(map['f1-n1']).toEqual(mappings[0])
  })
})
