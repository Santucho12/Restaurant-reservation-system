import Mesa from './Mesa';
import Reserva from './Reserva';
import Cliente from './Cliente';

export const defineAssociations = () => {
    Mesa.hasMany(Reserva, { foreignKey: 'mesaId' });
    Reserva.belongsTo(Mesa, { foreignKey: 'mesaId' });

    Cliente.hasMany(Reserva, { foreignKey: 'clienteId' });
    Reserva.belongsTo(Cliente, { foreignKey: 'clienteId' });
};
