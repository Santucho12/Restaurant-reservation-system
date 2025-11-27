// Lógica de clientes
import { Request, Response } from 'express'
import Cliente from '../models/Cliente'

export default new class ClienteController {
    async getAllClientes(req: Request, res: Response) {
        try {
            const cliente = await Cliente.findAll()
            if (!cliente) {
                return res.status(404).json({ message: 'No hay clientes' })
            }
            res.status(200).json(cliente)
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

    async getCliente(req: Request, res: Response) {
        try {
            const { id } = req.params
            const cliente = await Cliente.findByPk(id)

            if (!cliente) {
                return res.status(404).json({ message: 'No hay clientes' })
            }

            res.status(200).json(cliente)
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

    async createCliente(req: Request, res: Response) {
        try {
            const newCliente = await Cliente.create(req.body)
            res.status(201).json(newCliente)
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

    async updateCliente(req: Request, res: Response) {
        try {
            const id = req.params.id
            const updateCliente = Cliente.update(req.body, { where: { id } })
            if (!updateCliente) {
                return res.status(404).json({ message: 'No hay clientes' })
            }

            res.status(200).json({ message: 'Cliente actualizado' })
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

    async deleteCliente(req: Request, res: Response) {
        try {
            const id = req.params.id
            const cliente = await Cliente.findByPk(id)
            if (!cliente) {
                return res.status(404).json({ message: 'No hay clientes' })
            }

            cliente.destroy()
            return res.status(200).json({ message: 'Cliente eliminado satisfactoriamente' })
        } catch (error) {
            res.status(500).json({ 'error': error })
        }
    }

}
