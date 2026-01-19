import { ValidacionStrategy } from './ValidacionStrategy';
import Mesa from '../models/Mesa';

export class CapacidadStrategy implements ValidacionStrategy {
  async validar(datos: any): Promise<void> {
    const { mesaId, cantidadPersonas } = datos;

    const mesa = await Mesa.findByPk(mesaId);
    if (!mesa) {
      throw new Error('Mesa no encontrada');
    }

    if (cantidadPersonas > mesa.capacidad) {
      throw new Error(
        `La capacidad de la mesa (${mesa.capacidad}) es insuficiente para ${cantidadPersonas} personas`,
      );
    }
  }
}
