import { http, HttpResponse } from 'msw';
import { API_URL } from '../../src/config';

export const handlers = [
    http.get(`${API_URL}/mesas`, () => {
        return HttpResponse.json([
            { id: 1, numeroMesa: 1, capacidad: 4, ubicacion: 'adentro' },
            { id: 2, numeroMesa: 2, capacidad: 2, ubicacion: 'afuera' }
        ]);
    }),

    http.get(`${API_URL}/reservas`, () => {
        return HttpResponse.json([]);
    }),

    http.get(`${API_URL}/clientes`, () => {
        return HttpResponse.json([]);
    }),

    http.post(`${API_URL}/clientes`, async () => {
        return HttpResponse.json({ id: 99, nombre: 'Test User', email: 'test@example.com' }, { status: 201 });
    }),

    http.post(`${API_URL}/reservas`, async () => {
        return HttpResponse.json({
            id: 100,
            mensaje: 'Reserva creada con éxito',
            fecha: new Date().toISOString()
        }, { status: 201 });
    }),
];
