import { ValidationRule, ValidationData } from './ValidacionRule';

export class TurnoRule implements ValidationRule {
  async validar(datos: ValidationData): Promise<void> {
    const { 'fecha/hora': fechaInicio } = datos;
    const fecha = new Date(fechaInicio);

    // Validar directamente la hora recibida (asumimos que fechaInicio viene en formato ISO
    // representando la hora local deseada en UTC, ej: 2025-12-15T20:00:00Z para reservar a las 20:00)
    const hora = fecha.getUTCHours();

    const esAlmuerzo = hora >= 12 && hora < 15;
    const esCena = hora >= 20 && hora < 23;

    if (!esAlmuerzo && !esCena) {
      throw new Error(
        'La reserva debe ser en horario de almuerzo (12-15) o cena (20-23)',
      );
    }
  }
}
