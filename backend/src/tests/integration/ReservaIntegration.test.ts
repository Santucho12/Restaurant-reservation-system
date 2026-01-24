const { mockedValidador, mockedReservaService } = vi.hoisted(() => {
  return {
    mockedValidador: vi.fn(),
    mockedReservaService: {
      createReserva: vi.fn(),
    },
  };
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import Server from '../../config/appConfig';
import Reserva from '../../models/Reserva';

// Mock de la base de datos
vi.mock('../../config/dbConfig', () => ({
  default: {
    getInstance: vi.fn().mockReturnValue({
      sequelize: {
        define: vi.fn().mockReturnValue({
          findAll: vi.fn(),
          findByPk: vi.fn(),
          create: vi.fn(),
          update: vi.fn(),
          destroy: vi.fn(),
        }),
      },
      connect: vi.fn(),
    }),
  },
}));

vi.mock('../../models/Reserva', () => ({
  default: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn().mockReturnValue(Promise.resolve([1])),
    destroy: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../../services/ReservaService', () => ({
  default: mockedReservaService,
}));

import { ValidadorReservas } from '../../strategies/ValidadorReservas';

vi.mock('../../strategies/SuperposicionStrategy', () => ({
  SuperposicionStrategy: class {},
}));

vi.mock('../../strategies/CapacidadStrategy', () => ({
  CapacidadStrategy: class {},
}));

vi.mock('../../strategies/TurnoStrategy', () => ({
  TurnoStrategy: class {},
}));

const app = Server.getInstance().getApp();

describe('API de reservas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedReservaService.createReserva.mockResolvedValue({ id: 1 });
    vi.restoreAllMocks();
    vi.spyOn(ValidadorReservas.prototype, 'agregarStrategy').mockImplementation(
      () => {},
    );
    vi.spyOn(ValidadorReservas.prototype, 'validar').mockResolvedValue(
      undefined,
    );
  });

  describe('GET /api/v1/reservas', () => {
    it('should return 200 and all reservas', async () => {
      const mockReservas = [{ id: 1 }];
      (Reserva.findAll as any).mockResolvedValue(mockReservas);

      const response = await request(app).get('/api/v1/reservas');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReservas);
    });

    it('should return 500 on error', async () => {
      const error = new Error('DB Error');
      (Reserva.findAll as any).mockRejectedValue(error);

      const response = await request(app).get('/api/v1/reservas');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/v1/reservas/:id', () => {
    it('deberia retornar un error con un status code de 200', async () => {
      const mockReserva = { id: 1 };
      (Reserva.findByPk as any).mockResolvedValue(mockReserva);

      const response = await request(app).get('/api/v1/reservas/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReserva);
    });

    it('deberia retornar un error con un status code de 404', async () => {
      (Reserva.findByPk as any).mockResolvedValue(null);

      const response = await request(app).get('/api/v1/reservas/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/reservas', () => {
    it('deberia crear una reserva y retornar un status code de 201', async () => {
      const newReservaData = { some: 'data' };
      const mockReserva = { id: 1, ...newReservaData };

      mockedReservaService.createReserva.mockResolvedValue(mockReserva);

      const response = await request(app)
        .post('/api/v1/reservas')
        .send(newReservaData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockReserva);
    });

    it('deberia retornar un error con un status code de 400 si la validacion falla con un mensaje especifico', async () => {
      const errorMsg = 'La mesa ya esta reservada en ese horario';
      const error = { message: errorMsg };

      vi.spyOn(ValidadorReservas.prototype, 'validar').mockRejectedValue(
        error as any,
      );

      const response = await request(app).post('/api/v1/reservas').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: errorMsg });
    });

    it('deberia retornar un error con un status code de 500 para otros errores', async () => {
      const error = new Error('Error inesperado');
      mockedReservaService.createReserva.mockRejectedValue(error);

      vi.spyOn(ValidadorReservas.prototype, 'validar').mockResolvedValue(
        undefined,
      );

      const response = await request(app).post('/api/v1/reservas').send({});

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/v1/reservas/:id', () => {
    it('deberia actualizar una reserva y retornar un status code de 200', async () => {
      (Reserva.update as any).mockReturnValue(Promise.resolve([1]));

      const response = await request(app)
        .put('/api/v1/reservas/1')
        .send({ estado: 'confirmada' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Reserva actualizada' });
    });
  });

  describe('DELETE /api/v1/reservas/:id', () => {
    it('deberia eliminar una reserva y retornar un status code de 200', async () => {
      const mockDestroy = vi.fn();
      const mockReservaInstance = { destroy: mockDestroy };
      (Reserva.findByPk as any).mockResolvedValue(mockReservaInstance);

      const response = await request(app).delete('/api/v1/reservas/1');

      expect(response.status).toBe(200);
    });

    it('deberia retornar un error con un status code de 404 si no se encuentra la reserva', async () => {
      (Reserva.findByPk as any).mockResolvedValue(null);

      const response = await request(app).delete('/api/v1/reservas/999');

      expect(response.status).toBe(404);
    });
  });
});
