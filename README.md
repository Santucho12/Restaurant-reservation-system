# Sistema Web de Reservas para Restaurante (Para Usuarios)

## Sobre el Proyecto

Este proyecto es un sistema web que permite a los clientes reservar mesas en un restaurante de manera rápida y sencilla.

Con este sistema, los usuarios pueden:

- Reservar una mesa fácilmente.
- Consultar disponibilidad según cantidad de personas, fecha y turno (almuerzo o cena).
- Recibir un email de confirmación y cancelar la reserva si lo desean.

El sistema integra un frontend interactivo, un backend con la lógica de reservas y una base de datos para gestionar la información y evitar conflictos de disponibilidad.

---

## Integrantes

- Santiago Segal
- Nicolas Cordano
- Abner Grgurich

---

## Cómo Funciona

1. El usuario accede a la web y encuentra el botón **“Hacer Reserva”**.
2. Indica cuántas personas asistirán.
3. Elige una fecha (mediante calendario o API).
4. Selecciona almuerzo o cena.
5. El sistema muestra los turnos disponibles para esa fecha y horario.
6. Ingresa su email.
7. Se genera la reserva y el usuario recibe un email de confirmación, con opción de cancelarla.

La validación se realiza en tiempo real usando la base de datos para evitar reservas duplicadas.

---

## Patrones de Diseño Utilizados

### Factory
- **Función:** Crea reservas de forma centralizada y consistente.
- **Ventaja:** Garantiza estructura y validaciones uniformes en todas las reservas.

### Strategy
- **Función:** Define distintas formas de validar disponibilidad según personas, fecha y turno.
- **Ventaja:** Permite modificar o agregar reglas de validación sin afectar el código principal.

### Observer
- **Función:** Permite enviar notificaciones automáticas (ej: emails) al crear o cancelar reservas.
- **Ventaja:** Facilita la extensión del sistema para nuevas notificaciones sin modificar la lógica principal.

---

## Requisitos para el Funcionamiento

### Frontend

- **Tecnologías:** React + Vite
- **Extras opcionales:** Calendario (ej: podria ser React Calendar)
- **Funcionalidades:**
    - Formularios paso a paso para reservas
    - Mostrar turnos disponibles
    - Confirmación visual de la reserva
    - Conexión con el backend

### Backend

- **Tecnologías:** Node.js + Express
- **Estructura modular:** routes, controllers, services, models, repositories, factories, strategies, observers
- **Funcionalidades:**
    - Gestión de reservas y disponibilidad
    - Validación en tiempo real
    - Envío de emails de confirmación
- **Patrones usados:** Factory, Strategy, Observer

### Base de Datos

- **DB:** FALTA DEFINIR sql/mongo?
- **Estructura:**
    - **Cliente:** id, nombre, email
    - **Mesa:** id, número, capacidad, ubicación, disponibilidad
    - **Reserva:** id, cliente, mesa, fecha/hora, cantidad de personas, turno (almuerzo/cena), estado
- **Funcionalidades:**
    - Almacenamiento de reservas y clientes
    - Verificación de disponibilidad
    - Cancelación de reservas

### Email

- **Servicios:** FALTA DEFINIR
- **Funcionalidad:** Envío de confirmaciones y gestión de cancelaciones desde el correo

### Testing

- **Backend:** Vitest (unit test) y Playwright (E2E)

---

## Estructura del Proyecto

```
backend/
├── src/
│   ├── routes/
│   │   └── reservaRoutes         # Endpoints para crear, ver y cancelar reservas
│   ├── controllers/
│   │   └── ReservaController     # Lógica de reservas
│   ├── services/
│   │   └── ReservaService        # Lógica principal y validaciones
│   ├── models/
│   │   └── Reserva               # Modelo de reserva
│   ├── factories/
│   │   └── ReservaFactory        # Creación de reservas
│   ├── strategies/
│   │   └── DisponibilidadStrategy# Validación de disponibilidad
│   ├── observers/
│   │   └── EmailNotifier         # Notificaciones por email
│   └── repositories/
│       └── ReservaRepository     # Persistencia en base de datos
├── config/
│   ├── dbConfig.js               # Configuración de base de datos
│   └── appConfig.js              # Configuración general
├── .env
├── .gitignore

frontend/
├── package.json
├── vite.config.js
├── public/
│   └── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   └── ReservaForm.jsx       # Formulario de reservas
    └── services/
        └── reservaService.js    # Conexión con backend

database/
├── init.sql                      # Creación de tablas
└── seed.sql                      # Datos de prueba

tests/
└── reserva.test.js               # definir que prueba usaremos

README.md
```
