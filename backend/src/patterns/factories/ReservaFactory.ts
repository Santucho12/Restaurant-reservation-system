import { ReservaAttributes } from '../../models/Reserva';
import ReservaService from '../../services/ReservaService';
import { ReservationValidator } from '../strategies/ReservationValidator';
import { CapacidadRule } from '../strategies/CapacidadRule';
import { SuperposicionRule } from '../strategies/SuperposicionRule';
import { TurnoRule } from '../strategies/TurnoRule';

export class ReservaFactory {
    static createValidator(): ReservationValidator {
        const validator = new ReservationValidator();
        validator.addRule(new SuperposicionRule());
        validator.addRule(new CapacidadRule());
        validator.addRule(new TurnoRule());
        return validator;
    }

    static async createReserva(data: ReservaAttributes) {
        return ReservaService.createReserva(data);
    }
}
