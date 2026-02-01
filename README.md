# Sistema Web de Reservas para Restaurante (Para Usuarios) - La Maison

## Sobre el Proyecto

Este proyecto es un sistema web que permite a los clientes reservar mesas en un restaurante de manera rápida y sencilla.

Con este sistema, los usuarios pueden:

- Reservar una mesa fácilmente.
- Consultar disponibilidad según cantidad de personas, fecha y turno (almuerzo o cena).
- Recibir un email de confirmación y cancelar la reserva si lo desean (avisar a administracion para cancelar)

El sistema integra un frontend interactivo con un formulario de reserva y un panel de administrador para la creacion de mesas y edicion de reservas, un backend con la lógica de reservas y una base de datos para gestionar la información y evitar conflictos de disponibilidad.

---

## Integrantes

- Santiago Segal
- Nicolas Cordano
- Abner Grgurich

---

## Correr el proyecto

1. Clonar el repositorio e instalar dependencias en el backend y en el frontend:  
   ```bash
   git clone https://github.com/Santucho12/Restaurant-reservation-system.git
   Una vez ubicados en la carpeta root del proyecto

   cd backend
   npm install

   luego:

   cd ..
   cd frontend
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

   cd frontend
   npm run dev

   ```


---

## Cómo Funciona

1. El usuario accede a la web y encuentra el formulario **“Reserva de mesas”**.
2. Elige una fecha (mediante calendario).
3. Ingresa hora inicio y hora fin de su reserva
4. Indica cuántas personas asistirán.
5. El sistema muestra los turnos disponibles para esa fecha y horario.
6. Ingresa su nombre completo y email.
7. Se genera la reserva y el usuario recibe un email de confirmación.

La validación se realiza en tiempo real usando la base de datos para evitar reservas duplicadas.

---

## Patrones de Diseño Utilizados

### Singleton
- **Función:** Nos aseguramos que las clases Server y Database este instanciada de manera unica compartida a nivel global. En el caso de la Database nos permite mantener una sola conexion activa a la base de datos.
- **Ventaja:** Optimizamos recursos y evitamos conflictos, evitamos que se abran multiples conexiones innecesarias cada vez que una parte del sistema necesita acceder a los datos.

### Strategy
- **Función:** Definimos una serie de validaciones y los hacemos intercambiables. Cada strategy encapsula una regla de negocio especifica para aceptar o rechazar una reserva
- **Ventaja:** Nos permite agregar, quitar o modificar reglas de validacion de forma independiente sin tocar el codigo principal del controlador, haciendo el sistema mas flexible y facil de mantener (Open/closed)
  
### Factory
- **Función:** Centraliza la complejida de crear el objeto validador. En nuestro caso el metodo validador createValidator no solo instancia el validador, sino que tambien le inyecta automaticamente todas las reglas (strategies) necesarias antes de devolverlo.
- **Ventaja:** Desacopla la creación del uso. El controlador de reservas no necesita saber que reglas existen ni como configurarlas, simplemente pide un validador listo para usar, reduciendo la dependencia entre componentes.
  
### Observer
- **Función:** Permite enviar notificaciones automáticas (ej: emails) al crear o cancelar reservas.
- **Ventaja:** Facilita la extensión del sistema para nuevas notificaciones sin modificar la lógica principal.

---

## Requisitos para el Funcionamiento

### Frontend

- **Tecnologías:** React + vite
- **Extras opcionales:** Calendario
- **Funcionalidades:**
    - Formulario paso a paso para reservas
    - Mostrar mesas disponibles acorde al pedido
    - Confirmación visual de la reserva

### Backend

- **Tecnologías:** Node.js + Express
- **Estructura modular:** routes, controllers, services, models, repositories, singleton, strategies, observers
- **Funcionalidades:**
    - Gestión de reservas y disponibilidad
    - Validación en tiempo real
    - Envío de emails de confirmación

### Base de Datos

- **DB:** MySQL
- **Estructura:**
    - **Cliente:** id, nombre, email
    - **Mesa:** id, número, capacidad, ubicación
    - **Reserva:** id, cliente, mesa, fecha/hora, cantidad de personas, turno (almuerzo/cena), estado
    - **Usuario:**: id, nombre, email, password_hash
- **Funcionalidades:**
    - Almacenamiento de reservas, clientes y administradores (Usuario)
    - Verificación de disponibilidad
    - Cancelación de reservas

## Estructura del Proyecto

## 🚀 Estructura de Directorios Corregida

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── appConfig.ts
│   │   │   ├── authConfig.ts
│   │   │   └── dbConfig.ts
│   │   ├── controllers/
│   │   │   ├── ClienteController.ts
│   │   │   ├── MesaController.ts
│   │   │   └── ReservaController.ts
│   │   ├── models/
│   │   │   ├── Cliente.ts
│   │   │   ├── Mesa.ts
│   │   │   ├── ModelsRelations.ts
│   │   │   ├── Reserva.ts
│   │   │   └── Usuario.ts
│   │   ├── patterns/
│   │   │   ├── factories/
│   │   │   │   └── ReservaFactory.ts
│   │   │   ├── observers/
│   │   │   │   ├── EmailNotifier.ts
│   │   │   │   └── Observer.ts
│   │   │   └── strategies/
│   │   │       ├── CapacidadRule.ts
│   │   │       ├── ReservationValidator.ts
│   │   │       ├── SuperposicionRule.ts
│   │   │       ├── TurnoRule.ts
│   │   │       └── ValidacionRule.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── clienteRoutes.ts
│   │   │   ├── mesaRoutes.ts
│   │   │   └── reservaRoutes.ts
│   │   └── services/
│   │       ├── AuthService.ts
│   │       └── ReservaService.ts
│   ├── .env
│   └── app.ts
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── styles/
    │   ├── types/
    │   ├── App.tsx
    │   ├── config.ts
    │   ├── main.tsx
    │   └── index.css
    └── index.html
