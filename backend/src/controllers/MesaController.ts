// Lógica de mesas
import { Request, Response } from 'express';
import Mesa from '../models/Mesa';

export default new (class MesaController {
  async getAllMesas(req: Request, res: Response) {
    try {
      const mesa = await Mesa.findAll();
      if (!mesa) {
        return res.status(404).json({ message: 'No hay mesas' });
      }
      res.status(200).json(mesa);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async getMesa(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mesa = await Mesa.findByPk(id);

      if (!mesa) {
        return res.status(404).json({ message: 'No hay mesas' });
      }

      res.status(200).json(mesa);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async createMesa(req: Request, res: Response) {
    try {
      const newMesa = await Mesa.create(req.body);
      res.status(201).json(newMesa);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async updateMesa(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateMesa = Mesa.update(req.body, { where: { id } });
      if (!updateMesa) {
        return res.status(404).json({ message: 'No hay mesas' });
      }

      res.status(200).json({ message: 'Mesa actualizada' });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async deleteMesa(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const mesa = await Mesa.findByPk(id);
      if (!mesa) {
        return res.status(404).json({ message: 'No hay mesas' });
      }

      mesa.destroy();
      return res
        .status(200)
        .json({ message: 'Mesa eliminada satisfactoriamente' });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
})();
