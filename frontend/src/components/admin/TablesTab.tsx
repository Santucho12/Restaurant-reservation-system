import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { API_URL } from '../../config';
import type { Mesa, BackendMesa } from '../../types';
import { useAuth } from '../../context/AuthContext';

const TablesTab: React.FC = () => {
    const { token } = useAuth();
    const { data: rawTables, refetch } = useFetch<BackendMesa[]>(`${API_URL}/mesas`);

    const mesas: Mesa[] = (rawTables || []).map(t => ({
        ...t,
        numero: t.numeroMesa ?? t.numero ?? 0
    }));

    const [editing, setEditing] = useState<Partial<Mesa> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const openNew = () => setEditing({ numero: undefined, capacidad: undefined, ubicacion: 'adentro' });
    const openEdit = (m: Mesa) => setEditing({ ...m });

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar mesa?')) return;
        try {
            await fetch(`${API_URL}/mesas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            refetch();
        } catch (e: unknown) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        if (!editing) return;
        setIsSaving(true);
        try {
            const method = editing.id ? 'PUT' : 'POST';
            const url = editing.id ? `${API_URL}/mesas/${editing.id}` : `${API_URL}/mesas`;

            const payload = {
                ...editing,
                numeroMesa: editing.numero
            };

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            refetch();
            setEditing(null);
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div id="tab-mesas" className="seccion">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Mesas</h2>
                <button className="btn-reservar" style={{ width: 'auto', padding: '10px 20px' }} onClick={openNew}>
                    Nueva Mesa
                </button>
            </div>

            <div className="mesas-grid" id="admin-mesas-grid">
                {mesas?.map(m => (
                    <div className="mesa-card" key={m.id}>
                        <div className="mesa-numero">{m.numero}</div>
                        <div className="mesa-capacidad">{m.capacidad} personas</div>
                        <div className="mesa-ubicacion">{m.ubicacion === 'adentro' ? 'Interior' : 'Terraza'}</div>
                        <div style={{ marginTop: '10px' }}>
                            <button className="action-btn btn-edit" onClick={() => openEdit(m)}>✎</button>
                            <button className="action-btn btn-delete" onClick={() => handleDelete(m.id)}>🗑</button>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <div className="modal active">
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setEditing(null)}>&times;</span>
                        <h2 style={{ color: 'var(--dorado)', marginBottom: '20px' }}>
                            {editing.id ? 'Editar Mesa' : 'Nueva Mesa'}
                        </h2>
                        <div className="campo-grupo">
                            <div className="campo">
                                <label>Número</label>
                                <input
                                    type="number"
                                    value={editing.numero || ''}
                                    onChange={(e) => setEditing(prev => ({ ...prev, numero: parseInt(e.target.value) }))}
                                    required
                                />
                            </div>
                            <div className="campo">
                                <label>Capacidad</label>
                                <input
                                    type="number"
                                    value={editing.capacidad || ''}
                                    onChange={(e) => setEditing(prev => ({ ...prev, capacidad: parseInt(e.target.value) }))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="campo" style={{ marginTop: '15px' }}>
                            <label>Ubicación</label>
                            <select
                                value={editing.ubicacion}
                                onChange={(e) => setEditing(prev => ({ ...prev, ubicacion: e.target.value as 'adentro' | 'afuera' }))}
                            >
                                <option value="adentro">Adentro</option>
                                <option value="afuera">Afuera</option>
                            </select>
                        </div>
                        <button className="btn-reservar" style={{ marginTop: '20px' }} onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Guardar Mesa'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TablesTab;
