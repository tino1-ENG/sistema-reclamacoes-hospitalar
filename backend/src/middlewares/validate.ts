import type { Request, Response, NextFunction } from 'express';
import { ZodError, type AnyZodObject } from 'zod';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((e) => ({
          field: e.path.join('.').replace(/^(body|query|params)\./, ''),
          message: e.message
        }));
        const summary = errorDetails.map((e) => e.message).join('; ');

        res.status(400).json({
          success: false,
          message: summary ? `Erro de validação: ${summary}` : 'Erro de validação dos dados submetidos.',
          errors: errorDetails
        });
        return;
      }
      next(error);
    }
  };
}
