// Lógica de reservas
import { Request, Response } from 'express'
import Reserva from '../models/Reserva'
import { Op } from 'sequelize'

export default new class ReservaController {
    async getAllReservas(req: Request, res: Response) {
        try {
            const reserva = await Reserva.findAll()
            if (!reserva) {
                return res.status(404).json({ message: 'No hay reservas' })
            }
            res.status(200).json(reserva)
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

    async getReserva(req: Request, res: Response) {
        try {
            const { id } = req.params
            const reserva = await Reserva.findByPk(id)

            if (!reserva) {
                return res.status(404).json({ message: 'No hay reservas' })
            }

            res.status(200).json(reserva)
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

    async createReserva(req: Request, res: Response) {
        try {
            const { mesaId, 'fecha/hora': fechaInicio, fechaFin } = req.body;

            const existingReserva = await Reserva.findOne({
                where: {
                    mesaId,
                    estado: { [Op.ne]: 'cancelada' },
                    'fecha/hora': { [Op.lt]: fechaFin },
                    fechaFin: { [Op.gt]: fechaInicio }
                }
            });

            if (existingReserva) {
                return res.status(400).json({ message: 'La mesa ya esta reservada en ese horario' });
            }

            const newReserva = await Reserva.create(req.body)
            res.status(201).json(newReserva)
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

    async updateReserva(req: Request, res: Response) {
        try {
            const id = req.params.id
            const updateReserva = Reserva.update(req.body, { where: { id } })
            if (!updateReserva) {
                return res.status(404).json({ message: 'No hay reservas' })
            }

            res.status(200).json({ message: 'Reserva actualizada' })
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

    async deleteReserva(req: Request, res: Response) {
        try {
            const id = req.params.id
            const reserva = await Reserva.findByPk(id)
            if (!reserva) {
                return res.status(404).json({ message: 'No hay reservas' })
            }

            reserva.destroy()
            return res.status(200).json({ message: 'Reserva eliminada satisfactoriamente' })
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

}
