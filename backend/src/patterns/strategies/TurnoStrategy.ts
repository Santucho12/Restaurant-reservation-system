import { ValidacionStrategy, ValidationData } from './ValidacionStrategy';

export class TurnoStrategy implements ValidacionStrategy {
  async validar(datos: ValidationData): Promise<void> {
    const { 'fecha/hora': fechaInicio } = datos;
    const fecha = new Date(fechaInicio);
    const hora = fecha.getHours();

    const esAlmuerzo = hora >= 12 && hora < 15;
    const esCena = hora >= 20 && hora < 23;

    if (!esAlmuerzo && !esCena) {
      throw new Error(
        'La reserva debe ser en horario de almuerzo (12-15) o cena (20-23)',
      );
    }
  }
}
