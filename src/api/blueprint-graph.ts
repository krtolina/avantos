import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../utils/axios'
import type { BlueprintGraph } from '../types/blueprint-graph'
import type { GraphNode } from '../types/graph'
import { selectGraphNodes } from '../utils/graph-utils'

// ---------------------------------------------------------

export type UseReadGraphNodesParams = {
  tenantId: string
  actionBlueprintId: string
}

export const useReadGraphNodes = (params: UseReadGraphNodesParams) => {
  const { tenantId, actionBlueprintId } = params

  return useQuery({
    queryFn: (): Promise<BlueprintGraph> =>
      axiosInstance.get(`${tenantId}/actions/blueprints/${actionBlueprintId}/graph`),
    queryKey: ['graph', tenantId, actionBlueprintId],
    select: selectGraphNodes,
  })
}

// ---------------------------------------------------------

export type UseReadGraphEdgesParams = {
  tenantId: string
  actionBlueprintId: string
}

export const useReadGraphEdges = (params: UseReadGraphEdgesParams) => {
  const { tenantId, actionBlueprintId } = params

  return useQuery({
    queryFn: (): Promise<BlueprintGraph> =>
      axiosInstance.get(`${tenantId}/actions/blueprints/${actionBlueprintId}/graph`),
    queryKey: ['graph', tenantId, actionBlueprintId],
    select: (data) => data.edges,
  })
}

// ---------------------------------------------------------

export const useReadGlobalNodes = () => {
  return useQuery({
    queryFn: (): Promise<GraphNode[]> =>
      Promise.resolve([
        { id: 'node1', title: 'Global Node 1', fields: ['email', 'name'], isGlobal: true },
        { id: 'node2', title: 'Global Node 2', fields: ['role', 'access'], isGlobal: true },
      ]),
    queryKey: ['global-nodes'],
  })
}
