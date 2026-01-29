import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Server from '../../config/appConfig';
import Database from '../../config/dbConfig';

const server = Server.getInstance();
const app = server.getApp();
const db = Database.getInstance();

describe('Pruebas de Integración de Autenticación', () => {
  beforeAll(async () => {
    await db.connect();
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close connection
  });

  let validToken = '';

  it('debería registrar y luego iniciar sesión exitosamente', async () => {
    const regResponse = await request(app).post('/api/v1/register').send({
      nombre: 'Administrador Pruebas',
      email: 'admin@test.com',
      password: 'password123',
    });

    expect(regResponse.status).toBe(201);

    const loginResponse = await request(app).post('/api/v1/login').send({
      email: 'admin@test.com',
      password: 'password123',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    validToken = loginResponse.body.token;
  });

  it('debería fallar el inicio de sesión con contraseña incorrecta', async () => {
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
