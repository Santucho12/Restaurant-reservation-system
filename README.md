# Sistema Web de Reservas para Restaurante (Para Usuarios) - La Maison

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

## Correr el proyecto

1. Clonar el repositorio e instalar dependencias en el backend:  
   ```bash
   git clone https://github.com/Santucho12/Restaurant-reservation-system.git
   Una vez ubicados en la carpeta root del proyecto

   cd backend
   npm install
   ```
2. Renombrar .env.template:  
   ```bash
    Cambie el nombre de <.env.template> a <.env> y llene los datos sensibles
   ```
3. Iniciar el backend:  
   ```bash
   Una vez ubicados en la carpeta root del proyecto

   cd backend
   npm run dev
   ```
4. Correr el frontend:  
   ```bash
   Una vez ubicados en la carpeta root del proyecto

   cd frontend/src
   npx -y serve

   ```


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

### Singleton
- **Función:** Nos aseguramos que la clase Server este instanciada de manera unica controlada a nivel global. 
- **Ventaja:** Evitamos que se creen multiples servidores de Express, o al menos que no se intente continuamente, evitando de esta forma conflictos de puertos y un manejo incosistente de las solicitudes

### Strategy
- **Función:** Define distintas formas de validar disponibilidad según personas, fecha y turno.
- **Ventaja:** Permite modificar o agregar reglas de validación sin afectar el código principal.

### Observer
- **Función:** Permite enviar notificaciones automáticas (ej: emails) al crear o cancelar reservas.
- **Ventaja:** Facilita la extensión del sistema para nuevas notificaciones sin modificar la lógica principal.

---

## Requisitos para el Funcionamiento

### Frontend

- **Tecnologías:** JS - HTML - CSS
- **Extras opcionales:** Calendario
- **Funcionalidades:**
    - Formularios paso a paso para reservas
    - Mostrar mesas disponibles acorde al pedido
    - Confirmación visual de la reserva
    - Conexión con el backend

### Backend

- **Tecnologías:** Node.js + Express
- **Estructura modular:** routes, controllers, services, models, repositories, singleton, strategies, observers
- **Funcionalidades:**
    - Gestión de reservas y disponibilidad
    - Validación en tiempo real
    - Envío de emails de confirmación
- **Patrones usados:** Singleton (iniciaclizacion del servidor), Strategy, Observer

### Base de Datos

- **DB:** MySQL
- **Estructura:**
    - **Cliente:** id, nombre, email
    - **Mesa:** id, número, capacidad, ubicación
    - **Reserva:** id, cliente, mesa, fecha/hora, cantidad de personas, turno (almuerzo/cena), estado
- **Funcionalidades:**
    - Almacenamiento de reservas y clientes
    - Verificación de disponibilidad
    - Cancelación de reservas

### Email

- **Funcionalidad:** Envío de confirmaciones y gestión de cancelaciones desde el correo

---

## Estructura del Proyecto

## 🚀 Estructura de Directorios Corregida

```text
.
├── backend/
│   └── src/
│       ├── config/
│       │   ├── appConfig.js
│       │   └── dbConfig.js
│       ├── routes/
│       │   ├── clienteRoutes.ts
│       │   ├── mesaRoutes.ts
│       │   └── reservaRoutes.ts
│       ├── controllers/
│       │   ├── ClienteController.ts
│       │   ├── MesaController.ts
│       │   └── ReservaController.ts
│       ├── services/
│       │   └── ReservaService.ts
│       ├── models/
│       │   ├── Cliente.ts
│       │   ├── Mesa.ts
│       │   ├── Reserva.ts
│       │   └── ModelRelations.ts
│       ├── factories/
│       │   └── ReservaFactory.ts
│       ├── strategies/
│       │   ├── CapacidadStrategy.ts
│       │   ├── SuperposicionStrategy.ts
│       │   ├── TurnoStrategy.ts
│       │   ├── ValidacionStrategy.ts
│       │   └── ValidarReserva.ts
│       └── observers/
│           ├── EmailNotifier.ts
│           └── Observers.ts
├── .env.template
├── .gitignore
│
└── frontend/
    └── src/
        ├── styles/
        │   └── style.css
        ├── app.js
        └── index.html
```