import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CapacidadRule } from '../../patterns/strategies/CapacidadRule';
import { SuperposicionRule } from '../../patterns/strategies/SuperposicionRule';
import { TurnoRule } from '../../patterns/strategies/TurnoRule';
import Mesa, { MesaInstance } from '../../models/Mesa';
import Reserva, { ReservaInstance } from '../../models/Reserva';
import { ValidationData } from '../../patterns/strategies/ValidacionRule';

// Modelos mockeados
vi.mock('../../models/Mesa', () => ({
  default: {
    findByPk: vi.fn(),
  },
}));

vi.mock('../../models/Reserva', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock('sequelize', () => {
  return {
    Op: {
      ne: Symbol('ne'),
      lt: Symbol('lt'),
      gt: Symbol('gt'),
    },
    Model: class {},
    DataTypes: {},
  };
});

describe('ValidationRules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CapacidadRule', () => {
    it('debería validar correctamente si la capacidad es suficiente', async () => {
      const rule = new CapacidadRule();
      const mockMesa = { id: 1, capacidad: 4 } as unknown as MesaInstance;
      const datos = { mesaId: 1, capacidad: 2 } as unknown as ValidationData;

      vi.mocked(Mesa.findByPk).mockResolvedValue(mockMesa);

      await expect(rule.validar(datos)).resolves.toBeUndefined();
    });

    it('debería lanzar error si la capacidad de la mesa es insuficiente', async () => {
      const rule = new CapacidadRule();
      const mockMesa = { id: 1, capacidad: 2 } as unknown as MesaInstance;
      const datos = { mesaId: 1, capacidad: 4 } as unknown as ValidationData;

      vi.mocked(Mesa.findByPk).mockResolvedValue(mockMesa);

      await expect(rule.validar(datos)).rejects.toThrow(
        'La capacidad de la mesa (2) es insuficiente para 4 personas',
      );
    });

    it('debería lanzar error si la mesa no existe', async () => {
      const rule = new CapacidadRule();
      const datos = { mesaId: 999, capacidad: 2 } as unknown as ValidationData;

      vi.mocked(Mesa.findByPk).mockResolvedValue(null);

      await expect(rule.validar(datos)).rejects.toThrow('Mesa no encontrada');
    });
  });

  describe('SuperposicionRule', () => {
    it('debería validar si no hay superposición de horarios', async () => {
      const rule = new SuperposicionRule();
      const datos = {
        mesaId: 1,
        'fecha/hora': new Date('2023-10-27T20:00:00'),
        fechaFin: new Date('2023-10-27T22:00:00'),
      } as unknown as ValidationData;

      vi.mocked(Reserva.findOne).mockResolvedValue(null);

      await expect(rule.validar(datos)).resolves.toBeUndefined();
      expect(Reserva.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            mesaId: 1,
          }),
        }),
      );
    });

    it('debería lanzar error si hay superposición', async () => {
      const rule = new SuperposicionRule();
      const datos = {
        mesaId: 1,
        'fecha/hora': new Date('2023-10-27T20:00:00'),
        fechaFin: new Date('2023-10-27T22:00:00'),
      } as unknown as ValidationData;

      vi.mocked(Reserva.findOne).mockResolvedValue({
        id: 2,
      } as unknown as ReservaInstance);

      await expect(rule.validar(datos)).rejects.toThrow(
        'La mesa ya esta reservada en ese horario',
      );
    });
  });

  describe('TurnoRule', () => {
    it('debería validar correctamente horario de almuerzo (13:00 Local -> 16:00 UTC)', async () => {
      const rule = new TurnoRule();
      const datos = {
        'fecha/hora': new Date('2023-10-27T16:00:00Z'), // 16:00 UTC - 3 = 13:00 Local
      } as unknown as ValidationData;

      await expect(rule.validar(datos)).resolves.toBeUndefined();
    });

    it('debería validar correctamente horario de cena (21:00 Local -> 00:00 UTC)', async () => {
      const rule = new TurnoRule();
      const datos = {
        'fecha/hora': new Date('2023-10-28T00:00:00Z'), // 00:00 UTC - 3 = 21:00 Local (prev day)
      } as unknown as ValidationData;

      await expect(rule.validar(datos)).resolves.toBeUndefined();
    });

    it('debería lanzar error fuera de horario permitido (17:00 Local -> 20:00 UTC)', async () => {
      const rule = new TurnoRule();
      const datos = {
        'fecha/hora': new Date('2023-10-27T20:00:00Z'), // 20:00 UTC - 3 = 17:00 Local
      } as unknown as ValidationData;

      await expect(rule.validar(datos)).rejects.toThrow(
        'La reserva debe ser en horario de almuerzo (12-15) o cena (20-23)',
      );
    });
  });
});
