import { verifyTokenMiddleware } from '@minhbuiit/jobber-shared'
import { Application, Router } from 'express'
import healthyRoute from './healthy'
import reviewRouter from './review'

const router = Router()
const BASE_PATH = '/api/v1/review'

const initRoutes = (app: Application) => {
  app.use('/', healthyRoute(router))
  app.use(BASE_PATH, verifyTokenMiddleware, reviewRouter(router))
}

export default initRoutes
