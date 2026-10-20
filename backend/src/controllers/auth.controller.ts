import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, password, roleHint } = req.body;
      const result = await authService.login(identifier, password, roleHint);
      res.json({
        success: true,
        message: 'Autenticação realizada com sucesso.',
        data: result
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('Credenciais inválidas')) {
        res.status(401).json({
          success: false,
          message: err.message
        });
        return;
      }
      next(err);
    }
  }

  async registerPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.registerPatient(req.body);
      res.status(201).json({
        success: true,
        message: 'Conta de paciente registada com sucesso.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        data: req.user
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
