import Reserva from '../models/Reserva'
import { Op } from 'sequelize'

export default new class ReservaService {
    async updateExpiredReservations() {
        try {
            const now = new Date();
            await Reserva.update({ estado: 'finalizada' },
                {
                    where: {
                        fechaFin: { [Op.lt]: now },
                        estado: { [Op.notIn]: ['finalizada', 'cancelada'] }
                    }
                }
            )
        } catch (error) {
            console.error('Error actualizando reservas expiradas:', error);
        }
    }
}
