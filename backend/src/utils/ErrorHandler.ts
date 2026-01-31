import { Response } from 'express';

type ErrorDetail = string | string[] | Record<string, unknown>;

class ErrorHandlerClass {
  private messages: Record<string, string> = {
    reservaNotFound: 'Reserva no encontrada',
    reservaNotDeleted: 'No se pudo eliminar la reserva',
    mesaNotFound: 'Mesa no encontrada',
    noMesas: 'No hay mesas',
    mesaNotDeleted: 'No se pudo eliminar la mesa',
    clienteNotFound: 'Cliente no encontrado',
    clienteNotDeleted: 'No se pudo eliminar el cliente',
    serverError: 'Server Internal error',
    badRequest: 'Solicitud incorrecta',
    notFound: 'Recurso no encontrado',
    unauthorized: 'No autorizado',
    forbidden: 'Prohibido',
    validationError: 'Error de validación',
  };

  public setMessage(key: string, message: string) {
    this.messages[key] = message;
  }

  public getMessage(key: string, fallback?: string) {
    return this.messages[key] || fallback || 'Error';
  }

  public error(
    res: Response,
    status: number,
    messageKey: string,
    customMessage?: string,
    details?: ErrorDetail,
    asMessage: boolean = false,
  ): Response {
    const msg = customMessage || this.getMessage(messageKey);
    let payload: Record<string, unknown>;
    if (asMessage) {
      payload = { message: msg };
      if (details) payload = { message: details };
    } else {
      payload = { error: msg };
      if (details) payload.details = details;
    }
    return res.status(status).json(payload);
  }

  public notFound(
    res: Response,
    messageKey = 'notFound',
    customMessage?: string,
  ) {
    return this.error(res, 404, messageKey, customMessage, undefined, true);
  }

  public badRequest(
    res: Response,
    messageKey = 'badRequest',
    customMessage?: string,
    details?: ErrorDetail,
  ) {
    return this.error(res, 400, messageKey, customMessage, details, true);
  }

  public serverInternalError(
    res: Response,
    error?: Error,
    customMessage?: string,
  ) {
    if (error) console.error(error);
    return this.error(res, 500, 'serverError', customMessage);
  }

  public unauthorized(res: Response, customMessage?: string) {
    return this.error(res, 401, 'unauthorized', customMessage);
  }

  public forbidden(res: Response, customMessage?: string) {
    return this.error(res, 403, 'forbidden', customMessage);
  }

  public validationError(
    res: Response,
    details?: ErrorDetail,
    customMessage?: string,
  ) {
    return this.error(res, 422, 'validationError', customMessage, details);
  }

  // Métodos específicos para recursos
  public notFoundErrorReserva(res: Response, customMessage?: string) {
    return this.notFound(res, 'reservaNotFound', customMessage);
  }
  public badRequestErrorReserva(res: Response, details?: ErrorDetail) {
    return this.badRequest(res, 'badRequest', undefined, details);
  }
  public notFoundErrorMesa(res: Response, customMessage?: string) {
    return this.notFound(res, 'mesaNotFound', customMessage);
  }
  public badRequestErrorMesa(res: Response, details?: ErrorDetail) {
    return this.badRequest(res, 'badRequest', undefined, details);
  }
  public notFoundErrorCliente(res: Response, customMessage?: string) {
    return this.notFound(res, 'clienteNotFound', customMessage);
  }
  public badRequestErrorCliente(res: Response, details?: ErrorDetail) {
    return this.badRequest(res, 'badRequest', undefined, details);
  }
}

const ErrorHandler = new ErrorHandlerClass();
export default ErrorHandler;
