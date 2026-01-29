// Endpoints para crear, ver y cancelar mesas
import Router from 'express';
import MesaController from '../controllers/MesaController';
import { authenticate } from '../middleware/authMiddleware';

const mesaRoutes = Router();

mesaRoutes.use(authenticate);
mesaRoutes.get('/mesas', MesaController.getAllMesas);
mesaRoutes.get('/mesas/:id', MesaController.getMesa);
mesaRoutes.post('/mesas', MesaController.createMesa);
mesaRoutes.put('/mesas/:id', MesaController.updateMesa);
mesaRoutes.delete('/mesas/:id', MesaController.deleteMesa);

export default mesaRoutes;
