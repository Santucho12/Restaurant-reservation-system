import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'restaurant_reservation_system',
    process.env.DB_USER || 'user-rrs',
    process.env.DB_PASSWORD || 'metodologia-2',
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        timezone: '-03:00',
        logging: false
    }
)

export default sequelize;