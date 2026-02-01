import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { API_URL } from '../../config';
import type { Reserva, Cliente } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ReservationsTab: React.FC = () => {
    const { token } = useAuth();
    const { data: reservas, refetch: refetchReservas } = useFetch<Reserva[]>(`${API_URL}/reservas`);
    const { data: clientes } = useFetch<Cliente[]>(`${API_URL}/clientes`);

    const [editing, setEditing] = useState<Reserva | null>(null);
    const [status, setStatus] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const sortedReservas = (reservas || []).sort((a, b) =>
        new Date(b['fecha/hora'] || b.fecha).getTime() - new Date(a['fecha/hora'] || a.fecha).getTime()
    );

    const getClientName = (id?: number) => {
        if (!id) return '-';
        const client = clientes?.find(c => c.id === id);
        return client ? client.nombre : `ID: ${id}`;
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar reserva?')) return;
        try {
            await fetch(`${API_URL}/reservas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            refetchReservas();
        } catch (e: unknown) {
            console.error(e);
        }
    };

    const handleEdit = (reserva: Reserva) => {
        setEditing(reserva);
        setStatus(reserva.estado || 'pendiente');
    };

    const saveEdit = async () => {
        if (!editing || !editing.id) return;
        setIsSaving(true);
        try {
            await fetch(`${API_URL}/reservas/${editing.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: status })
            });
            refetchReservas();
            setEditing(null);
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div id="tab-reservas" className="seccion">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Reservas</h2>
                <button className="btn-reservar" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => refetchReservas()}>
                    Actualizar
                </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>MESA</th>
                            <th>FECHA</th>
                            <th>HORA INICIO</th>
                            <th>HORA FIN</th>
                            <th>CLIENTE</th>
                            <th>PERSONAS</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReservas.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 'bold', color: 'var(--dorado)' }}>{r.mesaId}</td>
                                <td>
                                    {(() => {
                                        const start = new Date(r['fecha/hora'] || r.fecha);
                                        const day = start.getUTCDate().toString().padStart(2, '0');
                                        const month = (start.getUTCMonth() + 1).toString().padStart(2, '0');
                                        const year = start.getUTCFullYear();
                                        return `${day}/${month}/${year}`;
                                    })()}
                                </td>
                                <td>
                                    {(() => {
                                        const start = new Date(r['fecha/hora'] || r.fecha);
                                        const hours = start.getUTCHours().toString().padStart(2, '0');
                                        const minutes = start.getUTCMinutes().toString().padStart(2, '0');
                                        return `${hours}:${minutes}`;
                                    })()}
                                </td>
                                <td>
                                    {(() => {
                                        const start = new Date(r['fecha/hora'] || r.fecha);
                                        const end = r.fechaFin ? new Date(r.fechaFin) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
                                        const hours = end.getUTCHours().toString().padStart(2, '0');
                                        const minutes = end.getUTCMinutes().toString().padStart(2, '0');
                                        return `${hours}:${minutes}`;
                                    })()}
                                </td>
                                <td>{getClientName(r.clienteId)}</td>
                                <td>{r.cantidadPersonas}</td>
                                <td style={{ textTransform: 'capitalize' }}>{r.estado}</td>
                                <td>
                                    <button className="action-btn btn-edit" onClick={() => handleEdit(r)}>✎</button>
                                    <button className="action-btn btn-delete" onClick={() => r.id && handleDelete(r.id)}>🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <div className="modal active">
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setEditing(null)}>&times;</span>
                        <h2 style={{ color: 'var(--dorado)', marginBottom: '20px' }}>Editar Reserva</h2>
                        <div className="campo">
                            <label>Estado</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="cancelada">Cancelada</option>
                                <option value="finalizada">Finalizada</option>
                            </select>
                        </div>
                        <button className="btn-reservar" style={{ marginTop: '20px' }} onClick={saveEdit} disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationsTab;
