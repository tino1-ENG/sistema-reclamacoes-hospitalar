import type { Request, Response, NextFunction } from 'express';
import { processService } from '../services/process.service.js';

export class ProcessController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await processService.createProcess(req.user, req.body);
      res.status(201).json({
        success: true,
        message: 'Processo hospitalar submetido com sucesso.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async lookup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { referenceNumber, pin } = req.body;
      const result = await processService.lookupByReferenceAndPin(referenceNumber, pin);
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autenticação necessária.' });
        return;
      }
      const processes = await processService.getProcesses(req.user, req.query);
      res.json({
        success: true,
        data: processes
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autenticação necessária.' });
        return;
      }
      const result = await processService.getProcessById(String(req.params.id), req.user);
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autenticação necessária.' });
        return;
      }
      const messages = await processService.getProcessMessages(String(req.params.id), req.user);
      res.json({
        success: true,
        data: messages
      });
    } catch (err) {
      next(err);
    }
  }

  async addMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autenticação necessária.' });
        return;
      }
      const message = await processService.addMessage(String(req.params.id), req.user, req.body);
      res.status(201).json({
        success: true,
        message: 'Mensagem registada com sucesso.',
        data: message
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autenticação necessária.' });
        return;
      }
      const updated = await processService.updateStatus(String(req.params.id), req.user, req.body);
      res.json({
        success: true,
        message: 'Estado do processo atualizado com sucesso.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  async reassign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autenticação necessária.' });
        return;
      }
      const updated = await processService.reassign(String(req.params.id), req.user, req.body);
      res.json({
        success: true,
        message: 'Processo reatribuído com sucesso.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  async submitFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autenticação necessária.' });
        return;
      }
      const feedback = await processService.submitFeedback(String(req.params.id), req.user, req.body);
      res.json({
        success: true,
        message: 'Agradecemos a sua avaliação do atendimento.',
        data: feedback
      });
    } catch (err) {
      next(err);
    }
  }
}

export const processController = new ProcessController();
