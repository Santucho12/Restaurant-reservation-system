import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbConfig';

interface ClienteAttributes {
  id: number;
  nombre: string;
  email: string;
}

interface ClienteInstance extends Model<ClienteAttributes>, ClienteAttributes {}

const Cliente = sequelize.define<ClienteInstance>(
  'Cliente',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'Cliente',
    modelName: 'Cliente',
    timestamps: true,
  },
);

export default Cliente;
