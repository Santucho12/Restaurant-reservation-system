import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/dbConfig'

interface ReservaAttributes {
    id: number,
    clienteId: number,
    mesaId: number,
    'fecha/hora': Date,
    fechaFin: Date,
    cantidadPersonas: number,
    turno: 'almuerzo' | 'cena',
    estado: 'confirmada' | 'cancelada' | 'pendiente' | 'finalizada'
}

interface ReservaInstance extends Model<ReservaAttributes>, ReservaAttributes { }

const Reserva = sequelize.define<ReservaInstance>('Reserva', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    clienteId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'cliente_id'
    },
    mesaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'mesa_id'
    },
    'fecha/hora': {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fecha/hora',
    },
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fecha_fin'
    },
    cantidadPersonas: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'cantidad_personas'
    },
    turno: {
        type: DataTypes.ENUM('almuerzo', 'cena'),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('confirmada', 'cancelada', 'pendiente', 'finalizada'),
        defaultValue: 'pendiente',
        allowNull: false
    }
}, {
    tableName: 'Reserva',
    modelName: 'Reserva',
    timestamps: true
})

export default Reserva