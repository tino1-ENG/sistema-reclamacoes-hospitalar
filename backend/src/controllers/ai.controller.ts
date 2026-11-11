import type { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';
import { Process } from '../models/Process.js';
import { Department } from '../models/Department.js';
import { Category } from '../models/Category.js';

export class AIController {
  async getStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = await aiService.getStatus();
      res.json({ success: true, data: status });
    } catch (err) {
      next(err);
    }
  }

  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId, message } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ success: false, message: 'A mensagem é obrigatória.' });
        return;
      }

      const activeSessionId = sessionId || `anon-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const userId = req.user?.id;

      const result = await aiService.chatWithAssistant(activeSessionId, message, userId);
      res.json({
        success: true,
        data: {
          sessionId: activeSessionId,
          ...result
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async summarize(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { processId, title, description, departmentName, type } = req.body;

      let pData = {
        referenceNumber: 'HC-PROC',
        title: title || '',
        description: description || '',
        departmentName: departmentName || '',
        type: type || 'COMPLAINT'
      };

      if (processId) {
        const proc = await Process.findById(processId)
          .populate('departmentId', 'name')
          .populate('categoryId', 'name');
        if (proc) {
          pData = {
            referenceNumber: proc.referenceNumber,
            title: proc.title,
            description: proc.description,
            departmentName: (proc.departmentId as unknown as { name?: string })?.name || '',
            type: proc.type
          };
        }
      }

      const summary = await aiService.summarizeProcess(pData);

      // Se existir processId, pode guardar no documento
      if (processId) {
        await Process.findByIdAndUpdate(processId, { aiSummary: summary.summary });
      }

      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }

  async suggestReply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { processId, staffNotes } = req.body;
      if (!processId) {
        res.status(400).json({ success: false, message: 'ID do processo é obrigatório.' });
        return;
      }

      const proc = await Process.findById(processId)
        .populate('departmentId', 'name')
        .populate('patientId', 'fullName');

      if (!proc) {
        res.status(404).json({ success: false, message: 'Processo não encontrado.' });
        return;
      }

      const replyDraft = await aiService.suggestInstitutionalReply({
        referenceNumber: proc.referenceNumber,
        title: proc.title,
        description: proc.description,
        patientName: proc.patientName || (proc.patientId as unknown as { fullName?: string })?.fullName,
        departmentName: (proc.departmentId as unknown as { name?: string })?.name,
        type: proc.type,
        staffNotes
      });

      res.json({
        success: true,
        data: {
          draft: replyDraft,
          requiresHumanReview: true
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async triage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        res.status(400).json({ success: false, message: 'Título e descrição são necessários para triagem.' });
        return;
      }

      const result = await aiService.triageProcess(title, description);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const aiController = new AIController();
