// Lógica de reservas
import { Request, Response } from 'express';
import Reserva from '../models/Reserva';
import { ValidationData } from '../patterns/strategies/ValidacionRule';
import { ReservaFactory } from '../patterns/factories/ReservaFactory';
import ErrorHandler from '../utils/ErrorHandler';

export default new (class ReservaController {
  async getAllReservas(req: Request, res: Response) {
    try {
      const reserva = await Reserva.findAll();
      if (!reserva) {
        return ErrorHandler.notFoundErrorReserva(res);
      }
      res.status(200).json(reserva);
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async getReserva(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      const reserva = await Reserva.findByPk(idNumber);

      if (!reserva) {
        return ErrorHandler.notFoundErrorReserva(res);
      }

      res.status(200).json(reserva);
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async createReserva(req: Request, res: Response) {
    try {
      const validator = ReservaFactory.createValidator();

      await validator.validateAll(req.body as ValidationData);

      const newReserva = await ReservaFactory.createReserva(req.body);
      res.status(201).json(newReserva);
    } catch (error) {
      if (
        (error as Error).message === 'La mesa ya esta reservada en ese horario' ||
        (error as Error).message.includes('capacidad') ||
        (error as Error).message.includes('horario')
      ) {
        return ErrorHandler.badRequestErrorReserva(res, (error as Error).message);
      }
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async updateReserva(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updateReserva = await Reserva.update(req.body, { where: { id } });
      if (!updateReserva) {
        return ErrorHandler.notFoundErrorReserva(res);
      }

      res.status(200).json({ message: 'Reserva actualizada' });
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }

  async deleteReserva(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idNumber = Number(id);
      const reserva = await Reserva.findByPk(idNumber);
      if (!reserva) {
        return ErrorHandler.notFoundErrorReserva(res);
      }

      await reserva.destroy();
      return res.status(200).json({ message: 'Reserva eliminada satisfactoriamente' });
    } catch (error) {
      ErrorHandler.serverInternalError(res, error as Error);
    }
  }
})();
