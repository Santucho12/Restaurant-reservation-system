import { ReservaInstance } from '../models/Reserva';

export interface IObserver {
  update(reserva: ReservaInstance): void;
}

export interface ISubject {
  addObserver(observer: IObserver): void;
  removeObserver(observer: IObserver): void;
  notifyObservers(): void;
}
