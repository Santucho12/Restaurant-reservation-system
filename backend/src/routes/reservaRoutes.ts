// Endpoints para crear, ver y cancelar reservas
import Router from 'express';
import ReservaController from '../controllers/ReservaController';

const reservaRoutes = Router();

reservaRoutes.get('/reservas', ReservaController.getAllReservas);
reservaRoutes.get('/reservas/:id', ReservaController.getReserva);
reservaRoutes.post('/reservas', ReservaController.createReserva);
reservaRoutes.put('/reservas/:id', ReservaController.updateReserva);
reservaRoutes.delete('/reservas/:id', ReservaController.deleteReserva);

export default reservaRoutes;
