const API_URL = 'http://localhost:3000/api/v1';

let mesaSeleccionada = null;
let todasLasMesas = [];
let todasLasReservas = [];

const elementos = {
    fecha: document.getElementById('fecha'),
    horaInicio: document.getElementById('hora-inicio'),
    horaFin: document.getElementById('hora-fin'),
    personas: document.getElementById('personas'),
    nombre: document.getElementById('nombre'),
    email: document.getElementById('email'),
    btnReservar: document.getElementById('btn-reservar'),
    mesasContainer: document.getElementById('mesas-container'),
    mesasAviso: document.getElementById('mesas-aviso'),
    mensaje: document.getElementById('mensaje'),
    formulario: document.getElementById('formulario'),
    confirmacion: document.getElementById('confirmacion')
};

document.addEventListener('DOMContentLoaded', init);

function init() {
    const hoy = new Date().toISOString().split('T')[0];
    elementos.fecha.min = hoy;
    elementos.fecha.value = hoy;

    cargarDatos();

    elementos.fecha.addEventListener('change', actualizarMesas);
    elementos.horaInicio.addEventListener('change', validarHorarioYActualizar);
    elementos.horaFin.addEventListener('change', validarHorarioYActualizar);
    elementos.personas.addEventListener('change', actualizarMesas);
    elementos.nombre.addEventListener('input', validarFormulario);
    elementos.email.addEventListener('input', validarFormulario);
    elementos.btnReservar.addEventListener('click', realizarReserva);
}

async function cargarDatos() {
    try {
        const [mesasRes, reservasRes] = await Promise.all([
            fetch(`${API_URL}/mesas`),
            fetch(`${API_URL}/reservas`)
        ]);

        todasLasMesas = mesasRes.ok ? await mesasRes.json() : [];
        todasLasReservas = reservasRes.ok ? await reservasRes.json() : [];

        actualizarMesas();
    } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor', 'error');
    }
}

function validarHorarioYActualizar() {
    const inicio = elementos.horaInicio.value;
    const fin = elementos.horaFin.value;

    ocultarMensaje();

    if (inicio && fin) {
        const [hInicio] = inicio.split(':').map(Number);

        // Validar rango permitido (12-15 o 20-23)
        const esAlmuerzo = hInicio >= 12 && hInicio < 15;
        const esCena = hInicio >= 20 && hInicio < 23;

        if (!esAlmuerzo && !esCena) {
            mostrarMensaje('El horario debe ser Almuerzo (12:00 - 15:00) o Cena (20:00 - 23:00)', 'error');
            elementos.mesasContainer.innerHTML = '';
            mesaSeleccionada = null;
            validarFormulario();
            return;
        }

        if (inicio >= fin) {
            mostrarMensaje('La hora de fin debe ser posterior a la de inicio', 'error');
            elementos.mesasContainer.innerHTML = '';
            mesaSeleccionada = null;
            validarFormulario();
            return;
        }
    }

    actualizarMesas();
}

function actualizarMesas() {
    const fecha = elementos.fecha.value;
    const horaInicio = elementos.horaInicio.value;
    const horaFin = elementos.horaFin.value;
    const personas = parseInt(elementos.personas.value);

    mesaSeleccionada = null;
    validarFormulario();

    if (!fecha || !horaInicio || !horaFin || !personas) {
        elementos.mesasContainer.innerHTML = '';
        elementos.mesasAviso.classList.remove('oculto');
        return;
    }

    if (document.querySelector('.mensaje.error')) return;

    elementos.mesasAviso.classList.add('oculto');

    const fechaInicioSeleccion = new Date(`${fecha}T${horaInicio}`);
    const fechaFinSeleccion = new Date(`${fecha}T${horaFin}`);

    const reservasConflictivas = todasLasReservas.filter(r => {
        if (r.estado === 'cancelada' || r.estado === 'finalizada') return false;

        const rInicio = new Date(r['fecha/hora']);
        const rFin = new Date(r.fechaFin);

        return (rInicio < fechaFinSeleccion && rFin > fechaInicioSeleccion);
    });

    const mesasOcupadasIds = reservasConflictivas.map(r => r.mesaId);

    elementos.mesasContainer.innerHTML = todasLasMesas.map(mesa => {
        const ocupada = mesasOcupadasIds.includes(mesa.id);
        const sinCapacidad = mesa.capacidad < personas;

        let clases = 'mesa-card';
        if (ocupada) clases += ' ocupada';
        if (sinCapacidad) clases += ' sin-capacidad';

        const ubicacionTexto = mesa.ubicacion === 'adentro' ? 'Interior' : 'Terraza';

        let estadoHtml = '';
        if (ocupada) {
            estadoHtml = '<div class="mesa-estado">Reservada</div>';
        } else if (sinCapacidad) {
            estadoHtml = '<div class="mesa-estado">Excede Capacidad</div>';
        }

        return `
            <div class="${clases}" 
                 data-id="${mesa.id}"
                 data-numero="${mesa.numeroMesa}"
                 data-ubicacion="${ubicacionTexto}"
                 onclick="seleccionarMesa(${mesa.id}, ${ocupada || sinCapacidad})">
                <div class="mesa-numero">${mesa.numeroMesa}</div>
                <div class="mesa-capacidad">${mesa.capacidad} personas</div>
                <div class="mesa-ubicacion">${ubicacionTexto}</div>
                ${estadoHtml}
            </div>
        `;
    }).join('');

    const disponibles = todasLasMesas.filter(m =>
        !mesasOcupadasIds.includes(m.id) && m.capacidad >= personas
    );

    if (disponibles.length === 0 && todasLasMesas.length > 0) {
        elementos.mesasAviso.textContent = 'No hay mesas disponibles para este horario';
        elementos.mesasAviso.classList.remove('oculto');
    }
}

function seleccionarMesa(id, deshabilitada) {
    if (deshabilitada) return;

    document.querySelectorAll('.mesa-card').forEach(card => {
        card.classList.remove('seleccionada');
    });

    const card = document.querySelector(`.mesa-card[data-id="${id}"]`);
    if (card) {
        card.classList.add('seleccionada');
        mesaSeleccionada = id;
    }

    validarFormulario();
}

function validarFormulario() {
    const camposLlenos = elementos.fecha.value &&
        elementos.horaInicio.value &&
        elementos.horaFin.value &&
        elementos.personas.value &&
        mesaSeleccionada &&
        elementos.nombre.value.trim() &&
        elementos.email.value.trim() &&
        elementos.email.value.includes('@') &&
        !document.querySelector('.mensaje.error');

    elementos.btnReservar.disabled = !camposLlenos;
}

async function realizarReserva() {
    elementos.btnReservar.disabled = true;
    elementos.btnReservar.textContent = 'Procesando...';
    ocultarMensaje();

    try {
        const clienteId = await obtenerClienteId(
            elementos.nombre.value.trim(),
            elementos.email.value.trim()
        );

        const fechaHora = new Date(`${elementos.fecha.value}T${elementos.horaInicio.value}`);
        const fechaFin = new Date(`${elementos.fecha.value}T${elementos.horaFin.value}`);

        const hora = fechaHora.getHours();
        const turno = (hora >= 12 && hora < 16) ? 'almuerzo' : 'cena';

        const reserva = {
            clienteId: clienteId,
            mesaId: mesaSeleccionada,
            'fecha/hora': fechaHora.toISOString(),
            fechaFin: fechaFin.toISOString(),
            cantidadPersonas: parseInt(elementos.personas.value),
            turno: turno
        };

        const response = await fetch(`${API_URL}/reservas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear la reserva');
        }

        mostrarConfirmacion();

    } catch (error) {
        mostrarMensaje(error.message || 'Ocurrió un error inesperado', 'error');
        elementos.btnReservar.disabled = false;
        elementos.btnReservar.textContent = 'Confirmar Reserva';
    }
}

async function obtenerClienteId(nombre, email) {
    const crearResponse = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email })
    });

    if (crearResponse.ok) {
        const cliente = await crearResponse.json();
        return cliente.id;
    }

    const listaResponse = await fetch(`${API_URL}/clientes`);
    if (!listaResponse.ok) throw new Error('Error al obtener clientes');

    const clientes = await listaResponse.json();
    const existente = clientes.find(c => c.email === email);

    if (existente) return existente.id;

    throw new Error('No se pudo registrar el cliente');
}

function mostrarConfirmacion() {
    const mesaCard = document.querySelector(`.mesa-card[data-id="${mesaSeleccionada}"]`);

    document.getElementById('conf-fecha').textContent = formatearFecha(elementos.fecha.value);
    // document.getElementById('conf-turno').textContent = elementos.turno.value === 'almuerzo' ? 'Almuerzo' : 'Cena';
    // Reemplazamos Turno por Hora en confirmacion si existe el elemento en HTML (asumimos que sí o no se mostrara)
    const turnoLabel = document.querySelector('#conf-turno');
    if (turnoLabel) {
        turnoLabel.parentElement.querySelector('.detalle-label').textContent = 'Horario';
        turnoLabel.textContent = `${elementos.horaInicio.value} - ${elementos.horaFin.value}`;
    }

    document.getElementById('conf-mesa').textContent = `Mesa ${mesaCard.dataset.numero} — ${mesaCard.dataset.ubicacion}`;
    document.getElementById('conf-personas').textContent = elementos.personas.value;
    document.getElementById('conf-nombre').textContent = elementos.nombre.value;
    document.getElementById('conf-email').textContent = elementos.email.value;

    elementos.formulario.style.display = 'none';
    elementos.confirmacion.classList.remove('oculto');
}

function nuevaReserva() {
    mesaSeleccionada = null;
    elementos.horaInicio.value = '';
    elementos.horaFin.value = '';
    elementos.personas.value = '';
    elementos.nombre.value = '';
    elementos.email.value = '';
    elementos.btnReservar.disabled = true;
    elementos.btnReservar.textContent = 'Confirmar Reserva';

    elementos.confirmacion.classList.add('oculto');
    elementos.formulario.style.display = 'block';

    cargarDatos();
}

function mostrarMensaje(texto, tipo) {
    elementos.mensaje.textContent = texto;
    elementos.mensaje.className = `mensaje ${tipo}`;
}

function ocultarMensaje() {
    elementos.mensaje.className = 'mensaje';
}

function formatearFecha(fecha) {
    const [year, month, day] = fecha.split('-');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
}