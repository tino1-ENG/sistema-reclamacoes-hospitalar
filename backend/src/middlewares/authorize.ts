import type { Request, Response, NextFunction } from 'express';
import type { RoleCode } from '../models/User.js';

export function authorize(allowedRoles: RoleCode[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Utilizador não autenticado.'
      });
      return;
    }

    const hasRole = req.user.roles.some((r) => allowedRoles.includes(r));

    if (!hasRole) {
      res.status(403).json({
        success: false,
        message: 'Acesso não autorizado para o perfil do utilizador.'
      });
      return;
    }

    next();
  };
}
