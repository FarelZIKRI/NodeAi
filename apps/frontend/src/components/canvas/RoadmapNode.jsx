import { memo, useState } from 'react';
import { Handle, Position, NodeResizer, useStore } from '@xyflow/react';
import { Sparkles, Trash2, Edit3, Check, X } from 'lucide-react';

const connectionNodeIdSelector = (state) => state.connectionNodeId;

/**
 * Node universal yang merender bentuk visual berbeda berdasarkan data.nodeType
 * Shapes: rectangle/step, circle/topic, diamond/decision, hexagon/resource,
 *         triangle/warning, substep, start_end
 */
function RoadmapNode({ data, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label || '');
  const [editDescription, setEditDescription] = useState(data.description || '');

  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isConnecting = !!connectionNodeId;

  const handleSave = () => {
    if (data.onUpdate) {
      data.onUpdate({ label: editLabel, description: editDescription });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(data.label || '');
    setEditDescription(data.description || '');
    setIsEditing(false);
  };

  const nodeType = data.nodeType || 'step';

  // Warna berdasarkan tipe
  const typeConfig = {
    start_end: { color: '#6d28d9', bg: '#f5f3ff', border: '#c4b5fd', label: 'Mulai/Selesai' },
    topic:    { color: '#6d28d9', bg: '#f5f3ff', border: '#c4b5fd', label: 'Topik' },
    step:     { color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd', label: 'Langkah' },
    substep:  { color: '#0e7490', bg: '#ecfeff', border: '#67e8f9', label: 'Sub-langkah' },
    resource: { color: '#047857', bg: '#ecfdf5', border: '#6ee7b7', label: 'Resource' },
    decision: { color: '#c2410c', bg: '#fff7ed', border: '#fdba74', label: 'Keputusan' },
    warning:  { color: '#b91c1c', bg: '#fef2f2', border: '#fca5a5', label: 'Peringatan' },
    text:     { color: '#475569', bg: 'transparent', border: 'transparent', label: '' },
    default:  { color: '#6d28d9', bg: '#f5f3ff', border: '#c4b5fd', label: 'Node' },
  };

  const config = typeConfig[nodeType] || typeConfig.default;

  // Tentukan shape CSS class
  const getShapeClass = () => {
    switch (nodeType) {
      case 'topic':
      case 'start_end':
        return 'shape-circle';
      case 'decision':
        return 'shape-diamond';
      case 'resource':
        return 'shape-hexagon';
      case 'warning':
        return 'shape-triangle';
      case 'substep':
        return 'shape-rounded';
      case 'text':
        return 'shape-text';
      case 'step':
      default:
        return 'shape-rectangle';
    }
  };

  const shapeClass = getShapeClass();

  // Actions (edit, expand, delete)
  const renderActions = () => {
    if (isEditing) return null;
    return (
      <div className="shape-node-actions">
        <button
          className="node-action-btn"
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          title="Edit"
        >
          <Edit3 size={11} />
        </button>
        {data.onExpand && (
          <button
            className="node-action-btn"
            onClick={(e) => { e.stopPropagation(); data.onExpand(); }}
            title="Expand dengan AI"
            style={{ color: 'var(--accent-purple-light)' }}
          >
            <Sparkles size={11} />
          </button>
        )}
        {data.onDelete && (
          <button
            className="node-action-btn"
            onClick={(e) => { e.stopPropagation(); data.onDelete(); }}
            title="Hapus"
            style={{ color: '#f87171' }}
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <NodeResizer 
        color="#8b5cf6" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={60} 
        handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
      />
      <div
        className={`shape-node ${shapeClass} ${selected ? 'selected' : ''} ${isConnecting ? 'is-connecting' : ''}`}
        style={{
          '--shape-color': config.color,
          '--shape-bg': config.bg,
          '--shape-border': config.border,
          width: '100%',
          height: '100%', 
          minHeight: '100%',
        }}
      >
        {/* Handles - Semua sisi (karena ConnectionMode.Loose, bisa jadi source & target) */}
        <Handle type="source" position={Position.Top} id="top" className="shape-handle" />
        <Handle type="source" position={Position.Right} id="right" className="shape-handle" />
        <Handle type="source" position={Position.Bottom} id="bottom" className="shape-handle" />
        <Handle type="source" position={Position.Left} id="left" className="shape-handle" />

        {/* Shape Background Layer (untuk diamond, hexagon, triangle) */}
        {(shapeClass === 'shape-diamond' || shapeClass === 'shape-hexagon' || shapeClass === 'shape-triangle') && (
          <div className="shape-bg-layer" />
        )}

        {/* Konten Node */}
        <div className="shape-node-content" style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          {/* Badge tipe */}
          {config.label && (
            <span className="shape-type-badge" style={{ 
              background: '#ffffff', 
              color: config.color,
              border: `1px solid ${config.border}`,
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              padding: '2px 10px'
            }}>
              {config.label}
            </span>
          )}

          {/* Actions */}
          {renderActions()}

          {/* Body */}
          <div className="shape-node-body">
            {isEditing ? (
              <div className="shape-edit-form">
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="input-field"
                  style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                  placeholder="Judul node"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input-field textarea-field"
                  style={{ padding: '6px 10px', fontSize: '0.75rem', minHeight: 40 }}
                  placeholder="Deskripsi (opsional)"
                  onClick={(e) => e.stopPropagation()}
                />
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  <button
                    className="node-action-btn"
                    onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                    style={{ color: '#f87171' }}
                  >
                    <X size={12} /> Batal
                  </button>
                  <button
                    className="node-action-btn"
                    onClick={(e) => { e.stopPropagation(); handleSave(); }}
                    style={{ color: 'var(--accent-green)' }}
                  >
                    <Check size={12} /> Simpan
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="shape-node-label">{data.label}</div>
                {data.description && (
                  <div className="shape-node-desc">{data.description}</div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default memo(RoadmapNode);
