import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthenticatedUser } from '../types/express.d.js';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido ou formato inválido.'
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Sessão expirada ou token inválido. Por favor, autentique-se novamente.'
    });
  }
}

/**
 * Middleware opcional: se houver token, extrai o utilizador, mas não bloqueia caso anónimo
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
      req.user = payload;
    } catch {
      // Ignora erro e prossegue como anónimo
    }
  }
  next();
}
