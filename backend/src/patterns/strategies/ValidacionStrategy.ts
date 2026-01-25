import { MesaAttributes } from '../models/Mesa';
import { ReservaAttributes } from '../models/Reserva';

export type ValidationData = MesaAttributes & ReservaAttributes;

export interface ValidacionStrategy {
  validar(datos: ValidationData): Promise<void>;
}
