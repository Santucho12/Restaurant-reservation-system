// Repositorio de Reservas: gestiona la persistencia y consulta de reservas
const Reserva = require('../models/Reserva');

class ReservaRepository {
	constructor() {
		// Simulación de base de datos en memoria (reemplazar por DB real)
		this.reservas = [];
	}

	crear(reservaData) {
		const reserva = new Reserva(reservaData);
		this.reservas.push(reserva);
		return reserva;
	}

	buscarPorId(id) {
		return this.reservas.find(r => r.id === id);
	}

	buscarTodas() {
		return this.reservas;
	}

	cancelar(id) {
		const reserva = this.buscarPorId(id);
		if (reserva) {
			reserva.estado = 'cancelada';
			return reserva;
		}
		return null;
	}

	buscarPorFechaYTurno(fechaHora, turno) {
		return this.reservas.filter(r => r.fechaHora === fechaHora && r.turno === turno);
	}
}

module.exports = ReservaRepository;
