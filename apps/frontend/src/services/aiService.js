/**
 * AI Service - Menangani panggilan ke API AI
 * Menghasilkan structured output (nodes & edges) dari AI
 */

const API_BASE = '/api/ai';

/**
 * Generate roadmap dari topik, level, dan goal
 */
export async function generateRoadmap({ topic, level, goal }) {
  try {
    const res = await fetch(`${API_BASE}/generate-roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ topic, level, goal }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal generate roadmap');
    }

    return await res.json();
  } catch (error) {
    console.error('generateRoadmap error:', error);
    throw error;
  }
}

/**
 * Expand node — menambahkan child nodes detail
 */
export async function expandNode({ nodeLabel, nodeDescription, existingNodes }) {
  try {
    const res = await fetch(`${API_BASE}/expand-node`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nodeLabel, nodeDescription, existingNodes }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal expand node');
    }

    return await res.json();
  } catch (error) {
    console.error('expandNode error:', error);
    throw error;
  }
}

/**
 * Convert text ke diagram nodes & edges
 */
export async function convertTextToDiagram(text) {
  try {
    const res = await fetch(`${API_BASE}/convert-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal konversi teks');
    }

    return await res.json();
  } catch (error) {
    console.error('convertTextToDiagram error:', error);
    throw error;
  }
}

/**
 * Chat dengan AI Assistant
 */
export async function chatWithAI({ message, chatHistory, existingNodes }) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ message, chatHistory, existingNodes }),
    });

    if (!res.ok) {
      let errorMessage = 'Gagal mengirim pesan';
      try {
        const err = await res.json();
        errorMessage = err.error || errorMessage;
      } catch (e) {
        // If JSON parse fails, try text
        const text = await res.text().catch(() => '');
        errorMessage = `${errorMessage} (${res.status} ${res.statusText}): ${text}`;
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    console.error('chatWithAI error:', error);
    throw error;
  }
}

