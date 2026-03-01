import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useHeroFlowStore } from '../../store/heroFlowStore';

export const TopicNode = memo(() => {
  const topic = useHeroFlowStore((s) => s.topic);
  const setTopic = useHeroFlowStore((s) => s.setTopic);

  return (
    <div className="rf-node-panel">
      <div className="rf-node-panel-header">Topik Diagram</div>
      <div className="rf-node-panel-body" style={{ gap: '8px' }}>
        <input 
          type="text" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="Ketik topik..."
          style={{ 
            width: '100%', 
            padding: '6px 8px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '6px',
            fontSize: '12px',
            outline: 'none',
            color: '#374151'
          }}
        />
      </div>
      <Handle type="source" position={Position.Right} style={{ top: '50%', background: '#9ca3af', width: 8, height: 8 }} />
    </div>
  );
});

export const LevelNode = memo(() => {
  const level = useHeroFlowStore((s) => s.level);
  const setLevel = useHeroFlowStore((s) => s.setLevel);

  const levels = ['Pemula', 'Menengah', 'Mahir'];

  return (
    <div className="rf-node-panel">
      <div className="rf-node-panel-header">Tingkat Kesulitan</div>
      <div className="rf-node-panel-body" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        {levels.map(l => (
          <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', color: '#4b5563' }}>
            <input 
              type="radio" 
              checked={level === l} 
              onChange={() => setLevel(l)} 
              style={{ accentColor: 'var(--accent-purple)' }} 
            />
            {l}
          </label>
        ))}
      </div>
      <Handle type="source" position={Position.Right} style={{ top: '50%', background: '#9ca3af', width: 8, height: 8 }} />
    </div>
  );
});

export const LayoutNode = memo(() => {
  const layout = useHeroFlowStore((s) => s.layout);
  const setLayout = useHeroFlowStore((s) => s.setLayout);

  return (
    <div className="rf-node-panel">
      <div className="rf-node-panel-header">Layout Mode</div>
      <div className="rf-node-panel-body" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        {['Horizontal', 'Vertical'].map(l => (
          <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', color: '#4b5563' }}>
            <input 
              type="radio" 
              checked={layout === l} 
              onChange={() => setLayout(l)} 
              style={{ accentColor: 'var(--accent-purple)' }} 
            />
            {l}
          </label>
        ))}
      </div>
      <Handle type="source" position={Position.Right} style={{ top: '50%', background: '#9ca3af', width: 8, height: 8 }} />
    </div>
  );
});

const diagrams = {
  Pemula: [
    { id: 1, x: 20, y: 50 },
    { id: 2, x: 50, y: 50, parent: 1 },
    { id: 3, x: 80, y: 50, parent: 2 },
  ],
  Menengah: [
    { id: 1, x: 20, y: 50 },
    { id: 2, x: 45, y: 50, parent: 1 },
    { id: 3, x: 75, y: 25, parent: 2 },
    { id: 4, x: 75, y: 75, parent: 2 },
  ],
  Mahir: [
    { id: 1, x: 15, y: 50 },
    { id: 2, x: 40, y: 25, parent: 1 },
    { id: 3, x: 40, y: 75, parent: 1 },
    { id: 4, x: 70, y: 15, parent: 2 },
    { id: 5, x: 70, y: 35, parent: 2 },
    { id: 6, x: 70, y: 65, parent: 3 },
    { id: 7, x: 70, y: 85, parent: 3 },
  ]
};

export const OutputNode = memo(() => {
  const topic = useHeroFlowStore((s) => s.topic);
  const level = useHeroFlowStore((s) => s.level);
  const layout = useHeroFlowStore((s) => s.layout);

  const nodes = diagrams[level] || diagrams.Pemula;

  return (
    <div className="rf-node-panel rf-output-panel" style={{ width: '400px' }}>
      <div className="rf-node-panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Preview Roadmap</span>
        <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>{topic || '...'}</span>
      </div>
      <div className="rf-output-body" style={{ background: '#f8fafc', borderRadius: '0 0 12px 12px', position: 'relative' }}>
        
        {/* Connection Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {nodes.map(n => {
            if (!n.parent) return null;
            const parent = nodes.find(p => p.id === n.parent);
            if (!parent) return null;

            const x1 = layout === 'Vertical' ? parent.y : parent.x;
            const y1 = layout === 'Vertical' ? parent.x : parent.y;
            const x2 = layout === 'Vertical' ? n.y : n.x;
            const y2 = layout === 'Vertical' ? n.x : n.y;

            return (
              <line 
                key={`line-${n.id}`} 
                x1={`${x1}%`} 
                y1={`${y1}%`} 
                x2={`${x2}%`} 
                y2={`${y2}%`} 
                stroke="var(--border-medium)" 
                strokeWidth="2"
                style={{ transition: 'all 0.5s ease' }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(n => {
          const left = layout === 'Vertical' ? n.y : n.x;
          const top = layout === 'Vertical' ? n.x : n.y;

          return (
            <div 
              key={`node-${n.id}`} 
              style={{
                position: 'absolute',
                left: `calc(${left}% - 24px)`,
                top: `calc(${top}% - 14px)`,
                width: '48px',
                height: '28px',
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Fake text lines for realism */}
              <div style={{ width: '24px', height: '4px', background: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
            </div>
          );
        })}

      </div>

      <Handle type="target" position={Position.Left} id="in1" style={{ top: '20%', background: '#9ca3af', width: 8, height: 8 }} />
      <Handle type="target" position={Position.Left} id="in2" style={{ top: '50%', background: '#9ca3af', width: 8, height: 8 }} />
      <Handle type="target" position={Position.Left} id="in3" style={{ top: '80%', background: '#9ca3af', width: 8, height: 8 }} />
    </div>
  );
});
