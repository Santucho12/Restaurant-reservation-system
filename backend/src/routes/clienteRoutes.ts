// Endpoints para crear, ver y cancelar clientes
import Router from 'express'
import ClienteController from '../controllers/ClienteController'

const clienteRoutes = Router()

clienteRoutes.get('/clientes', ClienteController.getAllClientes)
clienteRoutes.get('/clientes/:id', ClienteController.getCliente)
clienteRoutes.post('/clientes', ClienteController.createCliente)
clienteRoutes.put('/clientes/:id', ClienteController.updateCliente)
clienteRoutes.delete('/clientes/:id', ClienteController.deleteCliente)

export default clienteRoutes
