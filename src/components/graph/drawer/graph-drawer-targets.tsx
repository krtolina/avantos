import { useGraphDrawer } from '../../../hooks/use-graph-drawer'
import type { FormTargetProps } from '../../../types/graph-drawer'
import { getDagTargetProps, getGlobalTargetProps } from '../../../utils/graph-utils'
import FormTargets from '../../form/form-targets'

const GraphDrawerTargets = () => {
  const {
    selectedNode,
    predecessorsMap,
    formMap,
    selectedMapping,
    nodeMap,
    handleMappingSelect,
    globalGroups,
    globalGroupMap,
  } = useGraphDrawer()

  if (!selectedNode || !predecessorsMap || !formMap || !nodeMap || !globalGroups || !globalGroupMap) return null

  const isDagId = (groupId: string) => Boolean(nodeMap[groupId])

  const dag: FormTargetProps = getDagTargetProps({
    selectedNode,
    predecessorsMap,
    formMap,
    selectedMapping,
    nodeMap,
    handleMappingSelect,
  })

  const global: FormTargetProps = getGlobalTargetProps({
    globalGroups,
    globalGroupMap,
    selectedMapping,
    handleMappingSelect,
  })

  return (
    <FormTargets
      groupIds={[...global.groupIds, ...dag.groupIds]}
      getGroupTitle={(groupId) => (isDagId(groupId) ? dag.getGroupTitle(groupId) : global.getGroupTitle(groupId))}
      getTargetKeys={(groupId) => (isDagId(groupId) ? dag.getTargetKeys(groupId) : global.getTargetKeys(groupId))}
      getTargetLabel={(groupId, targetKey) =>
        isDagId(groupId) ? dag.getTargetLabel(groupId, targetKey) : global.getTargetLabel(groupId, targetKey)
      }
      isTargetSelected={(groupId, targetKey) =>
        isDagId(groupId) ? dag.isTargetSelected(groupId, targetKey) : global.isTargetSelected(groupId, targetKey)
      }
      onTargetSelect={(groupId, targetKey) =>
        isDagId(groupId) ? dag.onTargetSelect(groupId, targetKey) : global.onTargetSelect(groupId, targetKey)
      }
    />
  )
}

export default GraphDrawerTargets
