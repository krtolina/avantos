import { Background, ReactFlow } from '@xyflow/react'
import { useReadBlueprintGraph } from '../api/blueprint-graph'
import { getCanvasEdgesFromBlueprintGraph, getCanvasNodesFromBlueprintGraph } from '../utils/mapper'
import { useCallback, useMemo, useState } from 'react'
import Loader from './loader'
import {
  Accordion,
  AccordionItem,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@heroui/react'
import type { BlueprintForm, BlueprintFormField, BlueprintNode } from '../types/blueprint-graph'
import { Database } from 'lucide-react'

const ReactFlowGraph = () => {
  const [selectedNode, setSelectedNode] = useState<BlueprintNode>()
  const [selectedField, setSelectedField] = useState<{ key: string; value: BlueprintFormField }>()

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

  const handleFieldSelect = useCallback((key: string, value: BlueprintFormField) => {
    setSelectedField({ key, value })
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
      <Drawer isOpen={Boolean(selectedNode)} onClose={handleCloseModal} scrollBehavior="inside" size="lg">
        {selectedNode && formMap && data ? (
          <DrawerContent>
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <p>Prefill</p>
                <p className="text-sm font-normal text-gray-500">
                  {selectedField ? (
                    <>
                      Select mapping for <strong>{selectedField.key}</strong> in{' '}
                      <strong>{selectedNode.data.name}</strong>
                    </>
                  ) : (
                    <>
                      Prefill fields for <strong>{selectedNode.data.name}</strong>
                    </>
                  )}
                </p>
              </DrawerHeader>
              <DrawerBody>
                {selectedField ? (
                  <Accordion selectionMode="multiple">
                    {Object.values(nodeMap).map((node) => (
                      <AccordionItem key={node.id} title={node.data.name}>
                        <ul>
                          {Object.entries(formMap[node.data.component_id].field_schema.properties).map(
                            ([key, field]) => (
                              <li key={key} className="flex items-center justify-between py-1">
                                <Button
                                  variant="flat"
                                  className="flex items-center gap-2 w-full justify-start"
                                  startContent={<Database className="h-5 w-5 text-gray-500" />}
                                  onPress={() => handleFieldSelect(key, field)}
                                >
                                  {key}
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
                        <li key={key} className="flex items-center justify-between py-1">
                          <Button
                            variant="flat"
                            className="flex items-center gap-2 w-full justify-start"
                            startContent={<Database className="h-5 w-5 text-gray-500" />}
                            onPress={() => handleFieldSelect(key, field)}
                          >
                            {key}
                          </Button>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </DrawerBody>
              <DrawerFooter>
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
              </DrawerFooter>
            </>
          </DrawerContent>
        ) : null}
      </Drawer>
    </>
  )
}

export default ReactFlowGraph
