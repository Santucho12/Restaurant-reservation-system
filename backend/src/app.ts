import Server from './config/appConfig';
import Database, { createDatabaseIfNotExists } from './config/dbConfig';
import { modelRelations } from './models/ModelsRelations';
import ReservaService from './services/ReservaService';

async function app(): Promise<void> {
  await createDatabaseIfNotExists();
  const db = Database.getInstance();
  await db.connect();
  modelRelations();

  setInterval(() => {
    ReservaService.updateExpiredReservations();
  }, 60000);

  const server = Server.getInstance();
  server.listen();
}

app();
