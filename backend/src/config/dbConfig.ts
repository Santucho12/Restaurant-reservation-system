import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'restaurant_reservation_system',
  process.env.DB_USER || 'userrrs',
  process.env.DB_PASSWORD || 'metodologia2',
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: '-03:00',
    logging: false,
  },
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexion exitosa a la base de datos');

    await sequelize.sync({ force: false });
    console.log('Base de datos y tablas creadas correctamente.');
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
  }
};

export const createDatabaseIfNotExists = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'userrrs',
    password: process.env.DB_PASSWORD || 'metodologia2',
    port: Number(process.env.DB_PORT) || 3306,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`,
  );
  console.log(`📦 Base de datos '${process.env.DB_NAME}' verificada o creada`);
  await connection.end();
};

export default sequelize;
