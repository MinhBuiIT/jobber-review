import { createReview, getReviewsByGigId, getReviewsBySellerId } from '@review/services/review.service'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const createReviewController = async (req: Request, res: Response) => {
  const result = await createReview(req.body)
  res.status(StatusCodes.CREATED).json({
    message: 'Create review successfully',
    data: result
  })
}

export const getReviewsByGigIdController = async (req: Request, res: Response) => {
  const { gigId } = req.params
  const result = await getReviewsByGigId(gigId)
  res.status(StatusCodes.OK).json({
    message: 'Get reviews by gig id successfully',
    data: result
  })
}

export const getReviewsBySellerIdController = async (req: Request, res: Response) => {
  const { sellerId } = req.params
  const result = await getReviewsBySellerId(sellerId)
  res.status(StatusCodes.OK).json({
    message: 'Get reviews by seller id successfully',
    data: result
  })
}
