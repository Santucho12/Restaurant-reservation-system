import { ValidationRule, ValidationData } from './ValidacionRule';
import Mesa from '../../models/Mesa';

export class CapacidadRule implements ValidationRule {
  async validar(datos: ValidationData): Promise<void> {
    const { id, capacidad } = datos;

    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      throw new Error('Mesa no encontrada');
    }

    if (capacidad > mesa.capacidad) {
      throw new Error(
        `La capacidad de la mesa (${mesa.capacidad}) es insuficiente para ${capacidad} personas`,
      );
    }
  }
}
