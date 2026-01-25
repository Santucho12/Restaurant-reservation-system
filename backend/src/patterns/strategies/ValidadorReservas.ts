import { ValidacionStrategy, ValidationData } from './ValidacionStrategy';

export class ValidadorReservas {
  private strats: ValidacionStrategy[] = [];

  agregarStrategy(strategy: ValidacionStrategy) {
    this.strats.push(strategy);
  }

  async validar(datos: ValidationData): Promise<void> {
    for (const strategy of this.strats) {
      await strategy.validar(datos);
    }
  }
}
