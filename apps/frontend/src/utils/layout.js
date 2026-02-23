/**
 * Auto-layout menggunakan algoritma tree sederhana.
 * Mengorganisir nodes dalam layout hierarkis top-to-bottom.
 */

const NODE_WIDTH = 220;
const NODE_HEIGHT = 120;
const HORIZONTAL_GAP = 60;
const VERTICAL_GAP = 80;

/**
 * Layout nodes dan edges secara hierarkis
 */
export function getLayoutedElements(nodes, edges) {
  if (nodes.length === 0) return { nodes: [], edges };

  // Build adjacency list
  const children = {};
  const parents = {};

  nodes.forEach(n => {
    children[n.id] = [];
    parents[n.id] = [];
  });

  edges.forEach(e => {
    if (children[e.source]) children[e.source].push(e.target);
    if (parents[e.target]) parents[e.target].push(e.source);
  });

  // Find root nodes (no parents)
  const roots = nodes.filter(n => parents[n.id]?.length === 0);
  if (roots.length === 0) {
    // fallback: gunakan node pertama sebagai root
    roots.push(nodes[0]);
  }

  // BFS untuk menentukan level setiap node
  const levels = {};
  const visited = new Set();
  const queue = [];

  roots.forEach(r => {
    queue.push({ id: r.id, level: 0 });
    visited.add(r.id);
    levels[r.id] = 0;
  });

  while (queue.length > 0) {
    const { id, level } = queue.shift();
    const childIds = children[id] || [];

    childIds.forEach(childId => {
      if (!visited.has(childId)) {
        visited.add(childId);
        levels[childId] = level + 1;
        queue.push({ id: childId, level: level + 1 });
      }
    });
  }

  // Assign level 0 ke node yang belum dikunjungi
  nodes.forEach(n => {
    if (levels[n.id] === undefined) {
      levels[n.id] = 0;
    }
  });

  // Group nodes per level
  const levelGroups = {};
  nodes.forEach(n => {
    const level = levels[n.id];
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(n);
  });

  // Position nodes
  const positionedNodes = nodes.map(node => {
    const level = levels[node.id];
    const group = levelGroups[level];
    const index = group.indexOf(node);
    const totalWidth = group.length * (NODE_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP;

    return {
      ...node,
      position: {
        x: index * (NODE_WIDTH + HORIZONTAL_GAP) - totalWidth / 2,
        y: level * (NODE_HEIGHT + VERTICAL_GAP),
      },
    };
  });

  const positionedEdges = edges.map(edge => {
    const sourceNode = positionedNodes.find(n => n.id === edge.source);
    const targetNode = positionedNodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return edge;

    const sy = sourceNode.position.y;
    const ty = targetNode.position.y;
    const sx = sourceNode.position.x;
    const tx = targetNode.position.x;

    let sourceHandle = 'bottom';
    let targetHandle = 'top';

    // Back-edge (Loop ke atas)
    if (sy > ty) {
      if (sx > tx) {
        sourceHandle = 'left';
        targetHandle = 'left';
      } else {
        sourceHandle = 'right';
        targetHandle = 'right';
      }
    } 
    // Edge mendatar di level yang sama
    else if (sy === ty) {
      sourceHandle = sx < tx ? 'right' : 'left';
      targetHandle = sx < tx ? 'left' : 'right';
    } 
    // Forward-edge tapi skip / diagonal yg tajam
    else {
      sourceHandle = 'bottom';
      targetHandle = 'top';
    }

    return {
      ...edge,
      sourceHandle,
      targetHandle,
    };
  });

  return { nodes: positionedNodes, edges: positionedEdges };
}

/**
 * Generate unique ID
 */
export function generateId() {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
