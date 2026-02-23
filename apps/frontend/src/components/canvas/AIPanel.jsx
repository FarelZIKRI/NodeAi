import { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, Loader2, Sparkles, Map, Plus, Trash2
} from 'lucide-react';

export default function AIPanel({ onApplyDiagram, existingNodes }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Halo! Saya AI Assistant untuk membantu membuat roadmap dan diagram.\n\nKamu bisa meminta saya untuk:\n• **Buatkan roadmap** belajar topik apapun\n• **Jelaskan** langkah-langkah suatu proses\n• **Expand** atau tambahkan detail pada diagram\n\nCoba ketik pesan, misalnya:\n"Buatkan roadmap belajar React.js untuk pemula"',
      hasDiagram: false,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Tambah pesan user
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { chatWithAI } = await import('../../services/aiService');

      const chatHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const nodeLabels = existingNodes
        ? existingNodes.map(n => n.data?.label).filter(Boolean)
        : [];

      const result = await chatWithAI({
        message: text,
        chatHistory,
        existingNodes: nodeLabels,
      });

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.reply || result.message || 'Maaf, pesan kosong.', // Gunakan result.reply sesuai API backend
        hasDiagram: result.hasDiagram,
        nodes: result.nodes,
        edges: result.edges,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Maaf, terjadi kesalahan: ${err.message}`,
        hasDiagram: false,
      };
      setMessages(prev => [...prev, errorMsg]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleApplyDiagram = (msg) => {
    if (msg.hasDiagram && msg.nodes && msg.edges && onApplyDiagram) {
      onApplyDiagram({ nodes: msg.nodes, edges: msg.edges });
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: '🗑️ Riwayat chat dibersihkan.\n\nSilakan mulai percakapan baru! Ketik pesan untuk memulai.',
      hasDiagram: false,
    }]);
  };

  // Contoh pertanyaan cepat
  const quickPrompts = [
    { label: '🗺️ Roadmap React.js', text: 'Buatkan roadmap belajar React.js untuk pemula' },
    { label: '📊 Diagram Login', text: 'Buatkan diagram alur proses login user' },
    { label: '🚀 Belajar Backend', text: 'Buatkan roadmap belajar backend development' },
  ];

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="sidebar-panel-header" style={{ justifyContent: 'center', position: 'relative' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={16} style={{ color: 'var(--accent-purple-light)' }} />
          AI Assistant
        </h3>
        <button
          className="btn btn-ghost btn-icon btn-sm"
          onClick={clearChat}
          title="Bersihkan chat"
          style={{ padding: 6, position: 'absolute', right: 16 }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message chat-message-${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="chat-avatar chat-avatar-ai">
                <Bot size={14} />
              </div>
            )}

            <div className={`chat-bubble chat-bubble-${msg.role}`}>
              {/* Render teks dengan markdown sederhana */}
              <div
                className="chat-text"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(msg.content)
                }}
              />

              {/* Tombol terapkan diagram */}
              {msg.hasDiagram && msg.nodes && msg.nodes.length > 0 && (
                <button
                  className="chat-apply-btn"
                  onClick={() => handleApplyDiagram(msg)}
                >
                  <Plus size={14} />
                  Terapkan ke Canvas ({msg.nodes.length} node)
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="chat-avatar chat-avatar-user">
                <span>U</span>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="chat-message chat-message-assistant">
            <div className="chat-avatar chat-avatar-ai">
              <Bot size={14} />
            </div>
            <div className="chat-bubble chat-bubble-assistant">
              <div className="chat-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts (hanya tampil jika belum ada pesan selain welcome) */}
      {messages.length <= 1 && !loading && (
        <div className="chat-quick-prompts">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              className="chat-quick-btn"
              onClick={() => { setInput(prompt.text); inputRef.current?.focus(); }}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ketik pesan... (contoh: Buatkan roadmap belajar Python)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Format teks sederhana: bold, italic, bullet points, line breaks
 */
function formatMessage(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^• (.*)/gm, '<span class="chat-bullet">• $1</span>')
    .replace(/\n/g, '<br/>');
}
