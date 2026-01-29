import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.status(200).json({ token });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      res.status(401).json({ error: errorMessage });
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, email, password } = req.body;
      const usuario = await AuthService.register(nombre, email, password);
      res.status(201).json(usuario);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      res.status(400).json({ error: errorMessage });
    }
  }
}

export default new AuthController();
