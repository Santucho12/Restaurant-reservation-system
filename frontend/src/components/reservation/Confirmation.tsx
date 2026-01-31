import React from 'react';
import type { Mesa } from '../../types';

interface ConfirmationProps {
    data: {
        date: string;
        startTime: string;
        endTime: string;
        people: string;
        name: string;
        email: string;
    };
    table: Mesa | undefined;
    onReset: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ data, table, onReset }) => {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
    };

    return (
        <div id="confirmacion" className="confirmacion">
            <div className="confirmacion-icono">✓</div>
            <h2>Reserva Confirmada</h2>
            <p className="confirmacion-subtitulo">Le hemos enviado los detalles a su correo</p>

            <div className="confirmacion-detalles">
                <div className="detalle-item">
                    <span className="detalle-label">Fecha</span>
                    <span className="detalle-valor">{formatDate(data.date)}</span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Horario</span>
                    <span className="detalle-valor">{data.startTime} - {data.endTime}</span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Mesa</span>
                    <span className="detalle-valor">
                        {table ? `Mesa ${table.numero} — ${table.ubicacion === 'adentro' ? 'Interior' : 'Terraza'}` : 'Seleccionada'}
                    </span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Comensales</span>
                    <span className="detalle-valor">{data.people}</span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Nombre</span>
                    <span className="detalle-valor">{data.name}</span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Email</span>
                    <span className="detalle-valor">{data.email}</span>
                </div>
            </div>

            <button type="button" className="btn-reservar" onClick={onReset}>
                Realizar otra reserva
            </button>
        </div>
    );
};

export default Confirmation;
