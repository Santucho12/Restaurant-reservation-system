import Usuario from '../models/Usuario';
import bcrypt from 'bcrypt';

export const createDefaultAdmin = async (): Promise<void> => {
  try {
    const adminEmail = 'admin@admin.com';
    const existingAdmin = await Usuario.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const password = 'admin';
      const password_hash = await bcrypt.hash(password, 10);

      await Usuario.create({
        nombre: 'admin',
        email: adminEmail,
        password_hash,
      });

      console.log('✅ Usuario admin predeterminado creado correctamente');
    } else {
      console.log('ℹ️ Usuario admin predeterminado ya existe');
    }
  } catch (error) {
    console.error('❌ Error al crear usuario admin predeterminado:', error);
  }
};
