import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

function AestheticNode({ data }) {
  return (
    <div className="aesthetic-node" style={{
      padding: '12px 24px',
      borderRadius: '24px',
      background: data.bg || '#ffffff',
      color: data.color || '#333333',
      border: `2px solid ${data.border || '#e5e7eb'}`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      fontFamily: 'var(--font-family)',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '130px',
      justifyContent: 'center',
      cursor: 'grab',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      {data.icon && <span style={{ fontSize: '18px' }}>{data.icon}</span>}
      <span>{data.label}</span>

      {/* Invisible Handles so edges can connect smoothly */}
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

export default memo(AestheticNode);
