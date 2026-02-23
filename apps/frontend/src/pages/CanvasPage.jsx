import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
  SelectionMode,
  ConnectionMode,
  ControlButton,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useProjects } from '../context/ProjectContext';
import RoadmapNode from '../components/canvas/RoadmapNode';
import AIPanel from '../components/canvas/AIPanel';
import ShapesPanel from '../components/canvas/ShapesPanel';
import ResizableSidebar from '../components/canvas/ResizableSidebar';
import { getLayoutedElements, generateId } from '../utils/layout';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Plus, Save, Layout,
  Workflow, MousePointer, Bot, Shapes, Sparkles, Hand, MousePointer2,
  Download, Undo2, Redo2, Menu, X
} from 'lucide-react';
import { toPng, toJpeg, toSvg } from 'html-to-image';

const nodeTypes = { roadmapNode: RoadmapNode };

export default function CanvasPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, updateProject } = useProjects();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [projectName, setProjectName] = useState('Untitled');
  const [showAI, setShowAI] = useState(false);
  const [showShapes, setShowShapes] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandTarget, setExpandTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentEdgeType, setCurrentEdgeType] = useState('smoothstep');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [edgePrompt, setEdgePrompt] = useState({ isOpen: false, label: '', edgeId: null, params: null });
  const [exportModal, setExportModal] = useState({ isOpen: false, format: 'png', transparent: false });

  const saveTimeoutRef = useRef(null);
  const reactFlowWrapperRef = useRef(null);
  const reactFlowInstanceRef = useRef(null);

  // History State
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const currentState = useRef({ nodes: [], edges: [] });

  useEffect(() => {
    currentState.current = { nodes, edges };
  }, [nodes, edges]);

  const takeSnapshot = useCallback(() => {
    setPast((p) => {
      const snap = JSON.parse(JSON.stringify(currentState.current));
      return [...p, snap].slice(-50); // Maksimal 50 langkah
    });
    setFuture([]);
  }, []);

  // Helper untuk memasang actions listener ke node
  const attachNodeActions = useCallback((nodeList) => {
    return nodeList.map(node => ({
      ...node,
      data: {
        ...node.data,
        onUpdate: (updates) => {
          takeSnapshot();
          setNodes(nds => nds.map(n =>
            n.id === node.id ? { ...n, data: { ...n.data, ...updates } } : n
          ));
        },
        onDelete: () => {
          takeSnapshot();
          setNodes(nds => nds.filter(n => n.id !== node.id));
          setEdges(eds => eds.filter(e => e.source !== node.id && e.target !== node.id));
        },
        onExpand: () => {
          setExpandTarget({ id: node.id, label: node.data.label, description: node.data.description });
          setShowAI(true);
        },
      },
    }));
  }, [setNodes, setEdges, takeSnapshot]);

  const handleUndo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const newPast = [...p];
      const previous = newPast.pop();
      setFuture((f) => [JSON.parse(JSON.stringify(currentState.current)), ...f]);
      setNodes(attachNodeActions(previous.nodes));
      setEdges(previous.edges);
      return newPast;
    });
  }, [setNodes, setEdges, attachNodeActions]);

  const handleRedo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const newFuture = [...f];
      const next = newFuture.shift();
      setPast((p) => [...p, JSON.parse(JSON.stringify(currentState.current))]);
      setNodes(attachNodeActions(next.nodes));
      setEdges(next.edges);
      return newFuture;
    });
  }, [setNodes, setEdges, attachNodeActions]);

  // Keyboard shortcut for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      if (cmdOrCtrl && e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Load project data
  useEffect(() => {
    async function load() {
      const project = await getProject(projectId);
      if (!project) {
        toast.error('Proyek tidak ditemukan');
        navigate('/dashboard');
        return;
      }

      setProjectName(project.name);

      try {
        const rawNodes = project.nodesData || project.nodes_data;
        const rawEdges = project.edgesData || project.edges_data;
        
        const savedNodes = typeof rawNodes === 'string' ? JSON.parse(rawNodes) : (rawNodes || []);
        const savedEdges = typeof rawEdges === 'string' ? JSON.parse(rawEdges) : (rawEdges || []);
        
        setNodes(attachNodeActions(savedNodes));
        setEdges(savedEdges);
      } catch {
        setNodes([]);
        setEdges([]);
      }

      setLoaded(true);
    }
    load();
  }, [projectId]);

  // Auto-save (debounced)
  const autoSave = useCallback(async (currentNodes, currentEdges) => {
    if (!loaded) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true);
      await updateProject(projectId, {
        nodes_data: currentNodes,
        edges_data: currentEdges,
      });
      setSaving(false);
    }, 2000);
  }, [projectId, updateProject, loaded]);

  useEffect(() => {
    if (loaded) autoSave(nodes, edges);
  }, [nodes, edges, loaded]);



  // Handle connection
  const onConnect = useCallback((params) => {
    // Tampilkan modal custom alih-alih window.prompt
    setEdgePrompt({ isOpen: true, label: '', edgeId: null, params });
  }, []);

  // Handle Edit teks pada Edge (garis)
  const onEdgeDoubleClick = useCallback((event, edge) => {
    event.stopPropagation();
    setEdgePrompt({ isOpen: true, label: edge.label || '', edgeId: edge.id, params: null });
  }, []);

  // Simpan hasil prompt dari edge
  const handleEdgePromptSubmit = () => {
    takeSnapshot();
    if (edgePrompt.params) {
      setEdges(eds => addEdge({
        ...edgePrompt.params,
        type: currentEdgeType,
        animated: true,
        selectable: true,
        label: edgePrompt.label || undefined,
        labelStyle: { fill: '#6d28d9', fontWeight: 600, fontSize: 13, fontFamily: 'Inter' },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9, stroke: '#e2e8f0', strokeWidth: 1, rx: 6, ry: 6 },
        labelBgPadding: [8, 4],
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
      }, eds));
    } else if (edgePrompt.edgeId) {
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id === edgePrompt.edgeId) {
            e.label = edgePrompt.label || undefined;
          }
          return e;
        })
      );
    }
    setEdgePrompt({ isOpen: false, label: '', edgeId: null, params: null });
  };

  // Hapus Edge
  const handleDeleteEdge = () => {
    if (edgePrompt.edgeId) {
      takeSnapshot();
      setEdges(eds => eds.filter(e => e.id !== edgePrompt.edgeId));
      toast.success('Garis berhasil dihapus');
    }
    setEdgePrompt({ isOpen: false, label: '', edgeId: null, params: null });
  };

  // Tambah node manual
  const addNode = useCallback((shapeConfig = null) => {
    const id = generateId();
    const nodeType = shapeConfig?.nodeType || 'step';
    const label = shapeConfig?.label || 'Node Baru';

    let position = { x: 250, y: 250 };
    if (reactFlowWrapperRef.current && reactFlowInstanceRef.current) {
      const bounds = reactFlowWrapperRef.current.getBoundingClientRect();
      const centerX = bounds.x + bounds.width / 2;
      const centerY = bounds.y + bounds.height / 2;
      
      // Kasih sedikit random offset agar saat tekan banyak kali tidak menumpuk utuh
      const offset = (Math.random() - 0.5) * 30; 
      position = reactFlowInstanceRef.current.screenToFlowPosition({
        x: centerX + offset,
        y: centerY + offset,
      });
    }

    const newNode = {
      id,
      type: 'roadmapNode',
      position,
      data: {
        label,
        description: shapeConfig?.description || '',
        nodeType,
        onUpdate: (updates) => {
          setNodes(nds => nds.map(n =>
            n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
          ));
        },
        onDelete: () => {
          setNodes(nds => nds.filter(n => n.id !== id));
          setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
        },
        onExpand: () => {
          setExpandTarget({ id, label, description: '' });
          setShowAI(true);
        },
      },
    };

    takeSnapshot();
    setNodes(nds => [...nds, newNode]);
  }, [setNodes, setEdges, takeSnapshot]);

  // Handle drag and drop dari shapes panel
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const shapeData = e.dataTransfer.getData('application/reactflow-shape');
    if (!shapeData) return;

    const shape = JSON.parse(shapeData);
    const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect();
    const rfInstance = reactFlowInstanceRef.current;
    if (!reactFlowBounds || !rfInstance) return;

    const position = rfInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    const id = generateId();
    const newNode = {
      id,
      type: 'roadmapNode',
      position,
      data: {
        label: shape.label,
        description: shape.description || '',
        nodeType: shape.nodeType || 'step',
        onUpdate: (updates) => {
          setNodes(nds => nds.map(n =>
            n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
          ));
        },
        onDelete: () => {
          setNodes(nds => nds.filter(n => n.id !== id));
          setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
        },
        onExpand: () => {
          setExpandTarget({ id, label: shape.label, description: shape.description || '' });
          setShowAI(true);
        },
      },
    };

    takeSnapshot();
    setNodes(nds => [...nds, newNode]);
  }, [setNodes, setEdges, takeSnapshot]);

  // Auto layout
  const handleAutoLayout = useCallback(() => {
    takeSnapshot();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    const withActions = attachNodeActions(layoutedNodes);
    setNodes(withActions);
    setEdges(layoutedEdges);
    toast.success('Layout berhasil diatur!');
  }, [nodes, edges, attachNodeActions, setNodes, setEdges]);

  // AI Chat: Terapkan diagram dari chat ke canvas
  const handleApplyDiagram = useCallback(({ nodes: aiNodes, edges: aiEdges }) => {
    if (!aiNodes || aiNodes.length === 0) return;

    takeSnapshot();
    const newNodes = aiNodes.map(n => ({
      ...n,
      type: 'roadmapNode',
      data: {
        ...n.data,
        onUpdate: (updates) => {
          setNodes(nds => nds.map(nd =>
            nd.id === n.id ? { ...nd, data: { ...nd.data, ...updates } } : nd
          ));
        },
        onDelete: () => {
          setNodes(nds => nds.filter(nd => nd.id !== n.id));
          setEdges(eds => eds.filter(e => e.source !== n.id && e.target !== n.id));
        },
        onExpand: () => {
          setExpandTarget({ id: n.id, label: n.data.label, description: n.data.description });
          setShowAI(true);
        },
      },
    }));

    const newEdges = (aiEdges || []).map(e => ({
      ...e,
      type: currentEdgeType,
      animated: true,
      selectable: true,
      label: e.label || undefined,
      labelStyle: { fill: '#6d28d9', fontWeight: 600, fontSize: 13, fontFamily: 'Inter' },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9, stroke: '#e2e8f0', strokeWidth: 1, rx: 6, ry: 6 },
      labelBgPadding: [8, 4],
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
    }));

    const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
    const withActions = attachNodeActions(layouted);
    setNodes(prev => [...prev, ...withActions]);
    setEdges(prev => [...prev, ...layoutedEdges]);
    toast.success(`${aiNodes.length} node berhasil ditambahkan ke canvas!`);
  }, [setNodes, setEdges, attachNodeActions, currentEdgeType]);

  // Modal Export Diagram
  const handleExportDiagram = useCallback(async () => {
    if (!reactFlowWrapperRef.current) return;
    const { format, transparent } = exportModal;
    
    // Target the react-flow viewport to capture
    const element = reactFlowWrapperRef.current.querySelector('.react-flow');
    if (!element) return;
    
    const filter = (node) => {
      // Exclude minimap, controls, and panels from export
      if (
        node?.classList?.contains('react-flow__minimap') ||
        node?.classList?.contains('react-flow__controls') ||
        node?.classList?.contains('react-flow__panel')
      ) {
        return false;
      }
      return true;
    };

    toast.loading('Mengekspor diagram...', { id: 'export-toast' });
    try {
      let dataUrl;
      const isExportingJPG = format === 'jpg' || format === 'jpeg';
      const bgColor = (transparent && !isExportingJPG) ? null : '#fafafa';

      const options = {
        filter,
        backgroundColor: bgColor,
        style: {
          background: bgColor === null ? 'transparent' : bgColor,
        }
      };

      if (format === 'png') {
        dataUrl = await toPng(element, options);
      } else if (isExportingJPG) {
        dataUrl = await toJpeg(element, { ...options, quality: 0.95 });
      } else if (format === 'svg') {
        dataUrl = await toSvg(element, options);
      }
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${projectName || 'Diagram'}.${format}`;
      a.click();
      
      toast.success('Diagram berhasil diekspor!', { id: 'export-toast' });
      setExportModal({ ...exportModal, isOpen: false });
    } catch (err) {
      toast.error('Gagal mengekspor diagram', { id: 'export-toast' });
      console.error(err);
    }
  }, [exportModal, projectName]);

  // Manual save
  const handleSave = useCallback(async () => {
    setSaving(true);
    await updateProject(projectId, {
      name: projectName,
      nodes_data: nodes,
      edges_data: edges,
    });
    setSaving(false);
    toast.success('Proyek tersimpan!');
  }, [projectId, projectName, nodes, edges, updateProject]);

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="canvas-page">
      {/* Toolbar */}
      <div className="canvas-toolbar">
        <div className="canvas-toolbar-header" style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={() => navigate('/dashboard')}
              title="Kembali ke Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
  
            <div className="toolbar-separator desktop-only" />
  
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px', borderRadius: 'var(--radius-md)' }}>
              <img src="/logo.png" alt="NodeAI Logo" className="desktop-only" style={{ width: 32, height: 32, objectFit: 'contain', marginRight: 4 }} />
              <input
                type="text"
                className="project-name-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => updateProject(projectId, { name: projectName })}
                style={{ fontWeight: 600, fontSize: '14px', maxWidth: '150px' }}
              />
            </div>
            {saving && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
                <div className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
              </span>
            )}
          </div>

          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '12px' }}>
          </div>

          <button 
            className="btn btn-ghost btn-icon btn-sm mobile-only-flex"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className={`canvas-toolbar-dropdown ${mobileMenuOpen ? 'open' : ''}`}>

        <div className="canvas-toolbar-center" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', padding: '3px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <button
              className={`btn btn-sm ${!isSelectMode ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', border: !isSelectMode ? '1px solid var(--border-medium)' : '1px solid transparent', borderRadius: 'inherit', background: !isSelectMode ? '#fff' : 'transparent', boxShadow: !isSelectMode ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}
              onClick={() => setIsSelectMode(false)}
              title="Mode Geser (Pan)"
            >
              <Hand size={14} style={{ marginRight: 6 }} /> Geser
            </button>
            <button
              className={`btn btn-sm ${isSelectMode ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', border: isSelectMode ? '1px solid var(--border-medium)' : '1px solid transparent', borderRadius: 'inherit', background: isSelectMode ? '#fff' : 'transparent', boxShadow: isSelectMode ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}
              onClick={() => setIsSelectMode(true)}
              title="Mode Pilih (Select)"
            >
              <MousePointer2 size={14} style={{ marginRight: 6 }} /> Pilih
            </button>
          </div>

          <button className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-full)', padding: '6px 18px' }} onClick={handleAutoLayout} title="Auto Layout">
            <Layout size={14} style={{ marginRight: 6 }} /> Layout
          </button>
        </div>

        <div className="canvas-toolbar-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
          
          <div className="dropdown-row-2" style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button
              className={`btn btn-sm ${showShapes ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowShapes(!showShapes)}
              style={{ flex: 1, justifyContent: 'center', padding: '8px 12px' }}
            >
              <Shapes size={14} style={{ marginRight: 6 }} /> Bentuk
            </button>

            <button
              className={`btn btn-sm ${showAI ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowAI(!showAI)}
              style={{ flex: 1, justifyContent: 'center', padding: '8px 12px' }}
            >
              <Bot size={14} style={{ marginRight: 6 }} /> AI Chat
            </button>

            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setExportModal(prev => ({ ...prev, isOpen: true }))} 
              style={{ flex: 1, justifyContent: 'center', padding: '8px 12px' }}
            >
              <Download size={14} style={{ marginRight: 6 }} /> Ekspor
            </button>
          </div>

          <div className="toolbar-separator desktop-only" />

          <button className="btn btn-primary btn-sm btn-simpan-mobile" onClick={handleSave} style={{ flex: '1 1 auto', justifyContent: 'center', padding: '10px 16px', fontSize: '14px', borderRadius: 'var(--radius-md)' }}>
            <Save size={16} style={{ marginRight: 6 }} /> Simpan
          </button>
        </div>

        {/* Mobile Undo/Redo dihilangkan karena sudah dipindah ke Controls */}
      </div>
      </div>

      {/* Area utama: [Shapes kiri] — [Canvas tengah] — [AI kanan] */}
      <div className="canvas-body">
        {/* KIRI: Shapes & Lines */}
        <ResizableSidebar
          side="left"
          defaultWidth={280}
          minWidth={240}
          maxWidth={450}
          isOpen={showShapes}
          onToggle={() => setShowShapes(!showShapes)}
          title="Bentuk & Garis"
          icon={<Shapes size={14} />}
        >
          <ShapesPanel
            onAddShape={(shape) => addNode(shape)}
            onSetEdgeType={setCurrentEdgeType}
            currentEdgeType={currentEdgeType}
          />
        </ResizableSidebar>

        {/* TENGAH: Canvas */}
        <div
          className="canvas-container"
          ref={reactFlowWrapperRef}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onNodesDelete={takeSnapshot}
            onEdgesDelete={takeSnapshot}
            onNodeDragStart={takeSnapshot}
            onSelectionDragStart={takeSnapshot}
            onInit={(instance) => { reactFlowInstanceRef.current = instance; }}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            panOnDrag={!isSelectMode}
            selectionOnDrag={isSelectMode}
            selectionMode={SelectionMode.Partial}
            connectionMode={ConnectionMode.Loose}
            deleteKeyCode={['Backspace', 'Delete']}
            defaultEdgeOptions={{
              type: currentEdgeType,
              animated: true,
              selectable: true,
              markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
              style: { stroke: '#8b5cf6', strokeWidth: 2 },
            }}
            proOptions={{ hideAttribution: true }}
            style={{ backgroundColor: '#fafafa' }}
          >
            <Background
              variant={BackgroundVariant.Lines}
              gap={20}
              size={1}
              color="rgba(15, 23, 42, 0.05)"
            />
            <Controls>
              <ControlButton onClick={handleUndo} disabled={past.length === 0} title="Undo (Ctrl+Z)">
                <Undo2 size={16} />
              </ControlButton>
              <ControlButton onClick={handleRedo} disabled={future.length === 0} title="Redo (Ctrl+Y)">
                <Redo2 size={16} />
              </ControlButton>
            </Controls>
            <MiniMap 
              nodeStrokeColor="#8b5cf6" 
              nodeColor="#ffffff"
              maskColor="rgba(240, 240, 240, 0.6)"
              style={{ 
                background: '#ffffff', 
                border: '1px solid var(--border-medium)', 
                borderRadius: '8px', 
                boxShadow: 'var(--shadow-md)' 
              }}
            />
          </ReactFlow>

          {/* Empty State */}
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 5,
            }}>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '48px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                pointerEvents: 'auto',
                maxWidth: 420,
              }}>
                <MousePointer size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                  Canvas Kosong
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
                  Mulai dengan menambah bentuk dari panel kiri, atau minta AI untuk generate roadmap.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowShapes(true)}>
                    <Shapes size={14} /> Buka Bentuk
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAI(true)}>
                    <Sparkles size={14} /> Chat dengan AI
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KANAN: AI Assistant (Chatbot) */}
        <ResizableSidebar
          side="right"
          defaultWidth={380}
          minWidth={300}
          maxWidth={600}
          isOpen={showAI}
          onToggle={() => setShowAI(!showAI)}
          title="AI Assistant"
          icon={<Bot size={14} />}
        >
          <AIPanel
            onApplyDiagram={handleApplyDiagram}
            existingNodes={nodes}
          />
        </ResizableSidebar>

        {/* Modal Teks Garis Custom */}
        {edgePrompt.isOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
                {edgePrompt.params ? 'Keterangan Garis (Opsional)' : 'Ubah Keterangan Garis'}
              </h3>
              <input
                type="text"
                autoFocus
                className="input-field"
                placeholder="Misal: Ya, Tidak, Benar, Salah..."
                value={edgePrompt.label}
                onChange={(e) => setEdgePrompt(prev => ({ ...prev, label: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleEdgePromptSubmit()}
                style={{ width: '100%', padding: '10px 14px', marginBottom: '20px', background: '#f9fafb', border: '1px solid #d1d5db' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                {edgePrompt.edgeId && (
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteEdge}
                    style={{ marginRight: 'auto', whiteSpace: 'nowrap', padding: '10px 16px' }}
                  >
                    Hapus Garis
                  </button>
                )}
                <button
                  className="btn btn-ghost"
                  onClick={() => setEdgePrompt({ isOpen: false, label: '', edgeId: null, params: null })}
                  style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}
                >
                  Batal
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleEdgePromptSubmit}
                  style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ekspor Diagram */}
        {exportModal.isOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
                Ekspor Diagram
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: '#374151' }}>Format Gambar / File</label>
                <select 
                  value={exportModal.format} 
                  onChange={(e) => setExportModal(prev => ({ ...prev, format: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="svg">SVG</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                  <input 
                    type="checkbox" 
                    checked={exportModal.transparent} 
                    onChange={(e) => setExportModal(prev => ({ ...prev, transparent: e.target.checked }))} 
                    disabled={exportModal.format === 'jpg' || exportModal.format === 'jpeg'}
                  />
                  Background Transparan {(exportModal.format === 'jpg' || exportModal.format === 'jpeg') ? '(Khusus PNG/SVG)' : ''}
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setExportModal(prev => ({ ...prev, isOpen: false }))}
                >
                  Batal
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleExportDiagram}
                >
                  Ekspor Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
