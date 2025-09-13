import {
  createReviewController,
  getReviewsByGigIdController,
  getReviewsBySellerIdController
} from '@review/controllers/review.controller'
import { Router } from 'express'

const reviewRouter = (router: Router): Router => {
  router.post('/', createReviewController)
  router.get('/gig/:gigId', getReviewsByGigIdController)
  router.get('/seller/:sellerId', getReviewsBySellerIdController)
  return router
}

export default reviewRouter
