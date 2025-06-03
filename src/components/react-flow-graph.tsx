import { Background, ReactFlow } from '@xyflow/react'
import { useReadBlueprintGraph } from '../api/blueprint-graph'
import { getCanvasEdgesFromBlueprintGraph, getCanvasNodesFromBlueprintGraph } from '../utils/mapper'
import { useCallback, useMemo, useState } from 'react'
import Loader from './loader'
import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import type { BlueprintForm, BlueprintFormField, BlueprintNode } from '../types/blueprint-graph'
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

  const formMap = useMemo(() => {
    const map: Record<string, BlueprintForm> = {}
    if (data) {
      data.forms.forEach((form) => {
        map[form.id] = form
      })
    }
    return map
  }, [data])

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
        {selectedNode && formMap && data ? (
          <ModalContent className="py-3">
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Prefill</p>
                <p className="text-sm font-normal text-gray-500">Prefill fields for {selectedNode.data.name}</p>
              </ModalHeader>
              <ModalBody>
                {selectedField ? (
                  <Accordion selectionMode="multiple">
                    {Object.values(nodeMap).map((node) => (
                      <AccordionItem key={node.id} title={node.data.name}>
                        <ul>
                          {Object.entries(formMap[node.data.component_id].field_schema.properties).map(
                            ([key, field]) => (
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
                            )
                          )}
                        </ul>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <ul>
                    {Object.entries(formMap[selectedNode.data.component_id].field_schema.properties).map(
                      ([key, field]) => (
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
                      )
                    )}
                  </ul>
                )}
              </ModalBody>
              <ModalFooter>
                {selectedField ? (
                  <Button color="danger" variant="flat" key="back" onPress={handleRemoveFieldSelection}>
                    Back
                  </Button>
                ) : (
                  <Button color="danger" variant="flat" key="cancel" onPress={handleCloseModal}>
                    Cancel
                  </Button>
                )}
                {selectedField ? (
                  <Button color="primary" onPress={handleCloseModal}>
                    Select
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
