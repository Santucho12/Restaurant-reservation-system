// Lógica de clientes
import { Request, Response } from 'express';
import Cliente from '../models/Cliente';
import ErrorHandler from '../utils/ErrorHandler';

export default new (class ClienteController {
  async getAllClientes(req: Request, res: Response) {
    try {
      const cliente = await Cliente.findAll();
      if (!cliente || cliente.length === 0) {
        return ErrorHandler.notFoundErrorCliente(res);
      }
      res.status(200).json(cliente);
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async getCliente(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idNumber = Number(id);
      const cliente = await Cliente.findByPk(idNumber);

      if (!cliente) {
        return ErrorHandler.notFoundErrorCliente(res);
      }

      res.status(200).json(cliente);
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async createCliente(req: Request, res: Response) {
    try {
      const newCliente = await Cliente.create(req.body);
      res.status(201).json(newCliente);
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async updateCliente(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateCliente = await Cliente.update(req.body, { where: { id } });
      if (updateCliente[0] === 0) {
        return ErrorHandler.notFoundErrorCliente(res);
      }

      res.status(200).json({ message: 'Cliente actualizado' });
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async deleteCliente(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idNumber = Number(id);
      const cliente = await Cliente.findByPk(idNumber);
      if (!cliente) {
        return ErrorHandler.notFoundErrorCliente(res);
      }

      await cliente.destroy();
      return res
        .status(200)
        .json({ message: 'Cliente eliminado satisfactoriamente' });
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }
})();
