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
import type { BlueprintForm, BlueprintNode } from '../types/blueprint-graph'
import { Database } from 'lucide-react'

type FormField = { nodeId: string; fieldKey: string }

const ReactFlowGraph = () => {
  const [selectedNode, setSelectedNode] = useState<BlueprintNode>()
  const [selectedField, setSelectedField] = useState<FormField>()
  const [selectedMapping, setSelectedMapping] = useState<FormField>()

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

  const predecessorsMap = useMemo(() => {
    if (!data) return {}

    const incoming: Record<string, string[]> = {}

    data.edges.forEach(({ source, target }) => {
      if (!incoming[target]) incoming[target] = []
      incoming[target].push(source)
    })

    const map: Record<string, BlueprintNode[]> = {}

    data.nodes.forEach((node) => {
      const visited = new Set<string>()
      const queue: string[] = incoming[node.id] ? [...incoming[node.id]] : []
      const result: string[] = []

      while (queue.length > 0) {
        const parent = queue.shift()!
        if (!visited.has(parent)) {
          visited.add(parent)
          result.push(parent)
          if (incoming[parent]) queue.push(...incoming[parent])
        }
      }

      map[node.id] = result.map((id) => nodeMap[id])
    })

    return map
  }, [data, nodeMap])

  const handleOpenModal = useCallback(
    (id: string) => {
      setSelectedNode(nodeMap[id])
    },
    [nodeMap]
  )

  const handleCloseModal = useCallback(() => {
    setSelectedNode(undefined)
    setSelectedField(undefined)
    setSelectedMapping(undefined)
  }, [])

  const handleRemoveFieldSelection = useCallback(() => {
    setSelectedField(undefined)
    setSelectedMapping(undefined)
  }, [])

  const handleFieldSelect = useCallback((field: FormField) => {
    setSelectedField(field)
  }, [])

  const handleMappingSelect = useCallback((mapping: FormField) => {
    setSelectedMapping(mapping)
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
                      Select mapping for <strong>{selectedField.fieldKey}</strong> in{' '}
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
                    {predecessorsMap[selectedNode.id].map((node) => (
                      <AccordionItem key={node.id} title={node.data.name}>
                        <ul>
                          {Object.keys(formMap[node.data.component_id].field_schema.properties).map((key) => (
                            <li key={key} className="flex items-center justify-between py-1">
                              <Button
                                variant={
                                  selectedMapping &&
                                  selectedMapping.fieldKey === key &&
                                  selectedMapping.nodeId === node.id
                                    ? 'solid'
                                    : 'flat'
                                }
                                className="flex items-center gap-2 w-full justify-start"
                                startContent={<Database className="h-5 w-5 text-gray-500" />}
                                onPress={() => handleMappingSelect({ nodeId: node.id, fieldKey: key })}
                              >
                                {key}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <ul>
                    {Object.keys(formMap[selectedNode.data.component_id].field_schema.properties).map((key) => (
                      <li key={key} className="flex items-center justify-between py-1">
                        <Button
                          variant="flat"
                          className="flex items-center gap-2 w-full justify-start"
                          startContent={<Database className="h-5 w-5 text-gray-500" />}
                          onPress={() => handleFieldSelect({ nodeId: selectedNode.id, fieldKey: key })}
                        >
                          {key}
                        </Button>
                      </li>
                    ))}
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
                  <Button color="primary" isDisabled={!selectedMapping}>
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
