import dotenv from 'dotenv';
dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey_dev_only',
  jwtExpiration: '2h',
};
