const { mockedReservaService } = vi.hoisted(() => {
  return {
    mockedReservaService: {
      createReserva: vi.fn(),
    },
  };
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import Server from '../../config/appConfig';
import Reserva, { ReservaInstance } from '../../models/Reserva';

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

import { ReservationValidator } from '../../patterns/strategies/ReservationValidator';

vi.mock('../../patterns/strategies/SuperposicionRule', () => ({
  SuperposicionRule: class { },
}));

vi.mock('../../patterns/strategies/CapacidadRule', () => ({
  CapacidadRule: class { },
}));

vi.mock('../../patterns/strategies/TurnoRule', () => ({
  TurnoRule: class { },
}));

// Mock Factory
vi.mock('../../patterns/factories/ReservaFactory', () => ({
  ReservaFactory: {
    createValidator: vi.fn().mockImplementation(() => new ReservationValidator()),
    createReserva: mockedReservaService.createReserva,
  },
}));

const app = Server.getInstance().getApp();

describe('API de reservas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedReservaService.createReserva.mockResolvedValue({ id: 1 });
    vi.restoreAllMocks();
    vi.spyOn(ReservationValidator.prototype, 'addRule').mockImplementation(
      () => { },
    );
    vi.spyOn(ReservationValidator.prototype, 'validateAll').mockResolvedValue(
      undefined,
    );
  });

  describe('GET /api/v1/reservas', () => {
    it('should return 200 and all reservas', async () => {
      const mockReservas = [{ id: 1 }];
      vi.mocked(Reserva.findAll).mockResolvedValue(
        mockReservas as unknown as ReservaInstance[],
      );

      const response = await request(app).get('/api/v1/reservas');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReservas);
    });

    it('should return 500 on error', async () => {
      const error = new Error('DB Error');
      vi.mocked(Reserva.findAll).mockRejectedValue(error);

      const response = await request(app).get('/api/v1/reservas');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/v1/reservas/:id', () => {
    it('deberia retornar un error con un status code de 200', async () => {
      const mockReserva = { id: 1 };
      vi.mocked(Reserva.findByPk).mockResolvedValue(
        mockReserva as unknown as ReservaInstance,
      );

      const response = await request(app).get('/api/v1/reservas/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReserva);
    });

    it('deberia retornar un error con un status code de 404', async () => {
      vi.mocked(Reserva.findByPk).mockResolvedValue(null);

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

      vi.spyOn(ReservationValidator.prototype, 'validateAll').mockRejectedValue(
        error as unknown,
      );

      const response = await request(app).post('/api/v1/reservas').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: errorMsg });
    });

    it('deberia retornar un error con un status code de 500 para otros errores', async () => {
      const error = new Error('Error inesperado');
      mockedReservaService.createReserva.mockRejectedValue(error);

      vi.spyOn(ReservationValidator.prototype, 'validateAll').mockResolvedValue(
        undefined,
      );

      const response = await request(app).post('/api/v1/reservas').send({});

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/v1/reservas/:id', () => {
    it('deberia actualizar una reserva y retornar un status code de 200', async () => {
      vi.mocked(Reserva.update).mockReturnValue(Promise.resolve([1]));

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
      vi.mocked(Reserva.findByPk).mockResolvedValue(
        mockReservaInstance as unknown as ReservaInstance,
      );

      const response = await request(app).delete('/api/v1/reservas/1');

      expect(response.status).toBe(200);
    });

    it('deberia retornar un error con un status code de 404 si no se encuentra la reserva', async () => {
      vi.mocked(Reserva.findByPk).mockResolvedValue(null);

      const response = await request(app).delete('/api/v1/reservas/999');

      expect(response.status).toBe(404);
    });
  });
});
