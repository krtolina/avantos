import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../utils/axios'
import type { BlueprintGraph } from '../types/blueprint-graph'

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
