import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReservationForm from '../components/reservation/ReservationForm';
import TableGrid from '../components/reservation/TableGrid';
import Confirmation from '../components/reservation/Confirmation';
import { useFetch } from '../hooks/useFetch';
import { API_URL } from '../config';
import type { Mesa, Reserva, Cliente, BackendMesa } from '../types';

const Home: React.FC = () => {
    const [view, setView] = useState<'form' | 'success'>('form');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        people: '',
        name: '',
        email: ''
    });
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'exito' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: rawTables } = useFetch<BackendMesa[]>(`${API_URL}/mesas`);
    const { data: reservationsData, refetch: refetchReservations } = useFetch<Reserva[]>(`${API_URL}/reservas`);

    const tables: Mesa[] = (rawTables || []).map(t => ({
        id: t.id,
        numero: t.numeroMesa ?? t.numero ?? 0,
        capacidad: t.capacidad,
        ubicacion: t.ubicacion
    }));
    const reservations = reservationsData || [];

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (['date', 'startTime', 'endTime', 'people'].includes(field)) {
            setSelectedTableId(null);
            setMessage(null);
        }
    };

    const isValid = () => {
        return !!(formData.date && formData.startTime && formData.endTime && formData.people &&
            selectedTableId && formData.name && formData.email && formData.email.includes('@') &&
            !message);
    };

    useEffect(() => {
        const validateTime = () => {
            if (!formData.startTime || !formData.endTime) return;

            const [hStart, mStart] = formData.startTime.split(':').map(Number);
            const [hEnd, mEnd] = formData.endTime.split(':').map(Number);

            const startMins = hStart * 60 + mStart;
            const endMins = hEnd * 60 + mEnd;

            // Almuerzo: 12:00 (720) - 15:00 (900)
            const isLunch = startMins >= 720 && endMins <= 900;

            // Cena: 20:00 (1200) - 23:00 (1380)
            const isDinner = startMins >= 1200 && endMins <= 1380;

            if (startMins >= endMins) {
                setMessage({ text: 'La hora de fin debe ser posterior a la de inicio', type: 'error' });
                return;
            }

            if (!isLunch && !isDinner) {
                setMessage({ text: 'El horario debe ser Almuerzo (12:00 - 15:00) o Cena (20:00 - 23:00)', type: 'error' });
                return;
            }

            setMessage(null);
        };

        validateTime();
    }, [formData.startTime, formData.endTime]);

    const getClient = async (name: string, email: string): Promise<number> => {
        const res = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: name, email })
        });

        if (res.ok) {
            const client = await res.json();
            return client.id;
        }

        const listRes = await fetch(`${API_URL}/clientes`);
        if (listRes.ok) {
            const clients: Cliente[] = await listRes.json();
            const existing = clients.find(c => c.email === email);
            if (existing) return existing.id!;
        }

        throw new Error('No se pudo registrar el cliente');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid()) return;
        setIsSubmitting(true);

        try {
            const clienteId = await getClient(formData.name, formData.email);

            const start = new Date(`${formData.date}T${formData.startTime}`);
            const end = new Date(`${formData.date}T${formData.endTime}`);

            const h = start.getHours();
            const turno = (h >= 12 && h < 16) ? 'almuerzo' : 'cena';

            const finalPayload = {
                clienteId,
                mesaId: selectedTableId,
                'fecha/hora': start.toISOString(),
                fechaFin: end.toISOString(),
                cantidadPersonas: parseInt(formData.people),
                turno
            };

            const res = await fetch(`${API_URL}/reservas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al crear reserva');
            }

            setView('success');
            refetchReservations();
        } catch (err: unknown) {
            let errorMessage = 'Error inesperado';
            if (err instanceof Error) errorMessage = err.message;
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            startTime: '',
            endTime: '',
            people: '',
            name: '',
            email: ''
        });
        setSelectedTableId(null);
        setMessage(null);
        setView('form');
    };

    if (view === 'success') {
        const table = tables.find(t => t.id === selectedTableId);
        return (
            <main className="container">
                <Link to="/admin" className="admin-link">Administración</Link>
                <header className="header">
                    <span className="header-line"></span>
                    <h1>La Maison</h1>
                    <p className="tagline">Reserve su experiencia gastronómica</p>
                    <span className="header-line"></span>
                </header>
                <Confirmation data={formData} table={table} onReset={resetForm} />
            </main>
        );
    }

    return (
        <main className="container">
            <Link to="/admin" className="admin-link">Administración</Link>

            <header className="header">
                <span className="header-line"></span>
                <h1>La Maison</h1>
                <p className="tagline">Reserve su experiencia gastronómica</p>
                <span className="header-line"></span>
            </header>

            {message && (
                <div className={`mensaje ${message.type}`}>
                    {message.text}
                </div>
            )}

            <ReservationForm
                {...formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isValid={isValid()}
                isSubmitting={isSubmitting}
            >
                <TableGrid
                    tables={tables}
                    reservations={reservations}
                    date={formData.date}
                    startTime={formData.startTime}
                    endTime={formData.endTime}
                    people={parseInt(formData.people)}
                    selectedTableId={selectedTableId}
                    onSelect={setSelectedTableId}
                />
            </ReservationForm>

            <footer className="footer">
                <p>La Maison — Av. del Libertador 1234, Buenos Aires</p>
            </footer>
        </main>
    );
};

export default Home;
