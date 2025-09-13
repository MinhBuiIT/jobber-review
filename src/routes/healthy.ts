import { healthyCheck } from '@review/controllers/healthy.controller'
import { Router } from 'express'

const healthyRoute = (route: Router): Router => {
  route.get('/healthy', healthyCheck)
  return route
}

export default healthyRoute
