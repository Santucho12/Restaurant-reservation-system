import Reserva from '../models/Reserva';
import { ReservaSubject } from '../models/Reserva';
import { EmailNotifier } from '../patterns/observers/EmailNotifier';
import { Op } from 'sequelize';
import { ReservaAttributes } from '../models/Reserva';

class ReservaService {
  private reservaSubject: ReservaSubject;

  constructor() {
    this.reservaSubject = new ReservaSubject();
    this.reservaSubject.addObserver(new EmailNotifier());
  }

  async updateExpiredReservations() {
    try {
      const now = new Date();
      await Reserva.update(
        { estado: 'finalizada' },
        {
          where: {
            fechaFin: { [Op.lt]: now },
            estado: { [Op.notIn]: ['finalizada', 'cancelada'] },
          },
        },
      );
    } catch (error) {
      console.error('Error actualizando reservas expiradas:', error);
    }
  }

  async createReserva(data: ReservaAttributes) {
    const newReserva = await Reserva.create(data);
    this.reservaSubject.setReserva(newReserva);
    return newReserva;
  }
}

export default new ReservaService();
