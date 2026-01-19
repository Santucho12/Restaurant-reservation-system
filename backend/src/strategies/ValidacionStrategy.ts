export interface ValidacionStrategy {
  validar(datos: any): Promise<void>;
}
