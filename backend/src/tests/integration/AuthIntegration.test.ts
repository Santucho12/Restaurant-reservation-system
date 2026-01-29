import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Server from '../../config/appConfig';
import bcrypt from 'bcrypt';
import { MesaInstance } from '../../models/Mesa';
// Mock DB
vi.mock('../../config/dbConfig', () => ({
  default: {
    getInstance: vi.fn().mockReturnValue({
      sequelize: {
        sync: vi.fn(),
        close: vi.fn(),
        define: vi.fn(),
      },
      connect: vi.fn(),
    }),
  },
}));

// Mock Models
vi.mock('../../models/Usuario', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    init: vi.fn(),
  },
}));

vi.mock('../../models/Mesa', () => ({
  default: {
    findAll: vi.fn(),
    init: vi.fn(),
  },
}));

import Usuario from '../../models/Usuario';
import Mesa from '../../models/Mesa';

const app = Server.getInstance().getApp();

describe('Pruebas de Integración de Autenticación', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  let validToken = '';

  it('debería registrar y luego iniciar sesión exitosamente', async () => {
    // 1. Configuramos mock para el registro
    vi.mocked(Usuario.findOne).mockResolvedValueOnce(null);

    // retornamos un nuevo usuario
    const newUser = {
      id: 1,
      nombre: 'Administrador Pruebas',
      email: 'admin@test.com',
      password_hash: 'hashed_password', // hash mockeado
      dataValues: { password_hash: 'hashed_password' },
    } as unknown as Usuario;
    vi.mocked(Usuario.create).mockResolvedValueOnce(newUser);

    const regResponse = await request(app).post('/api/v1/register').send({
      nombre: 'Administrador Pruebas',
      email: 'admin@test.com',
      password: 'password123',
    });

    expect(regResponse.status).toBe(201);

    // 2. Configuramos mock para el login
    // Necesitamos un hash real porque AuthService usa bcrypt.compare real
    const realHash = await bcrypt.hash('password123', 10);
    const existingUser = {
      id: 1,
      email: 'admin@test.com',
      password_hash: realHash,
      dataValues: { password_hash: realHash },
      toJSON: () => ({ id: 1, email: 'admin@test.com' }),
    } as unknown as Usuario;

    // findOne retorna el usuario con el hash real
    vi.mocked(Usuario.findOne).mockResolvedValue(existingUser);

    const loginResponse = await request(app).post('/api/v1/login').send({
      email: 'admin@test.com',
      password: 'password123',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    validToken = loginResponse.body.token;
  });

  it('debería fallar el inicio de sesión con contraseña incorrecta', async () => {
    // Configuramos mock user
    const realHash = await bcrypt.hash('password123', 10);
    const existingUser = {
      id: 1,
      email: 'admin@test.com',
      password_hash: realHash,
      dataValues: { password_hash: realHash },
    } as unknown as Usuario;
    vi.mocked(Usuario.findOne).mockResolvedValue(existingUser);

    const response = await request(app).post('/api/v1/login').send({
      email: 'admin@test.com',
      password: 'password_incorrecta',
    });

    expect(response.status).toBe(401);
  });

  it('debería bloquear el acceso a la ruta protegida de Mesa sin token', async () => {
    const response = await request(app).get('/api/v1/mesas');
    expect(response.status).toBe(401);
  });

  it('debería permitir el acceso a la ruta protegida de Mesa con un token válido', async () => {
    // Mock Mesa.findAll para que el controlador retorne exitosamente
    vi.mocked(Mesa.findAll).mockResolvedValue([] as MesaInstance[]);

    const response = await request(app)
      .get('/api/v1/mesas')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
  });

  it('debería bloquear el acceso a la ruta protegida de eliminación de Reserva sin token', async () => {
    const response = await request(app).delete('/api/v1/reservas/999');
    expect(response.status).toBe(401);
  });
});
