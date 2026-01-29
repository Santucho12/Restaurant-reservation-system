// Endpoints para crear, ver y cancelar reservas
import Router from 'express';
import ReservaController from '../controllers/ReservaController';
import { authenticate } from '../middleware/authMiddleware';

const reservaRoutes = Router();

reservaRoutes.get('/reservas', authenticate, ReservaController.getAllReservas);
reservaRoutes.get('/reservas/:id', authenticate, ReservaController.getReserva);
reservaRoutes.post('/reservas', ReservaController.createReserva);
reservaRoutes.put('/reservas/:id', ReservaController.updateReserva);

reservaRoutes.delete(
  '/reservas/:id',
  authenticate,
  ReservaController.deleteReserva,
);

export default reservaRoutes;
