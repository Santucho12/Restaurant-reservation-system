import { IObserver } from "./Observer";
import Reserva from "../models/Reserva";

export class EmailNotifier implements IObserver {
	update(reserva: any): void {
		// Aquí iría la lógica para enviar el email
		console.log(`Notificación por email: Reserva actualizada/creada para el cliente ${reserva.clienteId}, mesa ${reserva.mesaId}, estado: ${reserva.estado}`);
	}
}
