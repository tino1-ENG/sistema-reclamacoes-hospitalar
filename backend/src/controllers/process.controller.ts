import type { Request, Response, NextFunction } from 'express';
import { processService } from '../services/process.service.js';
import { ProcessAttachment } from '../models/ProcessAttachment.js';
import { Process } from '../models/Process.js';

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
      const process = await processService.getProcessById(String(req.params.id), req.user);
      res.json({
        success: true,
        data: process
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

  async uploadAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const file = req.file;
      if (!file) {
        res.status(400).json({ success: false, message: 'Nenhum ficheiro fornecido.' });
        return;
      }

      const proc = await Process.findById(id);
      if (!proc) {
        res.status(404).json({ success: false, message: 'Processo não encontrado.' });
        return;
      }

      const attachment = await ProcessAttachment.create({
        processId: proc._id,
        uploaderId: req.user?.id,
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        filePath: file.path,
        fileUrl: `/uploads/${file.filename}`
      });

      res.status(201).json({
        success: true,
        message: 'Documento / evidência anexada com sucesso.',
        data: attachment
      });
    } catch (err) {
      next(err);
    }
  }

  async getAttachments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const attachments = await ProcessAttachment.find({ processId: id }).sort({ createdAt: -1 });
      res.json({ success: true, data: attachments });
    } catch (err) {
      next(err);
    }
  }
}

export const processController = new ProcessController();
