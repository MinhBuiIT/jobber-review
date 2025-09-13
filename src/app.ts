import express from 'express'
import { Server } from './server'

class Application {
  public initialize(): void {
    const app = express()

    const server = new Server(app)
    server.start()
  }
}
const application = new Application()
application.initialize()
