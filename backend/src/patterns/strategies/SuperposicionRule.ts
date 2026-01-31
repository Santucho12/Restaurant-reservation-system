import { ValidationRule, ValidationData } from './ValidacionRule';
import Reserva from '../../models/Reserva';
import { Op } from 'sequelize';

export class SuperposicionRule implements ValidationRule {
  async validar(datos: ValidationData): Promise<void> {
    const { mesaId, 'fecha/hora': fechaInicio, fechaFin } = datos;

    const reservaExistente = await Reserva.findOne({
      where: {
        mesaId,
        estado: { [Op.ne]: 'cancelada' },
        'fecha/hora': { [Op.lt]: fechaFin },
        fechaFin: { [Op.gt]: fechaInicio },
      },
    });

    if (reservaExistente) {
      throw new Error('La mesa ya esta reservada en ese horario');
    }
  }
}
