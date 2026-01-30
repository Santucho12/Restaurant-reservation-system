import express, { type Application } from 'express';
import { Response, Request } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import reservaRoutes from '../routes/reservaRoutes';
import mesaRoutes from '../routes/mesaRoutes';
import clienteRoutes from '../routes/clienteRoutes';
import authRoutes from '../routes/authRoutes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { globalErrorHandler } from '../middleware/errorMiddleware';

dotenv.config();

export default class Server {
  public static instance: Server;
  private app: Application;
  private PORT: number;
  private HOST: string;

  private constructor() {
    this.app = express();
    this.PORT = Number(process.env.PORT) || 3000;
    this.HOST = process.env.HOST?.trim() || 'localhost';
    this.middlewares();
    this.routes();
    this.swaggerDocs();
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public getApp(): Application {
    return this.app;
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(cors());
  }

  private routes(): void {
    this.app.use('/health', (req: Request, res: Response) =>
      res.status(200).json({
        status: 'ok',
      }),
    );

    this.app.use('/api/v1', authRoutes);
    this.app.use('/api/v1', reservaRoutes);
    this.app.use('/api/v1', mesaRoutes);
    this.app.use('/api/v1', clienteRoutes);
    this.app.use(globalErrorHandler);
  }

  private swaggerDocs(): void {
    const swaggerPath = path.join(__dirname, '../../swagger.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument),
    );
  }
  public listen(): void {
    this.app.listen(this.PORT, () => {
      console.log(`Servidor corriendo en: http://${this.HOST}:${this.PORT}`);
    });
  }
}
