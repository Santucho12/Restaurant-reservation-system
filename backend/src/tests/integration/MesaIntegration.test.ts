import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import Server from '../../config/appConfig';
import Mesa, { MesaInstance } from '../../models/Mesa';

// Mock de la base de datos para la conexion
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

// Mock del modelo Mesa
vi.mock('../../models/Mesa', () => {
  return {
    default: {
      findAll: vi.fn(),
      findByPk: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn(),
    },
  };
});

// Mock del modelo Usuario para evitar inicialización con DB mock
vi.mock('../../models/Usuario', () => ({
  default: {
    init: vi.fn(),
    findOne: vi.fn(),
  },
}));

import { Request, Response, NextFunction } from 'express';
// Mock del middleware de auth para bypass
vi.mock('../../middleware/authMiddleware', () => ({
  authenticate: (req: Request, res: Response, next: NextFunction) => next(),
}));

const app = Server.getInstance().getApp();

describe('Api de Mesas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/mesas', () => {
    it('deberia retornar un status code de 200 y todas las mesas', async () => {
      const mockMesas = [{ id: 1, numeroMesa: 1 }];
      vi.mocked(Mesa.findAll).mockResolvedValue(
        mockMesas as unknown as MesaInstance[],
      );

      const response = await request(app).get('/api/v1/mesas');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMesas);
    });

    it('deberia retornar un error con un status code de 404 si no se encuentran mesas (mocking null return)', async () => {
      vi.mocked(Mesa.findAll).mockResolvedValue(
        null as unknown as MesaInstance[],
      );

      const response = await request(app).get('/api/v1/mesas');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'No hay mesas' });
    });

    it('deberia retornar un error con un status code de 500 en caso de error', async () => {
      const error = new Error('Database error');
      vi.mocked(Mesa.findAll).mockRejectedValue(error);

      const response = await request(app).get('/api/v1/mesas');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/v1/mesas/:id', () => {
    it('deberia retornar un status code de 200 y la mesa', async () => {
      const mockMesa = { id: 1, numeroMesa: 1 };
      vi.mocked(Mesa.findByPk).mockResolvedValue(
        mockMesa as unknown as MesaInstance,
      );

      const response = await request(app).get('/api/v1/mesas/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMesa);
    });

    it('should return 404 if mesa not found', async () => {
      vi.mocked(Mesa.findByPk).mockResolvedValue(null);

      const response = await request(app).get('/api/v1/mesas/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/mesas', () => {
    it('deberia crear una mesa y retornar un status code de 201', async () => {
      const newMesaData = { numeroMesa: 1, capacidad: 4, ubicacion: 'adentro' };
      const mockMesa = { id: 1, ...newMesaData };
      vi.mocked(Mesa.create).mockResolvedValue(
        mockMesa as unknown as MesaInstance,
      );

      const response = await request(app)
        .post('/api/v1/mesas')
        .send(newMesaData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockMesa);
    });
  });

  describe('PUT /api/v1/mesas/:id', () => {
    it('deberia actualizar una mesa y retornar un status code de 200', async () => {
      vi.mocked(Mesa.update).mockReturnValue(
        Promise.resolve([1] as unknown as [number]),
      );

      const response = await request(app)
        .put('/api/v1/mesas/1')
        .send({ capacidad: 6 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Mesa actualizada' });
    });

    it('deberia retornar un error con un status code de 404 si la actualizacion falla (mocking falsy return)', async () => {
      vi.mocked(Mesa.update).mockReturnValue(
        Promise.resolve([0] as unknown as [number]),
      ); // or null
      vi.mocked(Mesa.update).mockReturnValue(
        null as unknown as Promise<[number]>,
      );

      const response = await request(app)
        .put('/api/v1/mesas/1')
        .send({ capacidad: 6 });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/mesas/:id', () => {
    it('deberia eliminar una mesa y retornar un status code de 200', async () => {
      const mockDestroy = vi.fn();
      const mockMesaInstance = { destroy: mockDestroy };
      vi.mocked(Mesa.findByPk).mockResolvedValue(
        mockMesaInstance as unknown as MesaInstance,
      );

      const response = await request(app).delete('/api/v1/mesas/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Mesa eliminada satisfactoriamente',
      });
      expect(mockDestroy).toHaveBeenCalled();
    });

    it('deberia retornar un error con un status code de 404 si la eliminacion falla', async () => {
      vi.mocked(Mesa.findByPk).mockResolvedValue(null);

      const response = await request(app).delete('/api/v1/mesas/999');

      expect(response.status).toBe(404);
    });
  });
});
