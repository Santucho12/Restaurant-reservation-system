import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/authConfig';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'No se proporcionó token de autenticación' });
  }

  const token = authHeader.split(' ')[1]; // Acá tenemos formato: Bearer <token>

  try {
    jwt.verify(token, authConfig.jwtSecret);
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
