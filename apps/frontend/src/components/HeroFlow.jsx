import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TopicNode, LevelNode, LayoutNode, OutputNode } from './canvas/HeroNodes';

const nodeTypes = {
  topic: TopicNode,
  level: LevelNode,
  layout: LayoutNode,
  output: OutputNode,
};

const initialNodes = [
  // Dummy node at the far left to subtly push real nodes to the right
  { id: 'dummy', position: { x: -150, y: 0 }, data: {}, style: { width: 1, height: 1, opacity: 0, pointerEvents: 'none' } },
  { id: '1', type: 'topic', position: { x: 0, y: -20 }, data: {} },
  { id: '2', type: 'level', position: { x: 0, y: 100 }, data: {} },
  { id: '3', type: 'layout', position: { x: 0, y: 280 }, data: {} },
  { id: '4', type: 'output', position: { x: 280, y: 40 }, data: {} },
];

const edgeOptions = {
  animated: true,
  style: { strokeWidth: 1.5, stroke: '#d1d5db' },
};

const initialEdges = [
  { id: 'e1-4', source: '1', target: '4', targetHandle: 'in1', type: 'smoothstep', style: { strokeWidth: 1.5, stroke: '#d1d5db' } },
  { id: 'e2-4', source: '2', target: '4', targetHandle: 'in2', type: 'smoothstep', style: { strokeWidth: 1.5, stroke: '#d1d5db' }, animated: true },
  { id: 'e3-4', source: '3', target: '4', targetHandle: 'in3', type: 'smoothstep', style: { strokeWidth: 1.5, stroke: '#c4b5fd' }, animated: true },
];

export default function HeroFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="hero-flow-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      {/* Soft glow behind the flow just like reactflow.dev but purple */}
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '70%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
      }} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.1, maxZoom: 1.2, minZoom: 0.5 }}
        panOnDrag={true}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        className="hero-react-flow"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}

