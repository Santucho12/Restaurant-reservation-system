import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import ClienteController from '../../controllers/ClienteController';
import Cliente, { ClienteInstance } from '../../models/Cliente';
import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';

// Mock del modelo Cliente
vi.mock('../../models/Cliente', () => ({
  default: {
    create: vi.fn(),
    findAll: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  },
}));

describe('ClienteController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: Mock;
  let statusMock: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({ json: jsonMock }));
    req = {};
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('debería retornar 400 y mensaje de "cliente ya existente" si ocurre UniqueConstraintError', async () => {
    req.body = { nombre: 'Test', email: 'test@example.com' };
    const error = new UniqueConstraintError({
      message: 'Duplicate entry',
      errors: [],
    });

    vi.mocked(Cliente.create).mockRejectedValue(error);

    await ClienteController.createCliente(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'cliente ya existente' });
  });

  it('debería crear un cliente correctamente', async () => {
    req.body = { nombre: 'Test', email: 'new@example.com' };
    const mockCliente = { id: 1, ...req.body };

    vi.mocked(Cliente.create).mockResolvedValue(
      mockCliente as unknown as ClienteInstance,
    );

    await ClienteController.createCliente(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(mockCliente);
  });
});
