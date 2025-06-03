import { Background, ReactFlow } from '@xyflow/react'
import { useReadBlueprintGraph } from '../api/blueprint-graph'
import { getCanvasEdgesFromBlueprintGraph, getCanvasNodesFromBlueprintGraph } from '../utils/mapper'
import { useCallback, useMemo, useState } from 'react'
import Loader from './loader'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import type { BlueprintFormField, BlueprintNode } from '../types/blueprint-graph'
import { Database } from 'lucide-react'

const ReactFlowGraph = () => {
  const [selectedNode, setSelectedNode] = useState<BlueprintNode>()
  const [selectedField, setSelectedField] = useState<BlueprintFormField>()

  const { data, isLoading } = useReadBlueprintGraph({
    tenantId: 'MOCK',
    actionBlueprintId: 'MOCK',
  })

  const canvasNodes = useMemo(() => (data ? getCanvasNodesFromBlueprintGraph(data) : []), [data])

  const canvasEdges = useMemo(() => (data ? getCanvasEdgesFromBlueprintGraph(data) : []), [data])

  const nodeMap = useMemo(() => {
    const map: Record<string, BlueprintNode> = {}
    if (data)
      data.nodes.forEach((node) => {
        map[node.id] = node
      })
    return map
  }, [data])

  const form = useMemo(() => {
    if (!data || !selectedNode) return undefined
    return data.forms.find((form) => form.id === selectedNode.data.component_id)
  }, [data, selectedNode])

  const handleOpenModal = useCallback(
    (id: string) => {
      setSelectedNode(nodeMap[id])
    },
    [nodeMap]
  )

  const handleCloseModal = useCallback(() => {
    setSelectedNode(undefined)
    setSelectedField(undefined)
  }, [])

  const handleRemoveFieldSelection = useCallback(() => {
    setSelectedField(undefined)
  }, [])

  const handleFieldSelect = useCallback((field: BlueprintFormField) => {
    setSelectedField(field)
  }, [])

  if (isLoading) return <Loader />

  return (
    <>
      <ReactFlow
        nodes={canvasNodes}
        edges={canvasEdges}
        colorMode="dark"
        fitView
        onNodeClick={(_, node) => handleOpenModal(node.id)}
      >
        <Background />
      </ReactFlow>
      <Modal isOpen={Boolean(selectedNode)} onClose={handleCloseModal} size="xl" scrollBehavior="inside">
        {selectedNode && form ? (
          <ModalContent className="py-3">
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Prefill</p>
                <p className="text-sm font-normal text-gray-500">Prefill fields for {selectedNode.data.name}</p>
              </ModalHeader>
              <ModalBody>
                {selectedField ? (
                  <div />
                ) : (
                  <ul>
                    {Object.entries(form.field_schema.properties).map(([key, field]) => (
                      <li key={key} className="flex items-center justify-between py-2">
                        <Button
                          variant="flat"
                          className="flex items-center gap-2 w-full justify-start"
                          startContent={<Database className="h-5 w-5 text-gray-500" />}
                          onPress={() => handleFieldSelect(field)}
                        >
                          <span className="text-sm font-medium">{key}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={selectedField ? handleRemoveFieldSelection : handleCloseModal}
                >
                  Cancel
                </Button>
                {selectedField ? (
                  <Button color="primary" onPress={handleCloseModal}>
                    Save
                  </Button>
                ) : null}
              </ModalFooter>
            </>
          </ModalContent>
        ) : null}
      </Modal>
    </>
  )
}

export default ReactFlowGraph
