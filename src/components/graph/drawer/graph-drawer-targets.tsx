import { useGraphDrawer } from '../../../hooks/use-graph-drawer'
import FormTargets from '../../form/form-targets'

const GraphDrawerTargets = () => {
  const { selectedNode, selectedMapping, nodeMap, handleMappingSelect } = useGraphDrawer()

  if (!selectedNode || !nodeMap) return null

  const globalNodeIds = Object.keys(nodeMap).filter((nodeId) => nodeMap[nodeId].isGlobal)

  return (
    <FormTargets
      nodeIds={[...globalNodeIds, ...(selectedNode.predecessorIds ?? [])]}
      getNodeTitle={(nodeId) => nodeMap[nodeId].title}
      getFieldKeys={(nodeId) => nodeMap[nodeId].fields}
      getFieldLabel={(_, fieldKey) => fieldKey}
      isFieldSelected={(nodeId, fieldKey) =>
        Boolean(selectedMapping && selectedMapping.fieldKey === fieldKey && selectedMapping.nodeId === nodeId)
      }
      onFieldSelect={(nodeId, fieldKey) => handleMappingSelect({ nodeId, fieldKey })}
    />
  )
}

export default GraphDrawerTargets
