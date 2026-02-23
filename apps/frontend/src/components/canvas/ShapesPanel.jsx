import { useState } from 'react';
import {
  Square, Circle, Diamond, Hexagon, Triangle,
  Minus, Spline, GitBranch,
  Shapes, Type
} from 'lucide-react';

const shapeCategories = [
  {
    id: 'basic',
    label: 'Bentuk Dasar',
    shapes: [
      { id: 'rectangle', label: 'Persegi Panjang', icon: <Square size={22} />, nodeType: 'step', description: 'Langkah proses standar' },
      { id: 'circle', label: 'Lingkaran', icon: <Circle size={22} />, nodeType: 'topic', description: 'Titik awal/akhir' },
      { id: 'diamond', label: 'Belah Ketupat', icon: <Diamond size={22} />, nodeType: 'decision', description: 'Titik keputusan Ya/Tidak' },
      { id: 'hexagon', label: 'Segi Enam', icon: <Hexagon size={22} />, nodeType: 'resource', description: 'Sumber daya/referensi' },
      { id: 'triangle', label: 'Segitiga', icon: <Triangle size={22} />, nodeType: 'warning', description: 'Peringatan/catatan penting' },
      { id: 'text', label: 'Teks Bebas', icon: <Type size={22} />, nodeType: 'text', description: 'Teks tanpa bingkai' },
    ],
  },
  {
    id: 'flowchart',
    label: 'Diagram Alur',
    shapes: [
      { id: 'process', label: 'Proses', icon: <Square size={22} />, nodeType: 'step', description: 'Langkah proses standar' },
      { id: 'decision_flow', label: 'Keputusan', icon: <Diamond size={22} />, nodeType: 'decision', description: 'Titik percabangan' },
      { id: 'start_end', label: 'Mulai/Selesai', icon: <Circle size={22} />, nodeType: 'topic', description: 'Titik terminal' },
      { id: 'substep', label: 'Sub-proses', icon: <Square size={22} style={{ borderRadius: 6 }} />, nodeType: 'substep', description: 'Langkah detail' },
      { id: 'resource_ref', label: 'Referensi', icon: <Hexagon size={22} />, nodeType: 'resource', description: 'Sumber belajar' },
    ],
  },
];

const edgeTypes = [
  { id: 'smoothstep', label: 'Smooth Step', icon: <Spline size={18} />, description: 'Sudut melengkung' },
  { id: 'straight', label: 'Garis Lurus', icon: <Minus size={18} />, description: 'Garis langsung' },
  { id: 'step', label: 'Step', icon: <GitBranch size={18} />, description: 'Sudut siku-siku' },
  { id: 'bezier', label: 'Bezier', icon: <Spline size={18} />, description: 'Garis melengkung' },
];

export default function ShapesPanel({ onAddShape, onSetEdgeType, currentEdgeType }) {
  const [activeCategory, setActiveCategory] = useState('basic');
  const [hoveredShape, setHoveredShape] = useState(null);

  const handleDragStart = (e, shape) => {
    e.dataTransfer.setData('application/reactflow-shape', JSON.stringify(shape));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="shapes-panel-content">
      {/* Header */}
      <div className="sidebar-panel-header">
        <h3>
          <Shapes size={16} style={{ color: 'var(--accent-cyan)' }} />
          Bentuk & Garis
        </h3>
      </div>

      <div className="shapes-panel-body">
        {/* Category Tabs */}
        <div className="shapes-category-tabs">
          {shapeCategories.map(cat => (
            <button
              key={cat.id}
              className={`shapes-category-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Shapes Grid */}
        <div className="shapes-section">
          <div className="shapes-grid">
            {shapeCategories
              .find(c => c.id === activeCategory)
              ?.shapes.map(shape => (
                <div
                  key={shape.id}
                  className={`shape-item ${hoveredShape === shape.id ? 'hovered' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, shape)}
                  onClick={() => onAddShape && onAddShape(shape)}
                  onMouseEnter={() => setHoveredShape(shape.id)}
                  onMouseLeave={() => setHoveredShape(null)}
                  title={shape.description || shape.label}
                >
                  <div className="shape-item-icon">{shape.icon}</div>
                  <span className="shape-item-label">{shape.label}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Divider */}
        <div className="shapes-divider">
          <span>Garis & Koneksi</span>
        </div>

        {/* Edge Types */}
        <div className="shapes-section">
          <div className="edge-types-list">
            {edgeTypes.map(edge => (
              <button
                key={edge.id}
                className={`edge-type-item ${currentEdgeType === edge.id ? 'active' : ''}`}
                onClick={() => onSetEdgeType && onSetEdgeType(edge.id)}
              >
                <div className="edge-type-icon">{edge.icon}</div>
                <div className="edge-type-info">
                  <span className="edge-type-label">{edge.label}</span>
                  <span className="edge-type-desc">{edge.description}</span>
                </div>
                {currentEdgeType === edge.id && (
                  <div className="edge-type-active-dot" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="shapes-tips">
          <div className="shapes-tip">
            <span className="tip-icon">💡</span>
            <span>Drag bentuk ke canvas atau klik untuk menambahkan</span>
          </div>
          <div className="shapes-tip">
            <span className="tip-icon">🔗</span>
            <span>Drag dari handle node untuk membuat koneksi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
