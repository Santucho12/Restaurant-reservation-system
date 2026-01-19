// Lógica de reservas
import { Request, Response } from 'express';
import Reserva from '../models/Reserva';
import ReservaService from '../services/ReservaService';
import { Op } from 'sequelize';

import { ValidadorReservas } from '../strategies/ValidadorReservas';
import { SuperposicionStrategy } from '../strategies/SuperposicionStrategy';
import { CapacidadStrategy } from '../strategies/CapacidadStrategy';
import { TurnoStrategy } from '../strategies/TurnoStrategy';

export default new (class ReservaController {
  async getAllReservas(req: Request, res: Response) {
    try {
      const reserva = await Reserva.findAll();
      if (!reserva) {
        return res.status(404).json({ message: 'No hay reservas' });
      }
      res.status(200).json(reserva);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async getReserva(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findByPk(id);

      if (!reserva) {
        return res.status(404).json({ message: 'No hay reservas' });
      }

      res.status(200).json(reserva);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async createReserva(req: Request, res: Response) {
    try {
      const validator = new ValidadorReservas();
      validator.agregarStrategy(new SuperposicionStrategy());
      validator.agregarStrategy(new CapacidadStrategy());
      validator.agregarStrategy(new TurnoStrategy());

      await validator.validar(req.body);

      const newReserva = await ReservaService.createReserva(req.body);
      res.status(201).json(newReserva);
    } catch (error: any) {
      if (
        error.message === 'La mesa ya esta reservada en ese horario' ||
        error.message.includes('capacidad') ||
        error.message.includes('horario')
      ) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ error: error });
    }
  }

  async updateReserva(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateReserva = Reserva.update(req.body, { where: { id } });
      if (!updateReserva) {
        return res.status(404).json({ message: 'No hay reservas' });
      }

      res.status(200).json({ message: 'Reserva actualizada' });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async deleteReserva(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const reserva = await Reserva.findByPk(id);
      if (!reserva) {
        return res.status(404).json({ message: 'No hay reservas' });
      }

      reserva.destroy();
      return res
        .status(200)
        .json({ message: 'Reserva eliminada satisfactoriamente' });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
})();
