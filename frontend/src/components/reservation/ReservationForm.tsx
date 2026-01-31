import React from 'react';

interface ReservationFormProps {
    date: string;
    startTime: string;
    endTime: string;
    people: string;
    name: string;
    email: string;
    onChange: (field: string, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isValid: boolean;
    isSubmitting: boolean;
    children?: React.ReactNode; // For the TableGrid
}

const ReservationForm: React.FC<ReservationFormProps> = ({
    date, startTime, endTime, people, name, email, onChange, onSubmit, isValid, isSubmitting, children
}) => {
    return (
        <form id="formulario" className="formulario" onSubmit={onSubmit}>
            <section className="seccion">
                <div>
                    <h2>RESERVA DE MESAS</h2>
                    <p>
                        Al colocar los datos de su reserva le aparecerán las mesas para reservar. <br /> <br />
                        Horarios de Almuerzo: 12:00 - 15:00 <br />
                        Horarios de Cena: 20:00 - 23:00
                    </p>
                </div>
                <br />
                <div className="campo-grupo">
                    <div className="campo">
                        <label htmlFor="fecha">Fecha</label>
                        <input
                            type="date"
                            id="fecha"
                            value={date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => onChange('date', e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo">
                        <label htmlFor="hora-inicio">Hora Inicio</label>
                        <input
                            type="time"
                            id="hora-inicio"
                            value={startTime}
                            onChange={(e) => onChange('startTime', e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo">
                        <label htmlFor="hora-fin">Hora Fin</label>
                        <input
                            type="time"
                            id="hora-fin"
                            value={endTime}
                            onChange={(e) => onChange('endTime', e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo">
                        <label htmlFor="personas">Comensales</label>
                        <select
                            id="personas"
                            value={people}
                            onChange={(e) => onChange('people', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="seccion">
                <h2>Seleccione su Mesa</h2>
                {children}
            </section>

            <section className="seccion">
                <h2>Proporcionenos sus datos antes de reservar</h2>
                <div className="campo-grupo">
                    <div className="campo">
                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                            type="text"
                            id="nombre"
                            placeholder="Ingrese su nombre"
                            value={name}
                            onChange={(e) => onChange('name', e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => onChange('email', e.target.value)}
                            required
                        />
                    </div>
                </div>
            </section>

            <button
                type="submit"
                id="btn-reservar"
                className="btn-reservar"
                disabled={!isValid || isSubmitting}
            >
                {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
        </form>
    );
};

export default ReservationForm;
