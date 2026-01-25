import { ValidationRule, ValidationData } from './ValidacionRule';

export class ReservationValidator {
  private rules: ValidationRule[] = [];

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
  }

  async validateAll(datos: ValidationData): Promise<void> {
    for (const rule of this.rules) {
      await rule.validar(datos);
    }
  }
}
