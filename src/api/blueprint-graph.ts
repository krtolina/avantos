import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../utils/axios'
import type { BlueprintGraph } from '../types/blueprint-graph'
import type { GlobalGroup } from '../types/graph-drawer'

type UseReadBlueprintGraphParams = {
  tenantId: string
  actionBlueprintId: string
}

export const useReadBlueprintGraph = (params: UseReadBlueprintGraphParams) => {
  const { tenantId, actionBlueprintId } = params

  return useQuery({
    queryFn: (): Promise<BlueprintGraph> =>
      axiosInstance.get(`${tenantId}/actions/blueprints/${actionBlueprintId}/graph`),
    queryKey: ['blueprint-graph', tenantId, actionBlueprintId],
  })
}

export const useReadGlobalGroups = () => {
  return useQuery({
    queryFn: (): Promise<GlobalGroup[]> =>
      Promise.resolve([
        { id: 'group1', title: 'Group 1', targets: ['email', 'name'] },
        { id: 'group2', title: 'Group 2', targets: ['role', 'access'] },
      ]),
    queryKey: ['global-groups'],
  })
}
