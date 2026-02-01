import React, { useMemo } from 'react';
import type { Mesa, Reserva } from '../../types';

interface TableGridProps {
    tables: Mesa[];
    reservations: Reserva[];
    date: string;
    startTime: string;
    endTime: string;
    people: number;
    selectedTableId: number | null;
    onSelect: (id: number) => void;
}

const TableGrid: React.FC<TableGridProps> = ({
    tables, reservations, date, startTime, endTime, people, selectedTableId, onSelect
}) => {

    const tableStates = useMemo(() => {
        if (!date || !startTime || !endTime || !people) return [];

        const start = new Date(`${date}T${startTime}Z`);
        const end = new Date(`${date}T${endTime}Z`);

        const conflictReservations = reservations.filter(r => {
            if (r.estado === 'cancelada' || r.estado === 'finalizada') return false;

            const rStart = new Date(r['fecha/hora'] || r.fecha + 'T' + r.hora);
            const rEnd = new Date(r.fechaFin || rStart.getTime() + 2 * 60 * 60 * 1000);

            return (rStart < end && rEnd > start);
        });

        const occupiedIds = conflictReservations.map(r => r.mesaId);

        return tables.map(table => {
            const isOccupied = occupiedIds.includes(table.id);
            const isCapacityExceeded = table.capacidad < people;

            return {
                ...table,
                isOccupied,
                isCapacityExceeded,
                isDisabled: isOccupied || isCapacityExceeded
            };
        });
    }, [tables, reservations, date, startTime, endTime, people]);

    if (!date || !startTime || !endTime || !people) {
        return <p className="aviso" id="mesas-aviso">Complete los campos anteriores para ver disponibilidad</p>;
    }

    const availableCount = tableStates.filter(t => !t.isDisabled).length;

    if (availableCount === 0 && tables.length > 0) {
        return <p className="aviso">No hay mesas disponibles para este horario</p>;
    }

    return (
        <div className="mesas-grid" id="mesas-container">
            {tableStates.map(table => (
                <div
                    key={table.id}
                    className={`mesa-card ${table.isOccupied ? 'ocupada' : ''} ${table.isCapacityExceeded ? 'sin-capacidad' : ''} ${selectedTableId === table.id ? 'seleccionada' : ''}`}
                    onClick={() => !table.isDisabled && onSelect(table.id)}
                >
                    <div className="mesa-numero">{table.numero}</div>
                    <div className="mesa-capacidad">{table.capacidad} personas</div>
                    <div className="mesa-ubicacion">{table.ubicacion === 'adentro' ? 'Interior' : 'Terraza'}</div>
                    {table.isOccupied && <div className="mesa-estado">Reservada</div>}
                    {table.isCapacityExceeded && <div className="mesa-estado">Excede Capacidad</div>}
                </div>
            ))}
        </div>
    );
};

export default TableGrid;
