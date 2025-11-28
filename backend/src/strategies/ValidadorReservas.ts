import { ValidacionStrategy } from './ValidacionStrategy';

export class ValidadorReservas {
    private strats: ValidacionStrategy[] = [];

    agregarStrategy(strategy: ValidacionStrategy) {
        this.strats.push(strategy);
    }

    async validar(datos: any): Promise<void> {
        for (const strategy of this.strats) {
            await strategy.validar(datos);
        }
    }
}
