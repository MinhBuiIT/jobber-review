import * as reviewService from '@review/services/review.service'
import { Request, Response } from 'express'
import { createReviewController } from '../review.controller'
import { authUserPayload, reviewDocument, reviewMockRequest, reviewMockResponse } from './mock/review.mock'

jest.mock('@review/services/review.service')
jest.mock('@minhbuiit/jobber-shared')
jest.mock('@review/queues/connection')
jest.mock('@elastic/elasticsearch')

describe('Review Controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('review method', () => {
    it('should return the correct response', async () => {
      const req: Request = reviewMockRequest({}, reviewDocument, authUserPayload) as unknown as Request
      const res: Response = reviewMockResponse()
      jest.spyOn(reviewService, 'createReview').mockResolvedValue(reviewDocument)

      await createReviewController(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ message: 'Create review successfully', data: reviewDocument })
    })
  })
})
