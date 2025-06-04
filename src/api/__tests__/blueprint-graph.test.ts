import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useReadGraphNodes, useReadGraphEdges, useReadGlobalNodes } from '../blueprint-graph'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../utils/axios'
import { selectGraphNodes } from '../../utils/graph-utils'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

vi.mock('../../utils/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}))

vi.mock('../../utils/graph-utils', () => ({
  selectGraphNodes: vi.fn(),
}))

describe('Blueprint Graph API', () => {
  const mockParams = {
    tenantId: 'test-tenant',
    actionBlueprintId: 'test-blueprint',
  }

  const mockGraphData = {
    nodes: [{ id: 'node1', data: { label: 'Node 1' } }],
    edges: [{ id: 'edge1', source: 'node1', target: 'node2' }],
  }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useQuery).mockReturnValue({ data: mockGraphData } as any)
    vi.mocked(axiosInstance.get).mockResolvedValue(mockGraphData)
    vi.mocked(selectGraphNodes).mockReturnValue(mockGraphData.nodes as any)
  })

  describe('useReadGraphNodes', () => {
    it('should call useQuery with correct parameters', () => {
      useReadGraphNodes(mockParams)

      expect(useQuery).toHaveBeenCalledTimes(1)
      expect(useQuery).toHaveBeenCalledWith({
        queryFn: expect.any(Function),
        queryKey: ['graph', mockParams.tenantId, mockParams.actionBlueprintId],
        select: selectGraphNodes,
      })
    })

    it('should create correct API URL in queryFn', async () => {
      useReadGraphNodes(mockParams)

      const queryFnArg = vi.mocked(useQuery).mock.calls[0][0]
      const queryFn = queryFnArg.queryFn as any

      await queryFn()

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${mockParams.tenantId}/actions/blueprints/${mockParams.actionBlueprintId}/graph`
      )
    })

    it('should use selectGraphNodes for data transformation', () => {
      useReadGraphNodes(mockParams)

      const queryConfig = vi.mocked(useQuery).mock.calls[0][0]
      expect(queryConfig.select).toBe(selectGraphNodes)
    })
  })

  describe('useReadGraphEdges', () => {
    it('should call useQuery with correct parameters', () => {
      useReadGraphEdges(mockParams)

      expect(useQuery).toHaveBeenCalledTimes(1)
      expect(useQuery).toHaveBeenCalledWith({
        queryFn: expect.any(Function),
        queryKey: ['graph', mockParams.tenantId, mockParams.actionBlueprintId],
        select: expect.any(Function),
      })
    })

    it('should create correct API URL in queryFn', async () => {
      useReadGraphEdges(mockParams)

      const queryFnArg = vi.mocked(useQuery).mock.calls[0][0]
      const queryFn = queryFnArg.queryFn as any

      await queryFn()

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${mockParams.tenantId}/actions/blueprints/${mockParams.actionBlueprintId}/graph`
      )
    })

    it('should select edges from the response data', () => {
      useReadGraphEdges(mockParams)

      const queryConfig = vi.mocked(useQuery).mock.calls[0][0]
      const selectFn = queryConfig.select as any

      const result = selectFn(mockGraphData)

      expect(result).toEqual(mockGraphData.edges)
    })
  })

  describe('useReadGlobalNodes', () => {
    it('should call useQuery with correct parameters', () => {
      useReadGlobalNodes()

      expect(useQuery).toHaveBeenCalledTimes(1)
      expect(useQuery).toHaveBeenCalledWith({
        queryFn: expect.any(Function),
        queryKey: ['global-nodes'],
      })
    })

    it('should return hardcoded global nodes', async () => {
      useReadGlobalNodes()

      const queryFnArg = vi.mocked(useQuery).mock.calls[0][0]
      const queryFn = queryFnArg.queryFn as any

      const result = await queryFn()

      expect(result).toEqual([
        { id: 'node1', title: 'Global Node 1', fields: ['email', 'name'], isGlobal: true },
        { id: 'node2', title: 'Global Node 2', fields: ['role', 'access'], isGlobal: true },
      ])
    })
  })

  describe('Error handling', () => {
    it('should propagate errors from axiosInstance in useReadGraphNodes', async () => {
      const mockError = new Error('API error')
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError)

      useReadGraphNodes(mockParams)

      const queryFnArg = vi.mocked(useQuery).mock.calls[0][0]
      const queryFn = queryFnArg.queryFn as any

      await expect(queryFn()).rejects.toThrow('API error')
    })

    it('should propagate errors from axiosInstance in useReadGraphEdges', async () => {
      const mockError = new Error('API error')
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError)

      useReadGraphEdges(mockParams)

      const queryFnArg = vi.mocked(useQuery).mock.calls[0][0]
      const queryFn = queryFnArg.queryFn as any

      await expect(queryFn()).rejects.toThrow('API error')
    })
  })
})
