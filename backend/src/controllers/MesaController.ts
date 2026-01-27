// Lógica de mesas
import { Request, Response } from 'express';
import Mesa from '../models/Mesa';
import ErrorHandler from '../utils/ErrorHandler';

export default new (class MesaController {
  async getAllMesas(req: Request, res: Response) {
    try {
      const mesa = await Mesa.findAll();
      if (!mesa) {
        return ErrorHandler.notFoundErrorMesa(res, ErrorHandler.getMessage('noMesas'));
      }
      res.status(200).json(mesa);
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async getMesa(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      const mesa = await Mesa.findByPk(idNumber);

      if (!mesa) {
        return ErrorHandler.notFoundErrorMesa(res);
      }

      res.status(200).json(mesa);
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async createMesa(req: Request, res: Response) {
    try {
      const newMesa = await Mesa.create(req.body);
      res.status(201).json(newMesa);
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async updateMesa(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateMesa = await Mesa.update(req.body, { where: { id } });
      if (!updateMesa) {
        return ErrorHandler.notFoundErrorMesa(res);
      }

      res.status(200).json({ message: 'Mesa actualizada' });
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async deleteMesa(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idNumber = Number(id);
      const mesa = await Mesa.findByPk(idNumber);
      if (!mesa) {
        return ErrorHandler.notFoundErrorMesa(res);
      }

      await mesa.destroy();
      return res.status(200).json({ message: 'Mesa eliminada satisfactoriamente' });
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }
})();
