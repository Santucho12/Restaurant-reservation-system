import { Reserva } from "../models/Reserva";

export interface IObserver {
    update(reserva: Reserva): void;
}

export interface ISubject {
    addObserver(observer: IObserver): void;
    removeObserver(observer: IObserver): void;
    notifyObservers(): void;
}