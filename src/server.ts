import { createLogger, CustomError, IErrorResponse } from '@minhbuiit/jobber-shared'
import config from '@review/config'
import { createConnection } from '@review/queues/connection'
import { Channel } from 'amqplib'
import compression from 'compression'
import cors from 'cors'
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import hpp from 'hpp'
import http from 'http'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import database from './database'
import elasticsearch from './elasticsearch'
import initRoutes from './routes'
// import initRoutes from './routes'
// import initRoutes from './routes'
// import { consumeGigUpdate, consumeSeedGig } from './queue/gig.consume'

const PORT = 4007
const logger = createLogger('info', 'review-service-server', config.ELASTICSEARCH_URL as string)
export let channelGlobal: Channel

export class Server {
  public app: Application
  constructor(app: Application) {
    this.app = app
  }

  public start() {
    this.startServer(this.app)
    this.securitySetup(this.app)
    this.standardServer(this.app)
    this.elasticsearchSetup()
    this.amqpSetup()
    this.postgresSetup()
    //this.redisSetup()
    this.routes(this.app)

    this.errorHandler(this.app)
  }

  public securitySetup(app: Application) {
    // Security setup code here
    app.set('trust proxy', 1)
    app.use(helmet())
    app.use(
      cors({
        origin: config.GATEWAY_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    )
    app.use(hpp())
    app.use((req, res, next) => {
      const bearer = req.headers['authorization']
      if (bearer) {
        const jwtToken = bearer.split(' ')[1]
        const decoded = jwt.verify(jwtToken, config.JWT_SECRET as string)
        ;(req as any).currentUser = decoded
      }
      next()
    })
  }

  private standardServer(app: Application): void {
    app.use(compression())
    app.use(json())
    app.use(urlencoded({ extended: true, limit: '20mb' }))
  }

  private async elasticsearchSetup(): Promise<void> {
    await elasticsearch.checkConnection()
  }

  private async amqpSetup(): Promise<void> {
    const channel = await createConnection()
    channelGlobal = channel as Channel
  }

  private async postgresSetup(): Promise<void> {
    await database.connect()
  }

  private routes(app: Application): void {
    // Define your routes here
    initRoutes(app)
  }
  private errorHandler(app: Application): void {
    app.use((err: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      logger.log('error', 'Error from review-service', err)
      if (err instanceof CustomError) {
        res.status(err.statusCode).json(err.seriallizeError())
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Review Server Error' })
      }
    })
  }

  private startServer(app: Application): void {
    try {
      logger.info(`Worker with process id: ${process.pid} on review server has started`)
      const httpServer = new http.Server(app)

      this.startHttpServer(httpServer)
    } catch (error) {
      logger.log('error', 'Error starting server', error)
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(PORT, () => {
      logger.info(`Review service is running on port ${PORT}`)
    })
  }
}

/**
 * Client (socket client) -> Gateway (socket server) -> Gateway (socket client) -> Chat service (socket server)
 *
 *
 */
