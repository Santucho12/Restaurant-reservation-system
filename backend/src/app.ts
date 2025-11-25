import Server from './config/server.config'

async function app(): Promise<void> {
    const server = Server.getInstance()
    server.listen()
}

app();