import Server from './config/appConfig'

async function app(): Promise<void> {
    const server = Server.getInstance()
    server.listen()
}

app();