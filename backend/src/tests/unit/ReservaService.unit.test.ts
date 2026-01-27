import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ReservaService from '../../services/ReservaService';
import Reserva, {
  ReservaAttributes,
  ReservaInstance,
} from '../../models/Reserva';

// Mock de Reserva y ReservaSubject
vi.mock('../../models/Reserva', () => {
  const ReservaMock = {
    create: vi.fn(),
    update: vi.fn(),
  };

  const ReservaSubjectMock = vi.fn();
  ReservaSubjectMock.prototype.addObserver = vi.fn();
  ReservaSubjectMock.prototype.setReserva = vi.fn();
  ReservaSubjectMock.prototype.notifyObservers = vi.fn();

  return {
    default: ReservaMock,
    ReservaSubject: ReservaSubjectMock,
  };
});

describe('ReservaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debería crear una reserva y notificar a los observadores', async () => {
    const mockReservaData: ReservaAttributes = {
      id: 1,
      clienteId: 1,
      mesaId: 1,
      'fecha/hora': new Date(),
      fechaFin: new Date(),
      cantidadPersonas: 4,
      turno: 'cena',
      estado: 'pendiente',
    };

    const mockReservaInstance = {
      ...mockReservaData,
    } as unknown as ReservaInstance;

    vi.mocked(Reserva.create).mockResolvedValue(mockReservaInstance);

    const result = await ReservaService.createReserva(mockReservaData);

    expect(Reserva.create).toHaveBeenCalledWith(mockReservaData);
    expect(result).toEqual(mockReservaInstance);
  });

  it('debería actualizar reservas expiradas correctamente', async () => {
    vi.mocked(Reserva.update).mockResolvedValue([1]);

    await ReservaService.updateExpiredReservations();

    expect(Reserva.update).toHaveBeenCalled();
    const callArgs = vi.mocked(Reserva.update).mock.calls[0];
    expect(callArgs[0]).toEqual({ estado: 'finalizada' });
    expect(callArgs[1]).toHaveProperty('where');
  });

  it('debería lanzar un error si falla la creación de la reserva en la base de datos', async () => {
    const mockReservaData: ReservaAttributes = {
      id: 1,
      clienteId: 1,
      mesaId: 1,
      'fecha/hora': new Date(),
      fechaFin: new Date(),
      cantidadPersonas: 4,
      turno: 'cena',
      estado: 'pendiente',
    };

    const error = new Error('Error de base de datos');
    vi.mocked(Reserva.create).mockRejectedValue(error);

    await expect(ReservaService.createReserva(mockReservaData)).rejects.toThrow(
      'Error de base de datos',
    );
  });

  it('debería manejar errores silenciosamente y loguear el error cuando falla la actualización de reservas expiradas', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Fallo en actualización');

    vi.mocked(Reserva.update).mockRejectedValue(error);

    await ReservaService.updateExpiredReservations();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error actualizando reservas expiradas:',
      error,
    );

    consoleSpy.mockRestore();
  });

  it('debería retornar la instancia creada con los datos correctos', async () => {
    const mockReservaData: ReservaAttributes = {
      id: 20,
      clienteId: 2,
      mesaId: 3,
      'fecha/hora': new Date(),
      fechaFin: new Date(),
      cantidadPersonas: 2,
      turno: 'almuerzo',
      estado: 'confirmada',
    };

    const mockReservaInstance = {
      ...mockReservaData,
    } as unknown as ReservaInstance;
    vi.mocked(Reserva.create).mockResolvedValue(mockReservaInstance);

    const result = await ReservaService.createReserva(mockReservaData);

    expect(result.id).toBe(20);
    expect(result.clienteId).toBe(2);
  });
});
