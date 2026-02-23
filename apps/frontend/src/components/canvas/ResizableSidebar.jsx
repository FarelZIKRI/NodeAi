import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

export default function ResizableSidebar({
  children,
  side = 'left', // 'left' or 'right'
  defaultWidth = 340,
  minWidth = 260,
  maxWidth = 600,
  isOpen,
  onToggle,
  title,
  icon,
}) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;

    const delta = e.clientX - startXRef.current;
    let newWidth;

    if (side === 'left') {
      newWidth = startWidthRef.current + delta;
    } else {
      newWidth = startWidthRef.current - delta;
    }

    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(newWidth);
  }, [isResizing, side, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Toggle Button (visible when sidebar is closed) */}
      {!isOpen && (
        <button
          className={`sidebar-toggle-btn sidebar-toggle-${side}`}
          onClick={onToggle}
          title={title}
        >
          {side === 'left' ? (
            <>
              {icon}
              <ChevronRight size={14} />
            </>
          ) : (
            <>
              <ChevronLeft size={14} />
              {icon}
            </>
          )}
        </button>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`resizable-sidebar resizable-sidebar-${side} ${isOpen ? 'open' : 'closed'} ${isResizing ? 'resizing' : ''}`}
        style={{
          width: isOpen ? width : 0,
          minWidth: isOpen ? minWidth : 0,
        }}
      >
        {isOpen && (
          <>
            {/* Resize Handle */}
            <div
              className={`resize-handle resize-handle-${side}`}
              onMouseDown={handleMouseDown}
            >
              <div className="resize-handle-line" />
            </div>

            {/* Close Button inside sidebar */}
            <button
              className={`sidebar-close-btn sidebar-close-${side}`}
              onClick={onToggle}
              title="Tutup"
            >
              {side === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Content */}
            <div className="sidebar-content">
              {children}
            </div>
          </>
        )}
      </div>
    </>
  );
}
