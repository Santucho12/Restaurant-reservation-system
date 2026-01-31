export interface Mesa {
    id: number;
    numero: number;
    capacidad: number;
    ubicacion: 'adentro' | 'afuera';
}

export interface BackendMesa {
    id: number;
    numeroMesa: number;
    capacidad: number;
    ubicacion: 'adentro' | 'afuera';
    numero?: number;
}

export interface Cliente {
    id?: number;
    nombre: string;
    email: string;
    telefono?: string;
}

export interface Reserva {
    id?: number;
    fecha: string; // YYYY-MM-DD
    hora: string; // HH:mm
    cantidadPersonas: number;
    clienteId?: number;
    mesaId?: number;
    estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'finalizada';
    Cliente?: Cliente;
    Mesa?: Mesa;
    'fecha/hora'?: string;
    fechaFin?: string;
    fechaHora?: string;
}

export interface User {
    email: string;
    token: string;
}

export interface FetchResponse<T> {
    data: T;
    error?: string;
}
