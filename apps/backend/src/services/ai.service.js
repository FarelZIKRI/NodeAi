import { generateObject, generateText, tool } from 'ai';

import { z } from 'zod';
import { env } from '../config/env.js';

/**
 * AIService — Kelas layanan untuk semua operasi AI.
 * Menggunakan Vercel AI SDK dengan OpenAI sebagai model.
 */

import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: env.GROQ_API_KEY, // Menggunakan key Groq
});

const model = groq('llama-3.3-70b-versatile');

// Schema Zod untuk output terstruktur (nodes & edges)
const diagramSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string().describe('ID unik node, contoh: node-1'),
      type: z.string().describe("Selalu isi dengan string 'default'"),
      data: z.object({
        label: z.string().describe('Judul atau nama dari langkah tersebut'),
        description: z.string().describe('Deskripsi singkat tentang node tersebut'),
      }),
      position: z.object({
        x: z.number().describe('Posisi koordinat X di canvas'),
        y: z.number().describe('Posisi koordinat Y di canvas, buat berjarak 100-150px ke bawah untuk setiap node'),
      }),
    })
  ).describe('Daftar node/langkah. Wajib berupa array of object lengkap (id, type, data, position).'),
  edges: z.array(
    z.object({
      id: z.string().describe('ID unik edge, contoh: edge-1'),
      source: z.string().describe('ID node awal'),
      target: z.string().describe('ID node tujuan'),
      label: z.string().describe("Label koneksi, isi dengan string kosong '' jika tidak ada"),
    })
  ).describe('Daftar garis penghubung antar node.'),
});

export class AIService {
  /**
   * Generate roadmap diagram dari topik, level, dan goal.
   * @param {{ topic: string, level: string, goal: string }} params
   * @returns {Promise<{ nodes: Array, edges: Array }>}
   */
  async generateRoadmap({ topic, level, goal }) {
    const { object } = await generateObject({
      model,
      schema: diagramSchema,
      prompt: `Kamu adalah ahli pembuat roadmap belajar.
Buatkan roadmap dalam format diagram nodes dan edges untuk topik: "${topic}".
Level pengguna: ${level}.
Tujuan akhir: ${goal}.

Aturan penting:
- Buat 6-12 node yang masing-masing mewakili tahap belajar.
- Setiap node harus punya id unik (misal "node-1", "node-2", dst).
- Sertakan label (judul) dan description (Bisa menggunakan \\n untuk baris baru atau paragraf).
- Gunakan "nodeType" ("start_end", "step", "decision", "resource", "warning", "topic", atau "text").
- Atur posisi (x, y) secara logis dari atas ke bawah atau bercabang.
- Hubungkan node-node dengan edges. Berikan "label" garis (misal "Lanjut", "Ya", "Tidak") jika perlu.
- Edge id bisa berupa "edge-1", "edge-2", dst.`,
    });

    return object;
  }

  /**
   * Expand / perluas sebuah node menjadi sub-nodes yang lebih detail.
   * @param {{ nodeLabel: string, nodeDescription: string, existingNodes: Array }} params
   * @returns {Promise<{ nodes: Array, edges: Array }>}
   */
  async expandNode({ nodeLabel, nodeDescription, existingNodes }) {
    const { object } = await generateObject({
      model,
      schema: diagramSchema,
      prompt: `Kamu adalah ahli pembuat roadmap belajar.
Saya sudah punya node dengan judul: "${nodeLabel}" dan deskripsi: "${nodeDescription}".

Berikut adalah node-node yang sudah ada dalam diagram:
${JSON.stringify(existingNodes.map((n) => n.data?.label || n.label), null, 2)}

Tolong pecah node "${nodeLabel}" menjadi 3-6 sub-langkah yang lebih detail.
- Setiap sub-node harus punya id unik yang TIDAK bertabrakan dengan node yang sudah ada.
- Hubungkan sub-node secara berurutan dengan edges.
- Atur posisi (x, y) agar tersusun rapi secara vertikal.`,
    });

    return object;
  }

  /**
   * Konversi teks bebas menjadi diagram nodes & edges.
   * @param {string} text
   * @returns {Promise<{ nodes: Array, edges: Array }>}
   */
  async convertTextToDiagram(text) {
    const { object } = await generateObject({
      model,
      schema: diagramSchema,
      prompt: `Kamu adalah ahli konversi teks menjadi diagram alur.
Konversikan teks berikut menjadi sebuah diagram alur (flowchart) yang terdiri dari nodes dan edges:

"""
${text}
"""

Aturan:
- Buat node untuk setiap konsep atau langkah utama.
- Hubungkan node-node tersebut dengan edges yang logis.
- Sertakan label dan deskripsi untuk setiap node.
- Atur posisi agar rapi secara vertikal.`,
    });

    return object;
  }

  /**
   * Chat dengan AI Assistant — memahami konteks diagram pengguna.
   * @param {{ message: string, chatHistory: Array, existingNodes: Array }} params
   * @returns {Promise<{ reply: string }>}
   */
  async chat({ message, chatHistory, existingNodes }) {
    const systemPrompt = `Kamu adalah AI assistant yang bertugas membantu pengguna mengembangkan roadmap/diagram.

Diagram pengguna saat ini:
${JSON.stringify(existingNodes.map((n) => n.data?.label || n.label), null, 2)}

ATURAN PENTING GENERASI DIAGRAM:
Jika pengguna meminta dibuatkan "diagram", "alur", "roadmap", atau "langkah-langkah":
1. Jawablah pembicaraan dengan ramah dan bahasa Indonesia.
2. DI AKHIR PESANMU, kamu WAJIB memberikan rancangan diagram dalam sebuah blok kode JSON Markdown.

Bentuk diagram harus MENCERMINKAN MAKNANYA. Kamu HARUS menambahkan property "nodeType" ke dalam object "data" dengan pilihan berikut:
- "start_end" (Mulai/Selesai) -> Lingkaran/Elips
- "step" (Proses umum) -> Persegi Panjang
- "decision" (Keputusan/Percabangan Ya/Tidak) -> Belah Ketupat (Diamond)
- "resource" (Data/Input/Output) -> Segienam (Hexagon)
- "warning" (Peringatan/Bahaya) -> Segitiga
- "topic" (Topik besar) -> Lingkaran (Mirip start_end)
- "text" (Teks Bebas / Catatan melayang) -> Tanpa bingkai/Teks menyatu kanvas

Dan pada bagian "description" di dalam "data", kamu BISA DAN BOLEH menggunakan karakter "\\n" untuk membuat baris baru (line break) atau memberikan spasi paragraf agar teks lebih mudah dibaca.

Gunakan format persis seperti ini:
\`\`\`json
{
  "nodes": [
    { "id": "1", "type": "default", "data": { "label": "Mulai", "description": "Titik awal", "nodeType": "start_end" }, "position": { "x": 0, "y": 0 } },
    { "id": "2", "type": "default", "data": { "label": "Langkah 1", "description": "Lakukan X\\nPastikan berhasil.", "nodeType": "step" }, "position": { "x": 0, "y": 150 } },
    { "id": "3", "type": "default", "data": { "label": "Apakah Valid?", "description": "Cek sesuatu", "nodeType": "decision" }, "position": { "x": 0, "y": 300 } },
    { "id": "4", "type": "default", "data": { "label": "", "description": "Ini catatan melayang", "nodeType": "text" }, "position": { "x": 150, "y": 40 } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "label": "Lanjut" },
    { "id": "e2-3", "source": "2", "target": "3", "label": "Cek Ulang" }
  ]
}
\`\`\`

- Berikan "label" pada array list "edges" (contoh: "Lanjut", "Ya", "Tidak", atau kosong "" jika tidak perlu) untuk menamai garis penghubungnya agar pengguna mengerti logikanya.
- Sumbu Y setiap node HARUS bertambah. Jika bercabang, buat X ke sisi kiri/kanan.
- HARUS menggunakan tag kode markdown \`\`\`json
- Ingat: jangan memanggil functions, hasilkan teks langsung ya!`;

    // Filter dan map chat history untuk memastikan tidak ada pesan kosong/undfined
    const formattedHistory = (chatHistory || [])
      .filter((msg) => msg.content && typeof msg.content === 'string')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user', // normalisasi role
        content: msg.content,
      }));

    const messages = [
      ...formattedHistory,
      { role: 'user', content: message },
    ];

    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages,
    });

    let reply = text || '';
    let hasDiagram = false;
    let nodes = [];
    let edges = [];

    // Ekstrak JSON dari dalam markdown response (regex)
    const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.nodes && parsed.edges) {
          hasDiagram = true;
          nodes = parsed.nodes || [];
          edges = parsed.edges || [];
          
          // Hapus kode JSON dari string agar tidak tampil ke pengguna di chat bubble
          reply = reply.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
          
          if (!reply) {
            reply = "Diagram berhasil saya rancang! Silakan klik tombol **Terapkan ke Canvas** di bawah ini.";
          }
        }
      } catch (err) {
        console.error('Gagal mem-parsing JSON dari AI:', err);
      }
    }

    return { reply, hasDiagram, nodes, edges };
  }
}

export const aiService = new AIService();
