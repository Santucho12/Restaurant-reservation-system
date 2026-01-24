import { Model, DataTypes } from 'sequelize';
import Database from '../config/dbConfig';

export interface MesaAttributes {
  id: number;
  numeroMesa: number;
  capacidad: number;
  ubicacion: 'adentro' | 'afuera';
}

export interface MesaInstance extends Model<MesaAttributes>, MesaAttributes {}

const Mesa = Database.getInstance().sequelize.define<MesaInstance>(
  'Mesa',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    numeroMesa: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'numero_mesa',
    },
    capacidad: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.ENUM('adentro', 'afuera'),
      allowNull: false,
    },
  },
  {
    tableName: 'Mesa',
    modelName: 'Mesa',
    timestamps: true,
  },
);

export default Mesa;
