import { ValidationRule, ValidationData } from './ValidacionRule';

export class TurnoRule implements ValidationRule {
  async validar(datos: ValidationData): Promise<void> {
    const { 'fecha/hora': fechaInicio } = datos;
    const fecha = new Date(fechaInicio);

    // Ajustar a zona horaria -3 (Argentina)
    // getUTCHours() devuelve 0-23. Restamos 3. Si da negativo, sumamos 24.
    const hora = (fecha.getUTCHours() - 3 + 24) % 24;

    const esAlmuerzo = hora >= 12 && hora < 15;
    const esCena = hora >= 20 && hora < 23;

    if (!esAlmuerzo && !esCena) {
      throw new Error(
        'La reserva debe ser en horario de almuerzo (12-15) o cena (20-23)',
      );
    }
  }
}
