import express, { type Application } from 'express'
import { Response, Request } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import reservaRoutes from '../routes/reservaRoutes'
import mesaRoutes from '../routes/mesaRoutes'
import clienteRoutes from '../routes/clienteRoutes'

dotenv.config()

export default class Server {
    public static instance: Server;
    private app: Application;
    private PORT: number
    private HOST: string

    private constructor() {
        this.app = express()
        this.PORT = Number(process.env.PORT) || 3000
        this.HOST = process.env.HOST?.trim() || 'localhost'
        this.middlewares()
        this.routes()
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    private middlewares(): void {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan("dev"))
        this.app.use(cors())
    }

    private routes(): void {
        this.app.use('/health', (req: Request, res: Response) => res.status(200).json(
            {
                "status": "ok",
            }
        ))

        this.app.use('/api/v1', reservaRoutes)
        this.app.use('/api/v1', mesaRoutes)
        this.app.use('/api/v1', clienteRoutes)
    }

    public listen(): void {
        this.app.listen(this.PORT, () => {
            console.log(`Servidor corriendo en: http://${this.HOST}:${this.PORT}`)
        })
    }
}