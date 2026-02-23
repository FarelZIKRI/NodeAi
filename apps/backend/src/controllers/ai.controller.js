import { aiService } from '../services/ai.service.js';

/**
 * AIController — Menangani request/response HTTP untuk modul AI.
 */
export class AIController {
  /**
   * POST /api/ai/generate-roadmap
   */
  async generateRoadmap(req, res, next) {
    try {
      const { topic, level, goal } = req.body;
      const result = await aiService.generateRoadmap({ topic, level, goal });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/expand-node
   */
  async expandNode(req, res, next) {
    try {
      const { nodeLabel, nodeDescription, existingNodes } = req.body;
      const result = await aiService.expandNode({ nodeLabel, nodeDescription, existingNodes });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/convert-text
   */
  async convertText(req, res, next) {
    try {
      const { text } = req.body;
      const result = await aiService.convertTextToDiagram(text);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/chat
   */
  async chat(req, res, next) {
    try {
      const { message, chatHistory, existingNodes } = req.body;
      const result = await aiService.chat({ message, chatHistory, existingNodes });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
