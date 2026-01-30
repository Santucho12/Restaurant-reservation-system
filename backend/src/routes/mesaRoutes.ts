// Endpoints para crear, ver y cancelar mesas
import Router from 'express';
import MesaController from '../controllers/MesaController';
import { authenticate } from '../middleware/authMiddleware';

const mesaRoutes = Router();

mesaRoutes.get('/mesas', MesaController.getAllMesas);
mesaRoutes.get('/mesas/:id', authenticate, MesaController.getMesa);
mesaRoutes.post('/mesas', authenticate, MesaController.createMesa);
mesaRoutes.put('/mesas/:id', authenticate, MesaController.updateMesa);
mesaRoutes.delete('/mesas/:id', authenticate, MesaController.deleteMesa);

export default mesaRoutes;
