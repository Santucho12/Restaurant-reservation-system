import Usuario from '../models/Usuario';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/authConfig';

class AuthService {
  public async login(email: string, password: string): Promise<string> {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Access password_hash from dataValues if direct access fails (polyglot fix)
    const hash =
      usuario.password_hash ||
      (usuario.dataValues as { password_hash: string }).password_hash;

    if (!hash) {
      // Should not happen if DB is consistent
      throw new Error('Error de integridad de datos');
    }

    const isPasswordValid = await bcrypt.compare(password, hash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      authConfig.jwtSecret as string,
      { expiresIn: authConfig.jwtExpiration as jwt.SignOptions['expiresIn'] },
    );

    return token;
  }

  public async register(
    nombre: string,
    email: string,
    password: string,
  ): Promise<Usuario> {
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const password_hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password_hash,
    });

    return nuevoUsuario;
  }
}

export default new AuthService();
