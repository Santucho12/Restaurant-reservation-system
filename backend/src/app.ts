import Server from './config/appConfig'
import { connectDB, createDatabaseIfNotExists } from './config/dbConfig'

async function app(): Promise<void> {
    await createDatabaseIfNotExists()
    await connectDB()
    const server = Server.getInstance()
    server.listen()
}

app();