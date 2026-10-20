import type { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({ err }, 'Erro não tratado no servidor');

  if (err && typeof err === 'object') {
    const error = err as { name?: string; code?: number; message?: string };

    // Erro de duplicação do MongoDB (E11000)
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Registo duplicado: um registo com estes dados únicos já existe no sistema.'
      });
      return;
    }

    // Erro de casting de ID MongoDB (ObjectId inválido)
    if (error.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: 'Identificador fornecido tem um formato inválido.'
      });
      return;
    }
  }

  const message = err instanceof Error ? err.message : 'Erro interno do servidor';
  res.status(500).json({
    success: false,
    message
  });
}
