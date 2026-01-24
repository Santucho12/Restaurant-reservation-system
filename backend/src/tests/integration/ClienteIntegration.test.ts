import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import Server from '../../config/appConfig';
import Cliente from '../../models/Cliente';

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

vi.mock('../../models/Cliente', () => {
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

const app = Server.getInstance().getApp();

describe('API de clientes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/clientes', () => {
    it('deberia retornar todos los clientes con un status code de 200', async () => {
      const mockClientes = [{ id: 1, nombre: 'Juan' }];
      (Cliente.findAll as any).mockResolvedValue(mockClientes);

      const response = await request(app).get('/api/v1/clientes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClientes);
    });

    it('deberia retornar un error con un status code de 500', async () => {
      const error = new Error('Error de la base de datos');
      (Cliente.findAll as any).mockRejectedValue(error);

      const response = await request(app).get('/api/v1/clientes');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/v1/clientes/:id', () => {
    it('deberia retornar un cliente con un status code de 200', async () => {
      const mockCliente = { id: 1, nombre: 'Juan' };
      (Cliente.findByPk as any).mockResolvedValue(mockCliente);

      const response = await request(app).get('/api/v1/clientes/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCliente);
    });

    it('deberia retornar un error con un status code de 404', async () => {
      (Cliente.findByPk as any).mockResolvedValue(null);

      const response = await request(app).get('/api/v1/clientes/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/clientes', () => {
    it('deberia crear un cliente y retornar un status code de 201', async () => {
      const newClienteData = { nombre: 'Juan', email: 'juan@test.com' };
      const mockCliente = { id: 1, ...newClienteData };
      (Cliente.create as any).mockResolvedValue(mockCliente);

      const response = await request(app)
        .post('/api/v1/clientes')
        .send(newClienteData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCliente);
    });

    it('deberia retornar un error con un status code de 500', async () => {
      const error = new Error('Creation error');
      (Cliente.create as any).mockRejectedValue(error);

      const response = await request(app)
        .post('/api/v1/clientes')
        .send({ nombre: 'Juan' });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/v1/clientes/:id', () => {
    it('deberia actualizar un cliente y retornar un status code de 200', async () => {
      // Mock update to return Promise resolving to array with meaningful count
      (Cliente.update as any).mockReturnValue(Promise.resolve([1]));

      const response = await request(app)
        .put('/api/v1/clientes/1')
        .send({ nombre: 'Juan Modificado' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Cliente actualizado' });
    });
  });

  describe('DELETE /api/v1/clientes/:id', () => {
    it('deberia eliminar un cliente y retornar un status code de 200', async () => {
      const mockDestroy = vi.fn();
      const mockClienteInstance = { destroy: mockDestroy };
      (Cliente.findByPk as any).mockResolvedValue(mockClienteInstance);

      const response = await request(app).delete('/api/v1/clientes/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Cliente eliminado satisfactoriamente',
      });
      expect(mockDestroy).toHaveBeenCalled();
    });

    it('deberia retornar un error con un status code de 404', async () => {
      (Cliente.findByPk as any).mockResolvedValue(null);

      const response = await request(app).delete('/api/v1/clientes/999');

      expect(response.status).toBe(404);
    });
  });
});
