# Documentación de Endpoints - Reservas

---

> **Nota:** La ruta base para todos los endpoints es:
>
>     http://localhost:3000/api/v1
>
> Reemplaza `localhost` y el puerto si tu servidor usa otros valores.

---

### GET /reservas
**Descripción:** Obtiene la lista de todas las reservas registradas en el sistema.

**Parámetros de consulta:** Ninguno.

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "clienteId": 2,
    "mesaId": 3,
    "fecha": "2026-01-19",
    "hora": "20:00",
    "estado": "confirmada"
  }
]
```
**Errores comunes:**
- 404: { "message": "No hay reservas" }
- 500: { "error": "Detalles del error" }

---

### GET /reservas/:id
**Descripción:** Obtiene la información de una reserva específica por su ID.

**Parámetros de ruta:**
- `id` (number): ID de la reserva.

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "clienteId": 2,
  "mesaId": 3,
  "fecha": "2026-01-19",
  "hora": "20:00",
  "estado": "confirmada"
}
```
**Errores comunes:**
- 404: { "message": "No hay reservas" }
- 500: { "error": "Detalles del error" }

---

### POST /reservas
**Descripción:** Crea una nueva reserva.

**Body (JSON):**
```json
{
  "clienteId": 2,
  "mesaId": 3,
  "fecha/hora": "2026-01-20T13:21:00",
  "cantidadPersonas": 2,
  "fechaFin": "2026-01-20T15:21:00",
  "turno": "almuerzo"
}
```
**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "clienteId": 2,
  "mesaId": 3,
  "fecha/hora": "2026-01-20T13:00:00",
  "cantidadPersonas": 2,
  "fechaFin": "2026-01-20T15:00:00",
  "turno": "almuerzo",
  "estado": "confirmada"
}
```
**Errores comunes:**
- 400: { "message": "Datos inválidos" }
- 400: { "message": "La reserva debe ser en horario de almuerzo (12-15) o cena (20-23)" }
- 500: { "error": "Detalles del error" }

---

### PUT /reservas/:id
**Descripción:** Actualiza los datos de una reserva existente.

**Parámetros de ruta:**
- `id` (number): ID de la reserva.

**Body (JSON):**
```json
{
  "clienteId": 2,
  "mesaId": 3,
  "fecha": "2026-01-20",
  "hora": "21:00"
}
```
**Respuesta exitosa (200):**
```json
{
  "message": "Reserva actualizada"
}
```
**Errores comunes:**
- 404: { "message": "Reserva no encontrada" }
- 500: { "error": "Detalles del error" }

---

### DELETE /reservas/:id
**Descripción:** Elimina una reserva por su ID.

**Parámetros de ruta:**
- `id` (number): ID de la reserva.

**Respuesta exitosa (200):**
```json
{
  "message": "Reserva eliminada"
}
```
**Errores comunes:**
- 404: { "message": "Reserva no encontrada" }
- 500: { "error": "Detalles del error" }

---


# Documentación de Endpoints - Mesas

---

### GET /mesas
**Descripción:** Obtiene la lista de todas las mesas registradas en el sistema.

**Parámetros de consulta:** Ninguno.

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "numero": 5,
    "capacidad": 4,
    "ubicacion": "Ventana"
  }
]
```
**Errores comunes:**
- 404: { "message": "No hay mesas" }
- 500: { "error": "Detalles del error" }

---

### GET /mesas/:id
**Descripción:** Obtiene la información de una mesa específica por su ID.

**Parámetros de ruta:**
- `id` (number): ID de la mesa.

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "numero": 5,
  "capacidad": 4,
  "ubicacion": "Ventana"
}
```
**Errores comunes:**
- 404: { "message": "No hay mesas" }
- 500: { "error": "Detalles del error" }

---