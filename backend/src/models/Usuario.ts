import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/dbConfig';

interface UsuarioAttributes {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id'> {}

class Usuario
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes
{
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password_hash!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const db = Database.getInstance();

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    tableName: 'usuarios',
  },
);

export default Usuario;
